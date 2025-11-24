import { Router } from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { dataStore } from "../services/dataStore.js";
import {
  DEFAULT_NEW_WORDS,
  DEFAULT_REVIEW_WORDS,
} from "../config.js";
import { applyAnswer } from "../services/srs.js";
import { BADGES, evaluateBadges } from "../services/gamification.js";

export const sessionsRouter = Router();

const createSessionSchema = z.object({
  userId: z.string(),
  deckId: z.string(),
  newWords: z.number().min(1).max(50).optional(),
  reviewWords: z.number().min(0).max(50).optional(),
});

sessionsRouter.post("/", async (req, res) => {
  await dataStore.init();
  const parsed = createSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const { deckId, userId, newWords, reviewWords } = parsed.data;
  const db = dataStore.snapshot;
  const deckExists = db.decks.some((deck) => deck.id === deckId);
  const userExists = db.users.some((user) => user.id === userId);

  if (!deckExists || !userExists) {
    return res.status(404).json({ message: "Deck or user not found" });
  }

  const sessionId = uuid();
  const session = {
    id: sessionId,
    userId,
    deckId,
    createdAt: dayjs().toISOString(),
    newTarget: newWords ?? DEFAULT_NEW_WORDS,
    reviewTarget: reviewWords ?? DEFAULT_REVIEW_WORDS,
    status: "active" as const,
    answers: [],
    xpEarned: 0,
  };

  await dataStore.save((store) => {
    store.sessions.push(session);
  });

  const plan = buildSessionPlan(session, db.userWords, db.words);

  res.json({ session, plan });
});

const answerSchema = z.object({
  result: z.enum(["know", "hard", "dont"]),
  timeSpentMs: z.number().min(0).max(120000),
});

sessionsRouter.post("/:sessionId/answer/:wordId", async (req, res) => {
  await dataStore.init();
  const { sessionId, wordId } = req.params;
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const db = dataStore.snapshot;
  const session = db.sessions.find((item) => item.id === sessionId);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const userWord =
    db.userWords.find(
      (entry) => entry.userId === session.userId && entry.wordId === wordId,
    ) ??
    createUserWord(session.userId, wordId);

  const answer = {
    wordId,
    result: parsed.data.result,
    timestamp: dayjs().toISOString(),
    timeSpentMs: parsed.data.timeSpentMs,
  };

  const { updated, xp } = applyAnswer(userWord, answer);

  await dataStore.save((store) => {
    store.userWords = store.userWords.filter((uw) => uw.id !== userWord.id);
    store.userWords.push(updated);
    const targetSession = store.sessions.find((s) => s.id === sessionId);
    if (targetSession) {
      targetSession.answers.push(answer);
      targetSession.xpEarned += xp;
    }
  });

  res.json({ userWord: updated });
});

sessionsRouter.post("/:sessionId/complete", async (req, res) => {
  await dataStore.init();
  const { sessionId } = req.params;
  const db = dataStore.snapshot;
  const session = db.sessions.find((item) => item.id === sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  let awardedBadges: { id: string; name: string; icon: string; earnedAt: string }[] =
    [];

  await dataStore.save((store) => {
    const targetSession = store.sessions.find((s) => s.id === sessionId);
    if (targetSession) {
      targetSession.status = "completed";
      targetSession.completedAt = dayjs().toISOString();
    }
    const user = store.users.find((u) => u.id === session.userId);
    if (user) {
      const sameDay = dayjs(user.lastSessionAt).isSame(dayjs(), "day");
      user.streak = sameDay ? user.streak : user.streak + 1;
      user.lastSessionAt = dayjs().toISOString();
      user.xp += session.xpEarned;

       const stats = {
        streak: user.streak,
        wordsMastered: store.userWords.filter(
          (entry) => entry.userId === user.id && entry.state === "mastered",
        ).length,
        sessionsCompleted: store.sessions.filter(
          (s) => s.userId === user.id && s.status === "completed",
        ).length,
        xp: user.xp,
      };
      const newBadges = evaluateBadges(user, stats, store.userBadges);
      if (newBadges.length) {
        store.userBadges.push(...newBadges);
        awardedBadges = newBadges
          .map((earned) => {
            const badge = BADGES.find((item) => item.id === earned.badgeId);
            if (!badge) return null;
            return {
              id: badge.id,
              name: badge.name,
              icon: badge.icon,
              earnedAt: earned.earnedAt,
            };
          })
          .filter(Boolean) as { id: string; name: string; icon: string; earnedAt: string }[];
      }
    }
  });

  res.json({ sessionId, status: "completed", awardedBadges });
});

function buildSessionPlan(session, userWords, words) {
  const dueWords = userWords
    .filter((entry) => entry.userId === session.userId)
    .filter(
      (entry) =>
        entry.state !== "new" && dayjs(entry.dueDate).isBefore(dayjs().endOf("day")),
    )
    .sort((a, b) => a.recallPercent - b.recallPercent)
    .slice(0, session.reviewTarget)
    .map((entry) => words.find((word) => word.id === entry.wordId))
    .filter(Boolean);

  const newWords = words
    .filter((word) => word.deckId === session.deckId)
    .filter(
      (word) =>
        !userWords.some(
          (entry) =>
            entry.wordId === word.id && entry.userId === session.userId,
        ),
    )
    .slice(0, session.newTarget);

  return {
    dueWords,
    newWords,
  };
}

function createUserWord(userId: string, wordId: string) {
  return {
    id: `uw-${userId}-${wordId}`,
    userId,
    wordId,
    state: "new" as const,
    interval: 0,
    dueDate: dayjs().toISOString(),
    successStreak: 0,
    failureCount: 0,
    recallPercent: 50,
  };
}

