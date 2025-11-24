import { Router } from "express";
import { v4 as uuid } from "uuid";
import { dataStore } from "../services/dataStore.js";

export const syncRouter = Router();

// Push sync events
syncRouter.post("/events", async (req, res) => {
    await dataStore.init();
    const { events } = req.body;

    if (!Array.isArray(events)) {
        return res.status(400).json({ error: "events must be an array" });
    }

    const syncEvents = events.map((e) => ({
        id: uuid(),
        userId: e.userId,
        type: e.type,
        data: e.data,
        timestamp: e.timestamp || new Date().toISOString(),
        synced: true,
    }));

    await dataStore.save((db) => {
        if (!db.syncEvents) db.syncEvents = [];
        db.syncEvents.push(...syncEvents);
    });

    res.json({ success: true, count: syncEvents.length });
});

// Pull sync events since timestamp
syncRouter.get("/events", async (req, res) => {
    await dataStore.init();
    const { userId, since } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }

    const { syncEvents } = dataStore.snapshot;
    const sinceDate = since ? new Date(since as string) : new Date(0);

    const events = syncEvents.filter(
        (e) =>
            e.userId === userId &&
            new Date(e.timestamp) > sinceDate
    );

    res.json({ events, count: events.length });
});

// Get all events for user (for full sync)
syncRouter.get("/events/all/:userId", async (req, res) => {
    await dataStore.init();
    const { userId } = req.params;
    const { syncEvents } = dataStore.snapshot;

    const events = syncEvents.filter((e) => e.userId === userId);

    res.json({ events, count: events.length });
});

// Clear synced events (cleanup)
syncRouter.delete("/events", async (req, res) => {
    await dataStore.init();
    const { userId, before } = req.query;

    if (!userId || !before) {
        return res.status(400).json({ error: "userId and before timestamp required" });
    }

    const beforeDate = new Date(before as string);

    await dataStore.save((db) => {
        db.syncEvents = db.syncEvents.filter(
            (e) => !(e.userId === userId && new Date(e.timestamp) < beforeDate)
        );
    });

    res.json({ success: true });
});

// Resolve conflict (last-write-wins strategy)
syncRouter.post("/resolve-conflict", async (req, res) => {
    await dataStore.init();
    const { eventId, resolution } = req.body;

    // In a real implementation, this would apply conflict resolution
    // For now, we just acknowledge
    res.json({ success: true, resolution: "last-write-wins" });
});
