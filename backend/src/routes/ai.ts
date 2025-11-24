import express from 'express';
import { openaiService } from '../services/openai.js';

const router = express.Router();

/**
 * Test OpenAI API - Simple ping
 */
router.get('/test/ping', (req, res) => {
    res.json({
        success: true,
        message: 'OpenAI Speech API is ready',
        services: {
            tts: 'Text-to-Speech (6 voices)',
            whisper: 'Speech-to-Text',
            translation: 'GPT Translation',
            examples: 'AI Example Generator',
            quiz: 'AI Quiz Generator'
        }
    });
});

/**
 * Test TTS - Text to Speech
 * GET /ai/test/tts?text=hello&voice=alloy
 */
router.get('/test/tts', async (req, res) => {
    try {
        const text = req.query.text as string || 'Hello, this is a test.';
        const voice = (req.query.voice as any) || 'alloy';

        console.log(`[OpenAI TTS] Converting "${text}" with voice: ${voice}`);

        const audioBuffer = await openaiService.textToSpeech(text, voice);

        console.log(`[OpenAI TTS] Success! Audio size: ${audioBuffer.length} bytes`);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);
    } catch (error: any) {
        console.error('[OpenAI TTS] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Test Translation
 * GET /ai/test/translate?text=hello&from=en&to=vi
 */
router.get('/test/translate', async (req, res) => {
    try {
        const text = req.query.text as string || 'Hello, how are you?';
        const from = req.query.from as string || 'en';
        const to = req.query.to as string || 'vi';

        console.log(`[OpenAI Translation] "${text}" (${from} → ${to})`);

        const translation = await openaiService.translateText(text, from, to);

        console.log(`[OpenAI Translation] Result: "${translation}"`);

        res.json({
            success: true,
            original: text,
            translation,
            from,
            to
        });
    } catch (error: any) {
        console.error('[OpenAI Translation] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Test Example Generation
 * GET /ai/test/examples?word=happy
 */
router.get('/test/examples', async (req, res) => {
    try {
        const word = req.query.word as string || 'happy';
        const count = parseInt(req.query.count as string) || 3;

        console.log(`[OpenAI Examples] Generating ${count} examples for "${word}"`);

        const examples = await openaiService.generateExamples(word, count);

        console.log(`[OpenAI Examples] Generated ${examples.length} examples`);

        res.json({
            success: true,
            word,
            examples
        });
    } catch (error: any) {
        console.error('[OpenAI Examples] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
