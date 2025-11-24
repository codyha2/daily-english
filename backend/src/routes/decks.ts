import { Router } from "express";
import type { Request, Response } from "express";
import { dataStore } from "../services/dataStore.js";

export const decksRouter = Router();

decksRouter.get("/", async (_req: Request, res: Response) => {
  await dataStore.init();
  const { decks } = dataStore.snapshot;
  res.json({ decks });
});

decksRouter.get("/:deckId/words", async (req: Request, res: Response) => {
  await dataStore.init();
  const { deckId } = req.params;
  const { state, limit = "50", all } = req.query;
  const parsedLimit = Number(limit);
  const { words, userWords } = dataStore.snapshot;
  const deckWords = words.filter((word) => word.deckId === deckId);

  if (all === "true") {
    res.json({ words: deckWords });
    return;
  }

  const filtered =
    typeof state === "string"
      ? deckWords.filter((word) =>
          userWords.some(
            (uw) => uw.wordId === word.id && uw.state === state,
          ),
        )
      : deckWords;

  res.json({ words: filtered.slice(0, parsedLimit) });
});

