import path from "node:path";

export const PORT = Number(process.env.PORT ?? 4000);
export const DATA_PATH = path.resolve("data/db.json");
export const DEFAULT_NEW_WORDS = 10;
export const DEFAULT_REVIEW_WORDS = 10;
export const SRS_INTERVALS = [1, 3, 7, 14, 30];


