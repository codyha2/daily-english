import { Router } from "express";
import dayjs from "dayjs";
import { dataStore } from "../services/dataStore.js";
import { BADGES } from "../services/gamification.js";
import { AnalyticsService } from "../services/analytics.js";

export const progressRouter = Router();

progressRouter.get("/:userId/summary", async (req, res) => {
  await dataStore.init();
  const { userId } = req.params;
  const { userWords, sessions, words: allWords, users, userBadges } = dataStore.snapshot;
  const words = userWords.filter((entry) => entry.userId === userId);
  const mastered = words.filter((entry) => entry.state === "mastered").length;
  const weakest = [...words]
    .sort((a, b) => a.recallPercent - b.recallPercent)
    .map((entry) => {
      const details = allWords.find((word) => word.id === entry.wordId);
      if (!details) return null;
      return {
        ...details,
        recallPercent: entry.recallPercent,
      };
    })
    .filter(Boolean)
    .slice(0, 10);
  const past7 = sessions
    .filter((session) => session.userId === userId)
    .filter((session) => dayjs(session.createdAt).isAfter(dayjs().subtract(7, "day")))
    .map((session) => ({
      date: dayjs(session.createdAt).format("YYYY-MM-DD"),
      newWords: session.newTarget,
      reviewWords: session.reviewTarget,
      xp: session.xpEarned,
    }));

  const user = users.find((item) => item.id === userId);
  const badgeRecords = userBadges
    .filter((badge) => badge.userId === userId)
    .map((earned) => {
      const badge = BADGES.find((item) => item.id === earned.badgeId);
      if (!badge) return null;
      return {
        ...badge,
        earnedAt: earned.earnedAt,
      };
    })
    .filter(Boolean);

  res.json({
    mastered,
    totalWords: words.length,
    weakest,
    past7,
    xp: user?.xp ?? 0,
    streak: user?.streak ?? 0,
    badges: badgeRecords,
  });
});

progressRouter.get("/:userId/export", async (req, res) => {
  await dataStore.init();
  const { userId } = req.params;
  const { userWords, sessions, words: allWords } = dataStore.snapshot;
  const userWordsList = userWords.filter((entry) => entry.userId === userId);

  const csvRows: string[] = [
    "Word,Meaning,State,Recall%,Success Streak,Failure Count,Last Result,Due Date",
  ];

  userWordsList.forEach((entry) => {
    const word = allWords.find((w) => w.id === entry.wordId);
    if (!word) return;
    const row = [
      word.headword,
      word.meaningVi,
      entry.state,
      entry.recallPercent.toString(),
      entry.successStreak.toString(),
      entry.failureCount.toString(),
      entry.lastResult ?? "",
      entry.dueDate,
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",");
    csvRows.push(row);
  });

  const csv = csvRows.join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="progress-${userId}-${dayjs().format("YYYY-MM-DD")}.csv"`,
  );
  res.send("\ufeff" + csv);
});

// Get analytics for a user
progressRouter.get("/:userId/analytics", async (req, res) => {
  await dataStore.init();
  const { userId } = req.params;
  const period = parseInt(req.query.period as string) || 7;

  // Validate period
  if (![7, 30, 90].includes(period)) {
    return res.status(400).json({ error: "Period must be 7, 30, or 90 days" });
  }

  const db = dataStore.snapshot;
  const analytics = AnalyticsService.calculateAnalytics(db, userId, period);

  res.json(analytics);
});


