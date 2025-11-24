import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { v4 as uuid } from "uuid";
import { dataStore } from "../src/services/dataStore.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: pnpm import:csv <path-to-file>");
  process.exit(1);
}

async function run() {
  await dataStore.init();
  const rows: any[] = [];
  const parser = fs
    .createReadStream(path.resolve(filePath))
    .pipe(parse({ columns: true, trim: true }));

  for await (const record of parser) {
    rows.push(record);
  }

  await dataStore.save((store) => {
    rows.forEach((row) => {
      store.words.push({
        id: uuid(),
        deckId: row.category,
        headword: row.headword,
        partOfSpeech: row.part_of_speech ?? "noun",
        meaningVi: row.meaning_vi,
        exampleEn: row.example_en ?? "",
        exampleVi: row.example_vi ?? "",
        picturable: row.picturable === "true",
        imageUrl: row.image_url,
        audioUrl: row.audio_url,
        oppositeOf: row.opposite_of,
      });
    });
  });

  console.log(`Imported ${rows.length} rows.`);
}

run();


