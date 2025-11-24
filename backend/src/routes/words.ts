import express from 'express';
import { dataStore } from '../services/dataStore.js';

export const wordsRouter = express.Router();

// Get all words from a deck
wordsRouter.get('/deck/:deckId', async (req, res) => {
    try {
        const { deckId } = req.params;
        const db = dataStore.snapshot;

        const words = db.words.filter(w => w.deckId === deckId);

        res.json({
            success: true,
            words,
            count: words.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch words'
        });
    }
});

// Get random words for learning
wordsRouter.get('/learning/:deckId', async (req, res) => {
    try {
        const { deckId } = req.params;
        const { limit = 20 } = req.query;

        const db = dataStore.snapshot;

        // Get all words from deck
        const deckWords = db.words.filter(w => w.deckId === deckId);

        // Shuffle and limit (just return random words for now)
        const shuffled = [...deckWords].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Number(limit));

        res.json({
            success: true,
            words: selected,
            count: selected.length,
            totalInDeck: deckWords.length
        });
    } catch (error) {
        console.error('Error in /learning endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch learning words'
        });
    }
});

// Get a single random word
wordsRouter.get('/random/:deckId', async (req, res) => {
    try {
        const { deckId } = req.params;
        const db = dataStore.snapshot;

        const words = db.words.filter(w => w.deckId === deckId);

        if (words.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No words found in this deck'
            });
        }

        const randomWord = words[Math.floor(Math.random() * words.length)];

        res.json({
            success: true,
            word: randomWord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch random word'
        });
    }
});

// Get all learned words for a user with day information
wordsRouter.get('/learned/:userId/:deckId', async (req, res) => {
    try {
        const { userId, deckId } = req.params;
        const db = dataStore.snapshot;

        // Get user progress
        const progress = db.userProgress.find(p =>
            p.userId === userId && p.deckId === deckId
        );

        if (!progress) {
            return res.json({
                success: true,
                words: [],
                totalWords: 0,
                completedDays: []
            });
        }

        // Get all lessons from completed days
        const completedLessons = db.dailyLessons.filter(lesson =>
            lesson.deckId === deckId &&
            progress.completedDays.includes(lesson.day)
        );

        // Get all word IDs from completed lessons
        const allWordIds = completedLessons.flatMap(lesson => lesson.wordIds || []);

        // Get word details and map with the day they were learned
        const wordsWithDay = allWordIds.map(wordId => {
            const word = db.words.find(w => w.id === wordId);
            const lesson = completedLessons.find(l => l.wordIds?.includes(wordId));

            return {
                ...word,
                learnedOnDay: lesson?.day || 0
            };
        }).filter(w => w.id); // Remove any null words

        res.json({
            success: true,
            words: wordsWithDay,
            totalWords: wordsWithDay.length,
            completedDays: progress.completedDays,
            currentDay: progress.currentDay
        });
    } catch (error) {
        console.error('Error in /learned endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch learned words'
        });
    }
});
