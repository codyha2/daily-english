import express from 'express';
import { v4 as uuid } from 'uuid';
import { dataStore } from '../services/dataStore.js';
import { UserProgress } from '../types.js';

export const curriculumRouter = express.Router();

// Get curriculum for a deck (all 60 daily lessons)
curriculumRouter.get('/:deckId', async (req, res) => {
    try {
        const { deckId } = req.params;
        const db = dataStore.snapshot;

        const lessons = db.dailyLessons
            .filter(l => l.deckId === deckId)
            .sort((a, b) => a.day - b.day);

        res.json({
            success: true,
            lessons,
            totalDays: lessons.length
        });
    } catch (error) {
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
        const db = dataStore.snapshot;

        let progress = db.userProgress.find(p =>
            p.userId === userId && p.deckId === deckId
        );

        // Create new progress if doesn't exist
        if (!progress) {
            progress = {
                id: uuid(),
                userId,
                deckId,
                currentDay: 1,
                completedDays: [],
                weeklyTestScores: [],
                totalWordsLearned: 0,
                streak: 0,
                startedAt: new Date().toISOString(),
                lastActivityAt: new Date().toISOString(),
                activityHistory: []
            };

            await dataStore.save((store) => {
                store.userProgress.push(progress!);
            });
        }

        res.json({
            success: true,
            progress
        });
    } catch (error) {
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
        const db = dataStore.snapshot;

        // Get user progress
        let progress = db.userProgress.find(p =>
            p.userId === userId && p.deckId === deckId
        );

        if (!progress) {
            progress = {
                id: uuid(),
                userId,
                deckId,
                currentDay: 1,
                completedDays: [],
                weeklyTestScores: [],
                totalWordsLearned: 0,
                streak: 0,
                startedAt: new Date().toISOString(),
                lastActivityAt: new Date().toISOString(),
                activityHistory: []
            };

            await dataStore.save((store) => {
                store.userProgress.push(progress!);
            });
        }

        // Get current day's lesson
        const lesson = db.dailyLessons.find(l =>
            l.deckId === deckId && l.day === progress!.currentDay
        );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: 'No lesson found for current day'
            });
        }

        // Get words for this lesson
        const words = db.words.filter(w => lesson.wordIds.includes(w.id));

        res.json({
            success: true,
            lesson,
            words,
            progress
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
        const db = dataStore.snapshot;

        // Get user progress
        const progress = db.userProgress.find(p =>
            p.userId === userId && p.deckId === deckId
        );

        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Progress not found'
            });
        }

        // Check if day is unlocked (completed or current)
        // Allow accessing any previous day or current day
        if (dayNum > progress.currentDay && !progress.completedDays.includes(dayNum)) {
            return res.status(403).json({
                success: false,
                error: 'Day is locked'
            });
        }

        // Get lesson
        const lesson = db.dailyLessons.find(l =>
            l.deckId === deckId && l.day === dayNum
        );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: 'Lesson not found'
            });
        }

        // Get words
        const words = db.words.filter(w => lesson.wordIds.includes(w.id));

        res.json({
            success: true,
            lesson,
            words,
            progress
        });
    } catch (error) {
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

        await dataStore.save((store) => {
            const progress = store.userProgress.find(p =>
                p.userId === userId && p.deckId === deckId
            );

            if (!progress) {
                return res.status(404).json({
                    success: false,
                    error: 'Progress not found'
                });
            }

            // Mark day as completed
            if (!progress.completedDays.includes(day)) {
                progress.completedDays.push(day);
                progress.completedDays.sort((a, b) => a - b);
            }

            // Unlock next day
            if (progress.currentDay === day) {
                progress.currentDay = day + 1;
            }

            // Update words learned
            if (wordsLearned) {
                progress.totalWordsLearned += wordsLearned;
            }

            // Update activity
            progress.lastActivityAt = new Date().toISOString();

            // Update activity history
            if (wordsLearned) {
                if (!progress.activityHistory) progress.activityHistory = [];
                const today = new Date().toISOString().split('T')[0];
                const existingEntry = progress.activityHistory.find(e => e.date === today);
                if (existingEntry) {
                    existingEntry.count += wordsLearned;
                } else {
                    progress.activityHistory.push({ date: today, count: wordsLearned });
                }
            }

            // Update streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const lastActivity = new Date(progress.lastActivityAt);

            if (lastActivity.toDateString() === yesterday.toDateString()) {
                progress.streak += 1;
            } else if (lastActivity.toDateString() !== new Date().toDateString()) {
                progress.streak = 1;
            }
        });

        res.json({
            success: true,
            message: 'Day completed successfully'
        });
    } catch (error) {
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

        await dataStore.save((store) => {
            const index = store.userProgress.findIndex(p =>
                p.userId === userId && p.deckId === deckId
            );

            if (index !== -1) {
                // Reset to initial state
                store.userProgress[index] = {
                    ...store.userProgress[index],
                    currentDay: 1,
                    completedDays: [],
                    weeklyTestScores: [],
                    totalWordsLearned: 0,
                    streak: 0,
                    startedAt: new Date().toISOString(),
                    lastActivityAt: new Date().toISOString(),
                    completedAt: undefined,
                    activityHistory: []
                };
            }
        });

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

        await dataStore.save((store) => {
            const progress = store.userProgress.find(p =>
                p.userId === userId && p.deckId === deckId
            );

            if (!progress) {
                return res.status(404).json({
                    success: false,
                    error: 'Progress not found'
                });
            }

            const passed = score >= 70;

            progress.weeklyTestScores.push({
                week,
                score,
                totalQuestions,
                correctAnswers,
                completedAt: new Date().toISOString(),
                passed
            });

            progress.lastActivityAt = new Date().toISOString();
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
