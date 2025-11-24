import express from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DATA_PATH } from '../config';

const router = express.Router();

// GET /word-formations - Get all word formations
router.get('/', (req, res) => {
    try {
        const dbPath = resolve(DATA_PATH);
        const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

        res.json({
            success: true,
            wordFormations: db.wordFormations || []
        });
    } catch (error) {
        console.error('Error fetching word formations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch word formations'
        });
    }
});

// GET /word-formations/prefixes - Get only prefixes
router.get('/prefixes', (req, res) => {
    try {
        const dbPath = resolve(DATA_PATH);
        const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

        const prefixes = (db.wordFormations || []).filter((wf: any) => wf.type === 'prefix');

        res.json({
            success: true,
            wordFormations: prefixes
        });
    } catch (error) {
        console.error('Error fetching prefixes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch prefixes'
        });
    }
});

// GET /word-formations/suffixes - Get only suffixes
router.get('/suffixes', (req, res) => {
    try {
        const dbPath = resolve(DATA_PATH);
        const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

        const suffixes = (db.wordFormations || []).filter((wf: any) => wf.type === 'suffix');

        res.json({
            success: true,
            wordFormations: suffixes
        });
    } catch (error) {
        console.error('Error fetching suffixes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch suffixes'
        });
    }
});

export default router;
