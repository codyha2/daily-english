import dayjs from "dayjs";
import type { DatabaseShape, AnalyticsData, Session } from "../types.js";

export class AnalyticsService {
    /**
     * Calculate analytics for a user over a specific period
     */
    static calculateAnalytics(
        db: DatabaseShape,
        userId: string,
        period: number
    ): AnalyticsData {
        const startDate = dayjs().subtract(period, "day");
        const previousStartDate = dayjs().subtract(period * 2, "day");

        // Get sessions in the current period
        const sessions = db.sessions.filter(
            (s) =>
                s.userId === userId &&
                s.status === "completed" &&
                dayjs(s.createdAt).isAfter(startDate)
        );

        // Get sessions in the previous period for comparison
        const previousSessions = db.sessions.filter(
            (s) =>
                s.userId === userId &&
                s.status === "completed" &&
                dayjs(s.createdAt).isAfter(previousStartDate) &&
                dayjs(s.createdAt).isBefore(startDate)
        );

        // Daily XP trend
        const dailyXp = this.calculateDailyXp(sessions, period);

        // Word mastery rate
        const wordMasteryRate = this.calculateWordMasteryRate(db, userId, period);

        // Accuracy trend
        const accuracyTrend = this.calculateAccuracyTrend(sessions, period);

        // Learning velocity (words learned per day)
        const learningVelocity = this.calculateLearningVelocity(db, userId, period);
        const previousVelocity = this.calculateLearningVelocity(
            db,
            userId,
            period,
            previousStartDate,
            startDate
        );

        // Weak categories
        const weakCategories = this.getWeakWordCategories(db, userId);

        // Total sessions and average XP
        const totalSessions = sessions.length;
        const averageSessionXp =
            totalSessions > 0
                ? sessions.reduce((sum, s) => sum + s.xpEarned, 0) / totalSessions
                : 0;

        // Comparison with previous period
        const currentXp = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
        const previousXp = previousSessions.reduce((sum, s) => sum + s.xpEarned, 0);
        const xpChange = previousXp > 0 ? ((currentXp - previousXp) / previousXp) * 100 : 0;

        const velocityChange =
            previousVelocity > 0
                ? ((learningVelocity - previousVelocity) / previousVelocity) * 100
                : 0;

        const currentAccuracy = this.getAverageAccuracy(sessions);
        const previousAccuracy = this.getAverageAccuracy(previousSessions);
        const accuracyChange =
            previousAccuracy > 0
                ? ((currentAccuracy - previousAccuracy) / previousAccuracy) * 100
                : 0;

        return {
            period,
            dailyXp,
            wordMasteryRate,
            accuracyTrend,
            learningVelocity,
            weakCategories,
            totalSessions,
            averageSessionXp,
            comparisonVsPrevious: {
                xpChange,
                velocityChange,
                accuracyChange,
            },
        };
    }

    private static calculateDailyXp(
        sessions: Session[],
        period: number
    ): { date: string; xp: number }[] {
        const dailyMap = new Map<string, number>();

        // Initialize all days with 0
        for (let i = 0; i < period; i++) {
            const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
            dailyMap.set(date, 0);
        }

        // Add XP from sessions
        sessions.forEach((session) => {
            const date = dayjs(session.createdAt).format("YYYY-MM-DD");
            const current = dailyMap.get(date) || 0;
            dailyMap.set(date, current + session.xpEarned);
        });

        return Array.from(dailyMap.entries())
            .map(([date, xp]) => ({ date, xp }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private static calculateWordMasteryRate(
        db: DatabaseShape,
        userId: string,
        period: number
    ): { date: string; rate: number }[] {
        const userWords = db.userWords.filter((uw) => uw.userId === userId);
        const results: { date: string; rate: number }[] = [];

        for (let i = 0; i < period; i++) {
            const date = dayjs().subtract(i, "day");
            const mastered = userWords.filter(
                (uw) =>
                    uw.state === "mastered" &&
                    dayjs(uw.dueDate).isBefore(date)
            ).length;
            const total = userWords.length || 1;
            results.push({
                date: date.format("YYYY-MM-DD"),
                rate: (mastered / total) * 100,
            });
        }

        return results.sort((a, b) => a.date.localeCompare(b.date));
    }

    private static calculateAccuracyTrend(
        sessions: Session[],
        period: number
    ): { date: string; accuracy: number }[] {
        const dailyMap = new Map<string, { correct: number; total: number }>();

        // Initialize all days
        for (let i = 0; i < period; i++) {
            const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
            dailyMap.set(date, { correct: 0, total: 0 });
        }

        // Calculate accuracy per day
        sessions.forEach((session) => {
            const date = dayjs(session.createdAt).format("YYYY-MM-DD");
            const stats = dailyMap.get(date) || { correct: 0, total: 0 };

            session.answers.forEach((answer) => {
                stats.total++;
                if (answer.result === "know") {
                    stats.correct++;
                }
            });

            dailyMap.set(date, stats);
        });

        return Array.from(dailyMap.entries())
            .map(([date, stats]) => ({
                date,
                accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private static calculateLearningVelocity(
        db: DatabaseShape,
        userId: string,
        period: number,
        startDate: dayjs.Dayjs = dayjs().subtract(period, "day"),
        endDate: dayjs.Dayjs = dayjs()
    ): number {
        const newWords = db.userWords.filter(
            (uw) =>
                uw.userId === userId &&
                dayjs(uw.dueDate).isAfter(startDate) &&
                dayjs(uw.dueDate).isBefore(endDate)
        );

        return newWords.length / period;
    }

    private static getWeakWordCategories(
        db: DatabaseShape,
        userId: string
    ): { category: string; accuracy: number }[] {
        const userWords = db.userWords.filter((uw) => uw.userId === userId);
        const categoryMap = new Map<string, { correct: number; total: number }>();

        userWords.forEach((uw) => {
            const word = db.words.find((w) => w.id === uw.wordId);
            if (!word) return;

            const deck = db.decks.find((d) => d.id === word.deckId);
            if (!deck) return;

            const category = deck.category;
            const stats = categoryMap.get(category) || { correct: 0, total: 0 };

            stats.total++;
            if (uw.recallPercent >= 70) {
                stats.correct++;
            }

            categoryMap.set(category, stats);
        });

        return Array.from(categoryMap.entries())
            .map(([category, stats]) => ({
                category,
                accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
            }))
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 5); // Top 5 weakest
    }

    private static getAverageAccuracy(sessions: Session[]): number {
        let correct = 0;
        let total = 0;

        sessions.forEach((session) => {
            session.answers.forEach((answer) => {
                total++;
                if (answer.result === "know") {
                    correct++;
                }
            });
        });

        return total > 0 ? (correct / total) * 100 : 0;
    }
}
