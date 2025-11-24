import { API_BASE_URL } from '../config/api';

const API_BASE = API_BASE_URL;

/**
 * Play text-to-speech audio for a word or sentence
 */
export async function playTextToSpeech(
    text: string,
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy'
): Promise<void> {
    try {
        const response = await fetch(
            `${API_BASE}/ai/test/tts?text=${encodeURIComponent(text)}&voice=${voice}`
        );

        if (!response.ok) {
            throw new Error('Failed to generate speech');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        await audio.play();

        // Clean up after playing
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
        };
    } catch (error) {
        console.error('TTS Error:', error);
        throw error;
    }
}

/**
 * Get AI-generated example sentences for a word
 */
export async function getAIExamples(word: string, count: number = 3): Promise<string[]> {
    try {
        const response = await fetch(
            `${API_BASE}/ai/test/examples?word=${encodeURIComponent(word)}&count=${count}`
        );

        if (!response.ok) {
            throw new Error('Failed to generate examples');
        }

        const data = await response.json();
        return data.examples || [];
    } catch (error) {
        console.error('AI Examples Error:', error);
        return [];
    }
}

/**
 * Translate text using AI
 */
export async function translateText(
    text: string,
    from: string = 'en',
    to: string = 'vi'
): Promise<string> {
    try {
        const response = await fetch(
            `${API_BASE}/ai/test/translate?text=${encodeURIComponent(text)}&from=${from}&to=${to}`
        );

        if (!response.ok) {
            throw new Error('Failed to translate');
        }

        const data = await response.json();
        return data.translation || '';
    } catch (error) {
        console.error('Translation Error:', error);
        return '';
    }
}

export const openaiClient = {
    playTextToSpeech,
    getAIExamples,
    translateText
};
