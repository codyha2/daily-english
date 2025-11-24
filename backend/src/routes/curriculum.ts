import express from 'express';
import { v4 as uuid } from 'uuid';
import { prisma } from '../db.js';

export const curriculumRouter = express.Router();

// Get curriculum for a deck (all 60 daily lessons)
curriculumRouter.get('/:deckId', async (req, res) => {
    try {
        const { deckId } = req.params;

        const lessons = await prisma.dailyLesson.findMany({
            where: { deckId },
            orderBy: { day: 'asc' }
        });

        // Parse wordIds from JSON string if needed (Prisma stores it as String in SQLite usually, but let's check schema)
        // In the schema it says `wordIds String // JSON string: string[]`
        // So we need to parse it if we want to return it as array, or the frontend expects it.
        // The original code returned `lessons` directly from `db.dailyLessons`.
        // `db.dailyLessons` was likely typed with `wordIds: string[]` in memory but stored as string in DB.
        // We need to map it.

        const parsedLessons = lessons.map(l => ({
            ...l,
            wordIds: JSON.parse(l.wordIds)
        }));

        res.json({
            success: true,
            lessons: parsedLessons,
            totalDays: lessons.length
        });
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch curriculum'
        });
    }
});

// Get user's progress for a deck
curriculumRouter.get('/progress/:userId/:deckId', async (req, res) => {
    try {
        const { userId, deckId } = req.params;

        let progress = await prisma.userProgress.findFirst({
            where: { userId, deckId }
        });

        // Create new progress if doesn't exist
        if (!progress) {
            progress = await prisma.userProgress.create({
                data: {
                    userId,
                    deckId,
                    currentDay: 1,
                    completedDays: "[]",
                    weeklyTestScores: "[]",
                    totalWordsLearned: 0,
                    streak: 0,
                    startedAt: new Date(),
                    lastActivityAt: new Date(),
                    activityHistory: "[]"
                }
            });
        }

        // Parse JSON fields
        const parsedProgress = {
            ...progress,
            completedDays: JSON.parse(progress.completedDays),
            weeklyTestScores: JSON.parse(progress.weeklyTestScores),
            activityHistory: JSON.parse(progress.activityHistory)
        };

        res.json({
            success: true,
            progress: parsedProgress
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch progress'
        });
    }
});

// Get today's lesson (current day for user)
curriculumRouter.get('/daily-lesson/:userId/:deckId/current', async (req, res) => {
    try {
        const { userId, deckId } = req.params;

        // Get user progress
        let progress = await prisma.userProgress.findFirst({
            where: { userId, deckId }
        });

        if (!progress) {
            progress = await prisma.userProgress.create({
                data: {
                    userId,
                    deckId,
                    currentDay: 1,
                    completedDays: "[]",
                    weeklyTestScores: "[]",
                    totalWordsLearned: 0,
                    streak: 0,
                    startedAt: new Date(),
                    lastActivityAt: new Date(),
                    activityHistory: "[]"
                }
            });
        }

        // Get current day's lesson
        const lesson = await prisma.dailyLesson.findFirst({
            where: {
                deckId,
                day: progress.currentDay
            }
        });

        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: 'No lesson found for current day'
            });
        }

        const wordIds = JSON.parse(lesson.wordIds) as string[];

        // Get words for this lesson
        const words = await prisma.wordEntry.findMany({
            where: {
                id: { in: wordIds }
            }
        });

        // Parse JSON fields for response
        const parsedProgress = {
            ...progress,
            completedDays: JSON.parse(progress.completedDays),
            weeklyTestScores: JSON.parse(progress.weeklyTestScores),
            activityHistory: JSON.parse(progress.activityHistory)
        };

        const parsedLesson = {
            ...lesson,
            wordIds
        };

        res.json({
            success: true,
            lesson: parsedLesson,
            words,
            progress: parsedProgress
        });
    } catch (error) {
        console.error('Error in daily-lesson endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch daily lesson'
        });
    }
});

