import { Router } from "express";
import { v4 as uuid } from "uuid";
import { dataStore } from "../services/dataStore.js";

export const studyRoomsRouter = Router();

// Generate 6-digit room code
function generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create study room
studyRoomsRouter.post("/", async (req, res) => {
    await dataStore.init();
    const { name, deckId, ownerId, maxMembers = 10, isPublic = true } = req.body;

    if (!name || !deckId || !ownerId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const room = {
        id: uuid(),
        name,
        code: generateRoomCode(),
        ownerId,
        memberIds: [ownerId],
        deckId,
        status: "waiting" as const,
        maxMembers,
        isPublic,
        createdAt: new Date().toISOString(),
    };

    await dataStore.save((db) => {
        if (!db.studyRooms) db.studyRooms = [];
        db.studyRooms.push(room);
    });

    res.status(201).json({ room });
});

// List rooms
studyRoomsRouter.get("/", async (req, res) => {
    await dataStore.init();
    const { studyRooms } = dataStore.snapshot;

    // Only show public rooms or rooms user is member of
    const userId = req.query.userId as string;
    const filtered = studyRooms.filter(
        (room) =>
            room.isPublic ||
            (userId && room.memberIds.includes(userId))
    );

    res.json({ rooms: filtered });
});

// Get room details
studyRoomsRouter.get("/:id", async (req, res) => {
    await dataStore.init();
    const { id } = req.params;
    const { studyRooms } = dataStore.snapshot;

    const room = studyRooms.find((r) => r.id === id);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    res.json({ room });
});

// Join room
studyRoomsRouter.post("/:id/join", async (req, res) => {
    await dataStore.init();
    const { id } = req.params;
    const { userId, code } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }

    const { studyRooms } = dataStore.snapshot;
    const room = studyRooms.find((r) => r.id === id);

    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    // Verify code for private rooms
    if (!room.isPublic && room.code !== code) {
        return res.status(403).json({ error: "Invalid room code" });
    }

    // Check if already member
    if (room.memberIds.includes(userId)) {
        return res.json({ room, message: "Already a member" });
    }

    // Check capacity
    if (room.memberIds.length >= room.maxMembers) {
        return res.status(403).json({ error: "Room is full" });
    }

    await dataStore.save((db) => {
        const r = db.studyRooms.find((room) => room.id === id);
        if (r) {
            r.memberIds.push(userId);
        }
    });

    const updatedRoom = dataStore.snapshot.studyRooms.find((r) => r.id === id);
    res.json({ room: updatedRoom });
});

// Leave room
studyRoomsRouter.post("/:id/leave", async (req, res) => {
    await dataStore.init();
    const { id } = req.params;
    const { userId } = req.body;

    await dataStore.save((db) => {
        const room = db.studyRooms.find((r) => r.id === id);
        if (room) {
            room.memberIds = room.memberIds.filter((uid) => uid !== userId);

            // If owner leaves, transfer ownership or close room
            if (room.ownerId === userId) {
                if (room.memberIds.length > 0) {
                    room.ownerId = room.memberIds[0];
                } else {
                    room.status = "completed";
                }
            }
        }
    });

    res.json({ success: true });
});

// Get room members
studyRoomsRouter.get("/:id/members", async (req, res) => {
    await dataStore.init();
    const { id } = req.params;
    const { studyRooms, users } = dataStore.snapshot;

    const room = studyRooms.find((r) => r.id === id);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    const members = users.filter((u) => room.memberIds.includes(u.id));
    res.json({ members });
});

// Send chat message
studyRoomsRouter.post("/:id/chat", async (req, res) => {
    await dataStore.init();
    const { id } = req.params;
    const { userId, message } = req.body;

    const { studyRooms, users } = dataStore.snapshot;
    const room = studyRooms.find((r) => r.id === id);
    const user = users.find((u) => u.id === userId);

    if (!room || !user) {
        return res.status(404).json({ error: "Room or user not found" });
    }

    if (!room.memberIds.includes(userId)) {
        return res.status(403).json({ error: "Not a member of this room" });
    }

    const chatMessage = {
        id: uuid(),
        roomId: id,
        userId,
        userName: user.name,
        message,
        timestamp: new Date().toISOString(),
    };

    await dataStore.save((db) => {
        if (!db.chatMessages) db.chatMessages = [];
        db.chatMessages.push(chatMessage);
    });

    res.json({ message: chatMessage });
});

// Get chat history
studyRoomsRouter.get("/:id/chat", async (req, res) => {
    await dataStore.init();
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const { chatMessages } = dataStore.snapshot;
    const messages = chatMessages
        .filter((m) => m.roomId === id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .slice(-limit);

    res.json({ messages });
});

// Start session (owner only)
studyRoomsRouter.post("/:id/start-session", async (req, res) => {
    await dataStore.init();
    const { id } = req.params;
    const { userId } = req.body;

    const { studyRooms } = dataStore.snapshot;
    const room = studyRooms.find((r) => r.id === id);

    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    if (room.ownerId !== userId) {
        return res.status(403).json({ error: "Only room owner can start session" });
    }

    await dataStore.save((db) => {
        const r = db.studyRooms.find((room) => room.id === id);
        if (r) {
            r.status = "active";
        }
    });

    res.json({ success: true, status: "active" });
});
