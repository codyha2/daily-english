import dayjs from "dayjs";
import { SRS_INTERVALS } from "../config.js";
import type { SessionAnswer, UserWord, WordState } from "../types.js";

const XP_REWARD = {
  know: 10,
  hard: 6,
  dont: -2,
} as const;

const NEXT_STATE: Record<
  SessionAnswer["result"],
  (current: WordState) => WordState
> = {
  know: (current) => (current === "mastered" ? "mastered" : "learning"),
  hard: () => "learning",
  dont: () => "forgotten",
};

export function nextInterval(current: number, result: SessionAnswer["result"]) {
  const idx = Math.max(
    SRS_INTERVALS.findIndex((value) => value === current),
    -1,
  );

  if (result === "dont") return 0;
  if (result === "hard") {
    const prev = idx <= 0 ? 0 : SRS_INTERVALS[idx - 1];
    return prev;
  }
  const next = SRS_INTERVALS[idx + 1] ?? SRS_INTERVALS[SRS_INTERVALS.length - 1];
  return idx === -1 ? SRS_INTERVALS[0] : next;
}

export function calcDueDate(
  interval: number,
  refDate: string = dayjs().toISOString(),
) {
  const base = dayjs(refDate);
  if (interval <= 0) return base.toISOString();
  return base.add(interval, "day").toISOString();
}

export function updateRecallPercent(
  current: number,
  result: SessionAnswer["result"],
) {
  const target = result === "dont" ? 0 : result === "hard" ? 60 : 100;
  return Math.round(current * 0.6 + target * 0.4);
}

export function applyAnswer(
  userWord: UserWord,
  answer: SessionAnswer,
): { updated: UserWord; xp: number } {
  const interval = nextInterval(userWord.interval, answer.result);
  const dueDate = calcDueDate(interval);
  const state = NEXT_STATE[answer.result](userWord.state);
  const recallPercent = updateRecallPercent(
    userWord.recallPercent ?? 50,
    answer.result,
  );
  const successStreak =
    answer.result === "dont" ? 0 : userWord.successStreak + 1;
  const failureCount =
    answer.result === "dont" ? userWord.failureCount + 1 : userWord.failureCount;

  return {
    updated: {
      ...userWord,
      interval,
      dueDate,
      state,
      recallPercent,
      lastResult: answer.result,
      successStreak,
      failureCount,
    },
    xp: XP_REWARD[answer.result],
  };
}


