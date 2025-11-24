import { promises as fs } from "node:fs";
import path from "node:path";
import { createRequire } from "module";
import { DATA_PATH } from "../config.js";
import type { DatabaseShape, User, Deck, WordEntry, UserWord, Session, ImportJob, UserBadge, Teacher, Class, StudyRoom, ChatMessage, LMSConnection, SyncEvent, DailyLesson, UserProgress } from "../types.js";

const require = createRequire(import.meta.url);
const { PrismaClient } = require('c:/Users/Admin/Documents/english/backend/src/generated/client');

const prisma = new PrismaClient();
console.log('Prisma keys:', Object.keys(prisma));

const defaultDb: DatabaseShape = {
  users: [],
  decks: [],
  words: [],
  userWords: [],
  sessions: [],
  importJobs: [],
  userBadges: [],
  teachers: [],
  classes: [],
  studyRooms: [],
  chatMessages: [],
  lmsConnections: [],
  syncEvents: [],
  dailyLessons: [],
  userProgress: [],
};

class DataStore {
  private db: DatabaseShape = structuredClone(defaultDb);
  private ready = false;

  async init() {
    if (this.ready) return;
    try {
      await this.loadFromPrisma();
      console.log('Data loaded from SQLite via Prisma');
    } catch (error) {
      console.error('Failed to load from Prisma, falling back to default:', error);
      // If DB is empty or fails, we start with defaultDb
    }
    this.ready = true;
  }

  private async loadFromPrisma() {
    const [
      users, decks, words, userWords, sessions, importJobs, userBadges,
      teachers, classes, studyRooms, chatMessages, lmsConnections,
      syncEvents, dailyLessons, userProgress
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.deck.findMany(),
      prisma.wordEntry.findMany(),
      prisma.userWord.findMany(),
      prisma.session.findMany(),
      prisma.importJob.findMany(),
      prisma.userBadge.findMany(),
      prisma.teacher.findMany(),
      prisma.class.findMany(),
      prisma.studyRoom.findMany(),
      prisma.chatMessage.findMany(),
      prisma.lMSConnection.findMany(),
      prisma.syncEvent.findMany(),
      prisma.dailyLesson.findMany(),
      prisma.userProgress.findMany()
    ]);

