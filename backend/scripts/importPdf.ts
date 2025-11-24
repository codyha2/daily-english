import fs from "node:fs";
import path from "node:path";
import pdf from "pdf-parse";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: pnpm import:pdf <path-to-pdf>");
  process.exit(1);
}

async function run() {
  const buffer = await fs.promises.readFile(path.resolve(filePath));
  const data = await pdf(buffer);
  console.log("PDF length (chars):", data.text.length);
  console.log("Implement custom parser here to map categories.");
}

run();


