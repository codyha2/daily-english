import { v4 as uuid } from "uuid";
import type { Badge, User, UserBadge } from "../types.js";

export const BADGES: Badge[] = [
  {
    id: "streak_7",
    name: "Streak 7",
    description: "Học 7 ngày liên tục",
    icon: "🔥",
    criteria: { type: "streak", value: 7 },
  },
  {
    id: "streak_30",
    name: "Streak 30",
    description: "Streak 30 ngày bền bỉ",
    icon: "🏆",
    criteria: { type: "streak", value: 30 },
  },
  {
    id: "words_100",
    name: "100 từ mastered",
    description: "Hoàn thành 100 từ",
    icon: "📚",
    criteria: { type: "words_mastered", value: 100 },
  },
  {
    id: "words_500",
    name: "500 từ mastered",
    description: "Master 500 từ vựng",
    icon: "🎯",
    criteria: { type: "words_mastered", value: 500 },
  },
  {
    id: "sessions_30",
    name: "30 Sessions",
    description: "Hoàn thành 30 phiên học",
    icon: "⚡",
    criteria: { type: "sessions_completed", value: 30 },
  },
  {
    id: "xp_5000",
    name: "5K XP",
    description: "Tích lũy 5000 XP",
    icon: "💎",
    criteria: { type: "xp", value: 5000 },
  },
];

interface BadgeStats {
  streak: number;
  wordsMastered: number;
  sessionsCompleted: number;
  xp: number;
}

export function evaluateBadges(
  user: User,
  stats: BadgeStats,
  ownedBadges: UserBadge[],
): UserBadge[] {
  const ownedIds = new Set(
    ownedBadges.filter((badge) => badge.userId === user.id).map((b) => b.badgeId),
  );

  return BADGES.filter((badge) => !ownedIds.has(badge.id))
    .filter((badge) => meetsCriteria(badge.criteria, stats))
    .map((badge) => ({
      id: uuid(),
      userId: user.id,
      badgeId: badge.id,
      earnedAt: new Date().toISOString(),
    }));
}

function meetsCriteria(criteria: Badge["criteria"], stats: BadgeStats) {
  switch (criteria.type) {
    case "streak":
      return stats.streak >= criteria.value;
    case "words_mastered":
      return stats.wordsMastered >= criteria.value;
    case "sessions_completed":
      return stats.sessionsCompleted >= criteria.value;
    case "xp":
      return stats.xp >= criteria.value;
    default:
      return false;
  }
}