    this.db.users = users.map(u => ({ ...u, role: u.role as any, language: u.language as any, lastSessionAt: u.lastSessionAt?.toISOString(), notificationTime: u.notificationTime || undefined }));
    this.db.decks = decks.map(d => ({ ...d, category: d.category as any, language: d.language as any }));
    this.db.words = words.map(w => ({ ...w, tags: w.tags ? JSON.parse(w.tags) : undefined, audioUrl: w.audioUrl || undefined, imageUrl: w.imageUrl || undefined, oppositeOf: w.oppositeOf || undefined }));
    this.db.userWords = userWords.map(uw => ({ ...uw, state: uw.state as any, dueDate: uw.dueDate.toISOString(), lastResult: uw.lastResult as any || undefined }));
    this.db.sessions = sessions.map(s => ({ ...s, createdAt: s.createdAt.toISOString(), completedAt: s.completedAt?.toISOString(), status: s.status as any, answers: JSON.parse(s.answers) }));
    this.db.importJobs = importJobs.map(j => ({ ...j, status: j.status as any, createdAt: j.createdAt.toISOString(), logs: JSON.parse(j.logs) }));
    this.db.userBadges = userBadges.map(b => ({ ...b, earnedAt: b.earnedAt.toISOString() }));
    this.db.teachers = teachers.map(t => ({ ...t, studentIds: JSON.parse(t.studentIds), createdAt: t.createdAt.toISOString() }));
    this.db.classes = classes.map(c => ({ ...c, studentIds: JSON.parse(c.studentIds), assignedDecks: JSON.parse(c.assignedDecks), createdAt: c.createdAt.toISOString(), description: c.description || undefined }));
    this.db.studyRooms = studyRooms.map(r => ({ ...r, memberIds: JSON.parse(r.memberIds), status: r.status as any, createdAt: r.createdAt.toISOString(), completedAt: r.completedAt?.toISOString() }));
    this.db.chatMessages = chatMessages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() }));
    this.db.lmsConnections = lmsConnections.map(c => ({ ...c, platform: c.platform as any, expiresAt: c.expiresAt.toISOString(), refreshToken: c.refreshToken || undefined }));
    this.db.syncEvents = syncEvents.map(e => ({ ...e, type: e.type as any, data: JSON.parse(e.data), timestamp: e.timestamp.toISOString() }));
    this.db.dailyLessons = dailyLessons.map(l => ({ ...l, type: l.type as any, wordIds: JSON.parse(l.wordIds) }));
    this.db.userProgress = userProgress.map(p => ({
      ...p,
      completedDays: JSON.parse(p.completedDays),
      weeklyTestScores: JSON.parse(p.weeklyTestScores),
      activityHistory: JSON.parse(p.activityHistory),
      startedAt: p.startedAt.toISOString(),
      lastActivityAt: p.lastActivityAt.toISOString(),
      completedAt: p.completedAt?.toISOString()
    }));
  }

  private async saveToPrisma() {
    // This is a naive implementation that upserts everything.
    // In a real app, we would track changes.
    // For MVP, we iterate and upsert sequentially to avoid transaction issues during migration.

    // Users
    for (const u of this.db.users) {
      const userData = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        dailyGoal: u.dailyGoal,
        language: u.language,
        streak: u.streak,
        lastSessionAt: u.lastSessionAt ? new Date(u.lastSessionAt) : null,
        xp: u.xp,
        notificationTime: u.notificationTime || null
      };

      try {
        await prisma.user.upsert({
          where: { id: u.id },
          update: userData,
          create: userData
        });
      } catch (e: any) {
        console.error('Error upserting user:', u.id, e.message);
      }
    }

    // Decks
    for (const d of this.db.decks) {
      try {
        await prisma.deck.upsert({
          where: { id: d.id },
          update: { ...d },
          create: { ...d }
        });
      } catch (e: any) {
        console.error('Error upserting deck:', d.id, e.message);
      }
    }

    // Words
    for (const w of this.db.words) {
      const data = { ...w, tags: JSON.stringify(w.tags || []), audioUrl: w.audioUrl || null, imageUrl: w.imageUrl || null, oppositeOf: w.oppositeOf || null };
      try {
        await prisma.wordEntry.upsert({ where: { id: w.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting word:', w.id, e.message);
      }
    }

    // UserWords
    for (const uw of this.db.userWords) {
      const data = { ...uw, dueDate: new Date(uw.dueDate), lastResult: uw.lastResult || null };
      try {
        await prisma.userWord.upsert({ where: { id: uw.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting userWord:', uw.id, e.message);
      }
    }

    // Sessions
    for (const s of this.db.sessions) {
      const data = {
        ...s,
        createdAt: new Date(s.createdAt),
        completedAt: s.completedAt ? new Date(s.completedAt) : null,
        answers: JSON.stringify(s.answers)
      };
      try {
        await prisma.session.upsert({ where: { id: s.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting session:', s.id, e.message);
      }
    }

    // ImportJobs
    for (const j of this.db.importJobs) {
      const data = { ...j, createdAt: new Date(j.createdAt), logs: JSON.stringify(j.logs) };
      try {
        await prisma.importJob.upsert({ where: { id: j.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting importJob:', j.id, e.message);
      }
    }

    // UserBadges
    for (const b of this.db.userBadges) {
      const data = { ...b, earnedAt: new Date(b.earnedAt) };
      try {
        await prisma.userBadge.upsert({ where: { id: b.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting userBadge:', b.id, e.message);
      }
    }

    // DailyLessons
    for (const l of this.db.dailyLessons) {
      const data = { ...l, wordIds: JSON.stringify(l.wordIds) };
      try {
        await prisma.dailyLesson.upsert({ where: { id: l.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting dailyLesson:', l.id, e.message);
      }
    }

    // UserProgress
    for (const p of this.db.userProgress) {
      const data = {
        ...p,
        completedDays: JSON.stringify(p.completedDays),
        weeklyTestScores: JSON.stringify(p.weeklyTestScores || []),
        activityHistory: JSON.stringify(p.activityHistory || []),
        startedAt: new Date(p.startedAt),
        lastActivityAt: new Date(p.lastActivityAt),
        completedAt: p.completedAt ? new Date(p.completedAt) : null
      };
      try {
        await prisma.userProgress.upsert({ where: { id: p.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting userProgress:', p.id, e.message);
      }
    }

    // Teachers
    for (const t of this.db.teachers) {
      const data = { ...t, studentIds: JSON.stringify(t.studentIds), createdAt: new Date(t.createdAt) };
      try {
        await prisma.teacher.upsert({ where: { id: t.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting teacher:', t.id, e.message);
      }
    }

    // Classes
    for (const c of this.db.classes) {
      const data = { ...c, studentIds: JSON.stringify(c.studentIds), assignedDecks: JSON.stringify(c.assignedDecks), createdAt: new Date(c.createdAt), description: c.description || null };
      try {
        await prisma.class.upsert({ where: { id: c.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting class:', c.id, e.message);
      }
    }

    // StudyRooms
    for (const r of this.db.studyRooms) {
      const data = { ...r, memberIds: JSON.stringify(r.memberIds), createdAt: new Date(r.createdAt), completedAt: r.completedAt ? new Date(r.completedAt) : null };
      try {
        await prisma.studyRoom.upsert({ where: { id: r.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting studyRoom:', r.id, e.message);
      }
    }

    // ChatMessages
    for (const m of this.db.chatMessages) {
      const data = { ...m, timestamp: new Date(m.timestamp) };
      try {
        await prisma.chatMessage.upsert({ where: { id: m.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting chatMessage:', m.id, e.message);
      }
    }

    // LMSConnections
    for (const c of this.db.lmsConnections) {
      const data = { ...c, expiresAt: new Date(c.expiresAt), refreshToken: c.refreshToken || null };
      try {
        await prisma.lMSConnection.upsert({ where: { id: c.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting lmsConnection:', c.id, e.message);
      }
    }

    // SyncEvents
    for (const e of this.db.syncEvents) {
      const data = { ...e, data: JSON.stringify(e.data), timestamp: new Date(e.timestamp) };
      try {
        await prisma.syncEvent.upsert({ where: { id: e.id }, update: data, create: data });
      } catch (e: any) {
        console.error('Error upserting syncEvent:', e.id, e.message);
      }
    }
  }

  get snapshot(): DatabaseShape {
    return this.db;
  }

  async save(mutator: (db: DatabaseShape) => void) {
    mutator(this.db);
    await this.saveToPrisma();
  }
}

export const dataStore = new DataStore();

