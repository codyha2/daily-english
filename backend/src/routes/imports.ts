import { Router } from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { parse } from "csv-parse/sync";
import pdf from "pdf-parse";
import { dataStore } from "../services/dataStore.js";
import type { WordEntry } from "../types.js";

const upload = multer({ storage: multer.memoryStorage() });

export const importRouter = Router();

importRouter.post(
  "/",
  upload.single("file"),
  async (req, res): Promise<void> => {
    await dataStore.init();
    if (!req.file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const jobId = uuid();
    const logs: string[] = [];
    let parsedRows: WordEntry[] = [];

    try {
      parsedRows = await parseFile(req.file.buffer, req.file.originalname, logs);
      await dataStore.save((store) => {
        parsedRows.forEach((row) => {
          const existing = store.words.find(
            (word) =>
              word.deckId === row.deckId &&
              word.headword.toLowerCase() === row.headword.toLowerCase(),
          );
          if (!existing) {
            store.words.push(row);
          } else {
            logs.push(`Skipped duplicate ${row.headword}`);
          }
        });

        const job = {
          id: jobId,
          userId: String(req.body.userId ?? "admin"),
          fileName: req.file.originalname,
          status: "parsed" as const,
          createdAt: new Date().toISOString(),
          rows: parsedRows.length,
          logs,
        };
        store.importJobs.push(job);
      });
    } catch (error) {
      logs.push(
        error instanceof Error ? error.message : "Unknown import error",
      );
      await dataStore.save((store) => {
        store.importJobs.push({
          id: jobId,
          userId: String(req.body.userId ?? "admin"),
          fileName: req.file.originalname,
          status: "error",
          createdAt: new Date().toISOString(),
          rows: 0,
          logs,
        });
      });
      res.status(400).json({ jobId, message: logs.at(-1) });
      return;
    }

    res.json({
      jobId,
      rows: parsedRows.length,
      preview: parsedRows.slice(0, 20),
      logs,
    });
  },
);

importRouter.get("/:jobId", async (req, res) => {
  await dataStore.init();
  const { jobId } = req.params;
  const job = dataStore.snapshot.importJobs.find((item) => item.id === jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  res.json({ job });
});

async function parseFile(
  buffer: Buffer,
  fileName: string,
  logs: string[],
): Promise<WordEntry[]> {
  if (fileName.endsWith(".csv")) {
    return parseCsv(buffer, logs);
  }
  if (fileName.endsWith(".json")) {
    return parseJson(buffer, logs);
  }
  if (fileName.endsWith(".pdf")) {
    return parsePdf(buffer, logs);
  }
  throw new Error("Supported formats: CSV, JSON, PDF");
}

const AUDIO_API =
  process.env.TTS_API_URL ?? "https://translate.google.com/translate_tts";
const IMAGE_PLACEHOLDER =
  "https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/image.svg";

async function parseCsv(buffer: Buffer, logs: string[]): Promise<WordEntry[]> {
  const records = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  const rows: WordEntry[] = [];
  for (let index = 0; index < records.length; index += 1) {
    const normalized = await normalizeRecord(records[index]);
    if (!normalized) {
      logs.push(`Row ${index + 1} skipped: missing headword or category`);
      continue;
    }
    rows.push(normalized);
  }
  return rows;
}

async function parseJson(buffer: Buffer, logs: string[]): Promise<WordEntry[]> {
  const data = JSON.parse(buffer.toString());
  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of word objects");
  }
  const rows: WordEntry[] = [];
  for (let index = 0; index < data.length; index += 1) {
    const normalized = await normalizeRecord(data[index]);
    if (!normalized) {
      logs.push(`Row ${index + 1} skipped: missing headword or category`);
      continue;
    }
    rows.push(normalized);
  }
  return rows;
}

async function normalizeRecord(record: Record<string, any>): Promise<WordEntry | null> {
  const headword =
    record.headword ?? record.word ?? record.term ?? record.Headword;
  const category = String(record.category ?? record.deck ?? "").toLowerCase();
  const deckId = resolveDeckId(category);
  if (!headword || !deckId) return null;

  const base: WordEntry = {
    id: uuid(),
    deckId,
    headword: String(headword).trim(),
    partOfSpeech:
      record.partOfSpeech ?? record.part_of_speech ?? record.pos ?? "noun",
    meaningVi: record.meaningVi ?? record.meaning_vi ?? record.translation ?? "",
    exampleEn: record.exampleEn ?? record.example_en ?? "",
    exampleVi: record.exampleVi ?? record.example_vi ?? "",
    picturable:
      record.picturable === true ||
      String(record.picturable).toLowerCase() === "true" ||
      deckId === "deck-picturable",
    audioUrl: record.audioUrl ?? record.audio_url,
    imageUrl: record.imageUrl ?? record.image_url,
    tags: record.tags,
    oppositeOf: record.oppositeOf ?? record.opposite_of,
  };
  return enrichMedia(base);
}

function resolveDeckId(category: string) {
  const normalized = category.replace(/\s+/g, "_");
  const map: Record<string, string> = {
    operations: "deck-operations",
    operations_100: "deck-operations",
    things: "deck-things",
    things_general: "deck-things",
    "things_(general)": "deck-things",
    things_picturable: "deck-picturable",
    picturable: "deck-picturable",
    qualities: "deck-qualities",
    qualities_opposites: "deck-qualities",
    opposites: "deck-qualities",
  };
  return map[normalized] ?? null;
}

async function parsePdf(buffer: Buffer, logs: string[]): Promise<WordEntry[]> {
  const result = await pdf(buffer);
  const lines = result.text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let currentDeck: string | null = null;
  const rows: WordEntry[] = [];

  for (const line of lines) {
    const deckId = detectDeck(line);
    if (deckId) {
      currentDeck = deckId;
      logs.push(`Detected section: ${line}`);
      continue;
    }

    if (!currentDeck) continue;
    const parsed = await parsePdfLine(line, currentDeck);
    if (parsed) rows.push(parsed);
  }

  if (rows.length === 0) {
    throw new Error("Không tìm được dữ liệu từ PDF. Kiểm tra định dạng file.");
  }

  return rows;
}

function detectDeck(line: string) {
  const normalized = line.toLowerCase();
  if (normalized.includes("operations")) return "deck-operations";
  if (
    normalized.includes("things") &&
    normalized.includes("picturable")
  )
    return "deck-picturable";
  if (normalized.includes("things")) return "deck-things";
  if (normalized.includes("qualities") || normalized.includes("opposites"))
    return "deck-qualities";
  return null;
}

async function parsePdfLine(line: string, deckId: string): Promise<WordEntry | null> {
  // Expect patterns like "accept (v) : chấp nhận"
  const regex = /^([A-Za-z-]+)\s*\(([^)]+)\)\s*[:\-]\s*(.+)$/;
  const match = line.match(regex);
  if (!match) return null;
  const [, headword, pos, meaning] = match;

  return enrichMedia({
    id: uuid(),
    deckId,
    headword,
    partOfSpeech: pos,
    meaningVi: meaning,
    exampleEn: "",
    exampleVi: "",
    picturable: deckId === "deck-picturable",
  });
}

async function enrichMedia(word: WordEntry) {
  if (!word.audioUrl) {
    word.audioUrl = await synthesizeAudio(word.headword);
  }
  if (word.picturable && !word.imageUrl) {
    word.imageUrl = `${IMAGE_PLACEHOLDER}?text=${encodeURIComponent(word.headword)}`;
  }
  return word;
}

async function synthesizeAudio(text: string) {
  try {
    const url = `${AUDIO_API}?client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      throw new Error("Cannot generate audio");
    }
    return url;
  } catch {
    return undefined;
  }
}

