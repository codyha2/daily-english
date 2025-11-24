import { Router } from "express";
import { v4 as uuid } from "uuid";
import { dataStore } from "../services/dataStore.js";
import { createLMSConnector } from "../services/lmsConnector.js";

export const lmsRouter = Router();

// Connect to LMS
lmsRouter.post("/connect", async (req, res) => {
    await dataStore.init();
    const { userId, platform, instanceUrl, username, password } = req.body;

    if (!userId || !platform || !instanceUrl || !username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const connector = createLMSConnector(platform, instanceUrl);
        const accessToken = await connector.authenticate({ username, password });

        const connection = {
            id: uuid(),
            userId,
            platform,
            instanceUrl,
            accessToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
            connected: true,
        };

        await dataStore.save((db) => {
            if (!db.lmsConnections) db.lmsConnections = [];

            // Remove existing connections for this user+platform
            db.lmsConnections = db.lmsConnections.filter(
                (c) => !(c.userId === userId && c.platform === platform)
            );

            db.lmsConnections.push(connection);
        });

        res.json({ connection: { ...connection, accessToken: "***" } });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get assignments from LMS
lmsRouter.get("/assignments", async (req, res) => {
    await dataStore.init();
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }

    const { lmsConnections } = dataStore.snapshot;
    const connection = lmsConnections.find(
        (c) => c.userId === userId && c.connected
    );

    if (!connection) {
        return res.status(404).json({ error: "No LMS connection found" });
    }

    try {
        const connector = createLMSConnector(connection.platform, connection.instanceUrl);
        // Re-authenticate (in real app, handle token refresh)
        const assignments = await connector.getAssignments(userId as string);

        res.json({ assignments });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Sync grade to LMS
lmsRouter.post("/sync-grade", async (req, res) => {
    await dataStore.init();
    const { userId, assignmentId, grade } = req.body;

    if (!userId || !assignmentId || grade === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const { lmsConnections } = dataStore.snapshot;
    const connection = lmsConnections.find(
        (c) => c.userId === userId && c.connected
    );

    if (!connection) {
        return res.status(404).json({ error: "No LMS connection found" });
    }

    try {
        const connector = createLMSConnector(connection.platform, connection.instanceUrl);
        await connector.submitGrade(assignmentId, userId, grade);

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get courses
lmsRouter.get("/courses", async (req, res) => {
    await dataStore.init();
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }

    const { lmsConnections } = dataStore.snapshot;
    const connection = lmsConnections.find(
        (c) => c.userId === userId && c.connected
    );

    if (!connection) {
        return res.status(404).json({ error: "No LMS connection found" });
    }

    try {
        const connector = createLMSConnector(connection.platform, connection.instanceUrl);
        const courses = await connector.getCourses(userId as string);

        res.json({ courses });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Import students from course
lmsRouter.post("/import-students", async (req, res) => {
    await dataStore.init();
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const { lmsConnections } = dataStore.snapshot;
    const connection = lmsConnections.find(
        (c) => c.userId === userId && c.connected
    );

    if (!connection) {
        return res.status(404).json({ error: "No LMS connection found" });
    }

    try {
        const connector = createLMSConnector(connection.platform, connection.instanceUrl);
        const students = await connector.getStudents(courseId);

        res.json({ students, count: students.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Disconnect LMS
lmsRouter.post("/disconnect", async (req, res) => {
    await dataStore.init();
    const { userId, platform } = req.body;

    await dataStore.save((db) => {
        const connection = db.lmsConnections.find(
            (c) => c.userId === userId && c.platform === platform
        );
        if (connection) {
            connection.connected = false;
        }
    });

    res.json({ success: true });
});
