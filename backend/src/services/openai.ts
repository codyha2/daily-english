import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * Text-to-Speech: Convert text to natural speech
 */
export async function textToSpeech(
    text: string,
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy'
): Promise<Buffer> {
    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice,
        input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
}

/**
 * Speech-to-Text: Convert audio to text using Whisper
 */
export async function speechToText(audioBuffer: Buffer, language: string = 'en'): Promise<string> {
    const file = new File([audioBuffer], 'audio.wav', { type: 'audio/wav' });

    const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: language,
    });

    return transcription.text;
}

/**
 * Translation: Translate text using GPT
 */
export async function translateText(
    text: string,
    from: string = 'en',
    to: string = 'vi'
): Promise<string> {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `You are a translator. Translate from ${from} to ${to}. Only provide the translation, no explanations.`
            },
            {
                role: 'user',
                content: text
            }
        ],
        temperature: 0.3,
    });

    return response.choices[0].message.content || '';
}

/**
 * Generate example sentences for a word
 */
export async function generateExamples(word: string, count: number = 3): Promise<string[]> {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an English teacher. Generate simple example sentences.'
            },
            {
                role: 'user',
                content: `Generate ${count} simple example sentences using the word "${word}". Return only the sentences, one per line.`
            }
        ],
        temperature: 0.7,
    });

    const content = response.choices[0].message.content || '';
    return content.split('\n').filter(s => s.trim());
}

/**
 * Assess pronunciation and provide feedback
 */
export async function assessPronunciation(
    targetText: string,
    transcribedText: string
): Promise<{
    score: number;
    feedback: string;
}> {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an English pronunciation teacher. Compare the target text with what the student said and provide a score (0-100) and brief feedback.'
            },
            {
                role: 'user',
                content: `Target: "${targetText}"\nStudent said: "${transcribedText}"\n\nProvide JSON response with score (0-100) and feedback.`
            }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
        score: result.score || 0,
        feedback: result.feedback || ''
    };
}

/**
 * Generate quiz questions for a tense
 */
export async function generateQuiz(
    tense: string,
    count: number = 5
): Promise<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
}>> {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an English grammar teacher. Generate multiple choice quiz questions.'
            },
            {
                role: 'user',
                content: `Generate ${count} multiple choice questions about ${tense}. Return JSON array with question, options (array of 4), and correctAnswer (index 0-3).`
            }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"questions":[]}');
    return result.questions || [];
}

export const openaiService = {
    textToSpeech,
    speechToText,
    translateText,
    generateExamples,
    assessPronunciation,
    generateQuiz
};
