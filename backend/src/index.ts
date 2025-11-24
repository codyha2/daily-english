import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { PORT } from "./config.js";
import { dataStore } from "./services/dataStore.js";
import { authRouter } from "./routes/auth.js";
import { decksRouter } from "./routes/decks.js";
import { sessionsRouter } from "./routes/sessions.js";
import { usersRouter } from "./routes/users.js";
import { progressRouter } from "./routes/progress.js";
import { importRouter } from "./routes/imports.js";
import { teachersRouter } from "./routes/teachers.js";
import { shareRouter } from "./routes/share.js";
import { studyRoomsRouter } from "./routes/studyRooms.js";
import { lmsRouter } from "./routes/lms.js";
import { syncRouter } from "./routes/sync.js";
import aiRouter from "./routes/ai.js";
import { wordsRouter } from "./routes/words.js";
import { curriculumRouter } from "./routes/curriculum.js";
import wordFormationsRouter from "./routes/wordFormations.js";
import adminRouter from "./routes/admin.js";
import { initializeWebSocket } from "./services/websocket.js";
import { seedIfNeeded } from "./seed.js";

const app = express();
const httpServer = createServer(app);

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [/\.vercel\.app$/, /\.onrender\.com$/] // Allow Vercel and Render domains
    : '*', // Allow all origins in development
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRouter);
app.use("/decks", decksRouter);
app.use("/sessions", sessionsRouter);
app.use("/users", usersRouter);
app.use("/progress", progressRouter);
app.use("/imports", importRouter);
app.use("/teachers", teachersRouter);
app.use("/share", shareRouter);
app.use("/rooms", studyRoomsRouter);
app.use("/lms", lmsRouter);
app.use("/sync", syncRouter);
app.use("/ai", aiRouter);
app.use("/words", wordsRouter);
app.use("/curriculum", curriculumRouter);
app.use("/word-formations", wordFormationsRouter);
app.use("/admin", adminRouter);

async function start() {
  await dataStore.init();
  await seedIfNeeded();

  // Initialize WebSocket server
  initializeWebSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
    console.log(`WebSocket server ready`);
  });
}

start();


// Trigger restart to reload curriculum data