// Get specific day's lesson
curriculumRouter.get('/daily-lesson/:userId/:deckId/day/:day', async (req, res) => {
    try {
        const { userId, deckId, day } = req.params;
        const dayNum = parseInt(day);

        // Get user progress
        const progress = await prisma.userProgress.findFirst({
            where: { userId, deckId }
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Progress not found'
            });
        }

        const completedDays = JSON.parse(progress.completedDays) as number[];

        // Check if day is unlocked (completed or current)
        if (dayNum > progress.currentDay && !completedDays.includes(dayNum)) {
            return res.status(403).json({
                success: false,
                error: 'Day is locked'
            });
        }

        // Get lesson
        const lesson = await prisma.dailyLesson.findFirst({
            where: {
                deckId,
                day: dayNum
            }
        });

        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: 'Lesson not found'
            });
        }

        const wordIds = JSON.parse(lesson.wordIds) as string[];

        // Get words
        const words = await prisma.wordEntry.findMany({
            where: {
                id: { in: wordIds }
            }
        });

        const parsedProgress = {
            ...progress,
            completedDays,
            weeklyTestScores: JSON.parse(progress.weeklyTestScores),
            activityHistory: JSON.parse(progress.activityHistory)
        };

        const parsedLesson = {
            ...lesson,
            wordIds
        };

        res.json({
            success: true,
            lesson: parsedLesson,
            words,
            progress: parsedProgress
        });
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lesson'
        });
    }
});

// Complete a day
curriculumRouter.post('/complete-day/:userId/:deckId', async (req, res) => {
    try {
        const { userId, deckId } = req.params;
        const { day, wordsLearned } = req.body;

        const progress = await prisma.userProgress.findFirst({
            where: { userId, deckId }
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Progress not found'
            });
        }

        const completedDays = JSON.parse(progress.completedDays) as number[];
        let currentDay = progress.currentDay;
        let totalWordsLearned = progress.totalWordsLearned;
        let streak = progress.streak;
        let activityHistory = JSON.parse(progress.activityHistory) as { date: string; count: number }[];

        // Mark day as completed
        if (!completedDays.includes(day)) {
            completedDays.push(day);
            completedDays.sort((a, b) => a - b);
        }

        // Unlock next day
        if (currentDay === day) {
            currentDay = day + 1;
        }

        // Update words learned
        if (wordsLearned) {
            totalWordsLearned += wordsLearned;
        }

        // Update activity history
        if (wordsLearned) {
            const today = new Date().toISOString().split('T')[0];
            const existingEntry = activityHistory.find(e => e.date === today);
            if (existingEntry) {
                existingEntry.count += wordsLearned;
            } else {
                activityHistory.push({ date: today, count: wordsLearned });
            }
        }

        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastActivity = new Date(progress.lastActivityAt);

        if (lastActivity.toDateString() === yesterday.toDateString()) {
            streak += 1;
        } else if (lastActivity.toDateString() !== new Date().toDateString()) {
            streak = 1;
        }

        // Update DB
        await prisma.userProgress.update({
            where: { id: progress.id },
            data: {
                completedDays: JSON.stringify(completedDays),
                currentDay,
                totalWordsLearned,
                streak,
                activityHistory: JSON.stringify(activityHistory),
                lastActivityAt: new Date()
            }
        });

        res.json({
            success: true,
            message: 'Day completed successfully'
        });
    } catch (error) {
        console.error('Error completing day:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to complete day'
        });
    }
});

// Reset progress
curriculumRouter.post('/reset-progress/:userId/:deckId', async (req, res) => {
    try {
        const { userId, deckId } = req.params;

        const progress = await prisma.userProgress.findFirst({
            where: { userId, deckId }
        });

        if (progress) {
            await prisma.userProgress.update({
                where: { id: progress.id },
                data: {
                    currentDay: 1,
                    completedDays: "[]",
                    weeklyTestScores: "[]",
                    totalWordsLearned: 0,
                    streak: 0,
                    startedAt: new Date(),
                    lastActivityAt: new Date(),
                    completedAt: null,
                    activityHistory: "[]"
                }
            });
        }

        res.json({
            success: true,
            message: 'Progress reset successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to reset progress'
        });
    }
});

// Submit weekly test
curriculumRouter.post('/weekly-test/:userId/:deckId', async (req, res) => {
    try {
        const { userId, deckId } = req.params;
        const { week, score, totalQuestions, correctAnswers } = req.body;

        const progress = await prisma.userProgress.findFirst({
            where: { userId, deckId }
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Progress not found'
            });
        }

        const weeklyTestScores = JSON.parse(progress.weeklyTestScores) as any[];
        const passed = score >= 70;

        weeklyTestScores.push({
            week,
            score,
            totalQuestions,
            correctAnswers,
            completedAt: new Date().toISOString(),
            passed
        });

        await prisma.userProgress.update({
            where: { id: progress.id },
            data: {
                weeklyTestScores: JSON.stringify(weeklyTestScores),
                lastActivityAt: new Date()
            }
        });

        res.json({
            success: true,
            message: 'Test submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to submit test'
        });
    }
});
