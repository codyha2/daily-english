'bell', 'berry', 'bird', 'blade', 'board', 'boat', 'bone', 'book', 'boot',
    'bottle', 'box', 'boy', 'brain', 'brake', 'branch', 'brick', 'bridge',
    'brush', 'bucket', 'bulb', 'button', 'by', 'cake', 'camera', 'card',
    'carriage', 'cart', 'cat', 'chain', 'cheese', 'chest', 'chief', 'chin',
    'church', 'circle', 'clock', 'cloud', 'coat', 'collar', 'colour', 'comb',
    'complete', 'cord', 'cow', 'cup', 'curtain', 'cushion', 'cut', 'dog',
    'door', 'down', 'drain', 'drawer', 'dress', 'drop', 'ear', 'early',
    'elastic', 'fly', 'from', 'go', 'grey', 'ill', 'important', 'in', 'last',
    'late', 'left', 'like', 'long', 'loose', 'loud', 'low', 'male', 'map',
    'married', 'mixed', 'narrow', 'natural', 'necessary', 'new', 'normal',
    'off', 'old', 'on', 'open', 'over', 'parallel', 'physical', 'plough',
    'political', 'poor', 'possible', 'present', 'private', 'probable', 'pump',
    'quick', 'quiet', 'ready', 'red', 'regular', 'responsible', 'right', 'rod',
    'sail', 'separate', 'serious', 'sharp', 'shelf', 'smooth', 'sponge',
    'sticky', 'stiff', 'straight', 'strong', 'sudden', 'sweet', 'thick',
    'tight', 'tired', 'tooth', 'true', 'violent', 'warm', 'watch', 'wet',
    'wide', 'wise', 'yellow', 'young'
];

interface Word {
    id: string;
    deckId: string;
    headword: string;
    partOfSpeech: string;
    meaningVi: string;
    exampleEn: string;
    exampleVi: string;
    picturable: boolean;
}

async function getWordInfo(word: string): Promise<Omit<Word, 'id' | 'deckId'>> {
    const prompt = `For the English word "${word}", provide:
1. Part of speech (noun, verb, adjective, or adverb)
2. Vietnamese meaning (concise, 1-3 words)
3. Simple English example sentence using the word
4. Vietnamese translation of the example

Return as JSON:
{
  "partOfSpeech": "...",
  "meaningVi": "...",
  "exampleEn": "...",
  "exampleVi": "..."
}`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an English-Vietnamese dictionary. Provide accurate, simple translations.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3
        });

        const data = JSON.parse(response.choices[0].message.content || '{}');

        return {
            headword: word.charAt(0).toUpperCase() + word.slice(1),
            partOfSpeech: data.partOfSpeech || 'noun',
            meaningVi: data.meaningVi || '',
            exampleEn: data.exampleEn || '',
            exampleVi: data.exampleVi || '',
            picturable: ['noun'].includes(data.partOfSpeech)
        };
    } catch (error) {
        console.error(`Error processing word "${word}":`, error);
        return {
            headword: word.charAt(0).toUpperCase() + word.slice(1),
            partOfSpeech: 'noun',
            meaningVi: word,
            exampleEn: `Example for ${word}`,
            exampleVi: `Ví dụ cho ${word}`,
            picturable: true
        };
    }
}

async function addMissingWords() {
    const dbPath = resolve('data/db.json');
    const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

    console.log(`Current words in database: ${db.words.length}`);
    console.log(`Adding ${missingWords.length} missing words...`);

    const newWords: Word[] = [];

    for (let i = 0; i < missingWords.length; i++) {
        const word = missingWords[i];
        console.log(`[${i + 1}/${missingWords.length}] Processing: ${word}`);

        const wordInfo = await getWordInfo(word);

        newWords.push({
            id: uuidv4(),
            deckId: 'deck-850-basic',
            ...wordInfo
        });

        // Add delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Add new words to database
    db.words.push(...newWords);

    // Write back to file
    writeFileSync(dbPath, JSON.stringify(db, null, 2));

    console.log(`\n✅ Successfully added ${newWords.length} words`);
    console.log(`📊 Total words in database: ${db.words.length}`);
}

addMissingWords().catch(console.error);
