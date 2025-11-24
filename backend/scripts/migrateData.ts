import { promises as fs } from "node:fs";
import path from "node:path";
import { dataStore } from "../src/services/dataStore.js";
import { DATA_PATH } from "../src/config.js";

async function migrate() {
    console.log("Starting migration...");

    // 1. Read existing JSON file
    try {
        const raw = await fs.readFile(DATA_PATH, "utf-8");
        const jsonData = JSON.parse(raw);
        console.log("Loaded JSON data.");

        // 2. Initialize DataStore (which connects to Prisma)
        await dataStore.init();

        // 3. Save data to Prisma
        // We use the save method which now writes to SQLite
        await dataStore.save((db) => {
            // Overwrite in-memory DB with JSON data
            Object.assign(db, jsonData);
        });

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

migrate();
