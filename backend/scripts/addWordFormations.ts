import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';

interface WordFormation {
    id: string;
    type: 'prefix' | 'suffix';
    affix: string;
    meaning: string;
    meaningVi: string;
    partOfSpeech?: string;
    examples: {
        base: string;
        formed: string;
        meaningVi: string;
    }[];
}

const prefixes: Omit<WordFormation, 'id'>[] = [
    {
        type: 'prefix',
        affix: 'un-',
        meaning: 'not, opposite of',
        meaningVi: 'không, trái ngược',
        examples: [
            { base: 'happy', formed: 'unhappy', meaningVi: 'không vui' },
            { base: 'able', formed: 'unable', meaningVi: 'không thể' },
            { base: 'safe', formed: 'unsafe', meaningVi: 'không an toàn' }
        ]
    },
    {
        type: 'prefix',
        affix: 're-',
        meaning: 'again',
        meaningVi: 'lại, lần nữa',
        examples: [
            { base: 'do', formed: 'redo', meaningVi: 'làm lại' },
            { base: 'write', formed: 'rewrite', meaningVi: 'viết lại' },
            { base: 'build', formed: 'rebuild', meaningVi: 'xây dựng lại' }
        ]
    },
    {
        type: 'prefix',
        affix: 'dis-',
        meaning: 'not, opposite of',
        meaningVi: 'không, trái ngược',
        examples: [
            { base: 'agree', formed: 'disagree', meaningVi: 'không đồng ý' },
            { base: 'like', formed: 'dislike', meaningVi: 'không thích' },
            { base: 'appear', formed: 'disappear', meaningVi: 'biến mất' }
        ]
    },
    {
        type: 'prefix',
        affix: 'mis-',
        meaning: 'wrongly',
        meaningVi: 'sai, nhầm',
        examples: [
            { base: 'understand', formed: 'misunderstand', meaningVi: 'hiểu lầm' },
            { base: 'lead', formed: 'mislead', meaningVi: 'dẫn sai' }
        ]
    },
    {
        type: 'prefix',
        affix: 'pre-',
        meaning: 'before',
        meaningVi: 'trước',
        examples: [
            { base: 'view', formed: 'preview', meaningVi: 'xem trước' },
            { base: 'pay', formed: 'prepay', meaningVi: 'trả trước' }
        ]
    },
    {
        type: 'prefix',
        affix: 'over-',
        meaning: 'too much',
        meaningVi: 'quá mức',
        examples: [
            { base: 'eat', formed: 'overeat', meaningVi: 'ăn quá nhiều' },
            { base: 'work', formed: 'overwork', meaningVi: 'làm việc quá sức' }
        ]
    },
    {
        type: 'prefix',
        affix: 'under-',
        meaning: 'too little',
        meaningVi: 'dưới, thiếu',
        examples: [
            { base: 'pay', formed: 'underpay', meaningVi: 'trả lương thấp' },
            { base: 'cook', formed: 'undercook', meaningVi: 'nấu chưa chín' }
        ]
    }
];

const suffixes: Omit<WordFormation, 'id'>[] = [
    {
        type: 'suffix',
        affix: '-ness',
        meaning: 'state or quality',
        meaningVi: 'trạng thái, tính chất',
        partOfSpeech: 'noun',
        examples: [
            { base: 'happy', formed: 'happiness', meaningVi: 'hạnh phúc' },
            { base: 'kind', formed: 'kindness', meaningVi: 'lòng tốt' },
            { base: 'dark', formed: 'darkness', meaningVi: 'bóng tối' }
        ]
    },
    {
        type: 'suffix',
        affix: '-ly',
        meaning: 'in a manner',
        meaningVi: 'một cách',
        partOfSpeech: 'adverb',
        examples: [
            { base: 'quick', formed: 'quickly', meaningVi: 'một cách nhanh chóng' },
            { base: 'slow', formed: 'slowly', meaningVi: 'một cách chậm rãi' },
            { base: 'careful', formed: 'carefully', meaningVi: 'một cách cẩn thận' }
        ]
    },
    {
        type: 'suffix',
        affix: '-ful',
        meaning: 'full of',
        meaningVi: 'đầy, nhiều',
        partOfSpeech: 'adjective',
        examples: [
            { base: 'care', formed: 'careful', meaningVi: 'cẩn thận' },
            { base: 'use', formed: 'useful', meaningVi: 'hữu ích' },
            { base: 'beauty', formed: 'beautiful', meaningVi: 'đẹp' }
        ]
    },
    {
        type: 'suffix',
        affix: '-less',
        meaning: 'without',
        meaningVi: 'không có',
        partOfSpeech: 'adjective',
        examples: [
            { base: 'care', formed: 'careless', meaningVi: 'bất cẩn' },
            { base: 'use', formed: 'useless', meaningVi: 'vô dụng' },
            { base: 'hope', formed: 'hopeless', meaningVi: 'vô vọng' }
        ]
    },
    {
        type: 'suffix',
        affix: '-er',
        meaning: 'person who, thing that',
        meaningVi: 'người, vật',
        partOfSpeech: 'noun',
        examples: [
            { base: 'teach', formed: 'teacher', meaningVi: 'giáo viên' },
            { base: 'write', formed: 'writer', meaningVi: 'nhà văn' },
            { base: 'play', formed: 'player', meaningVi: 'người chơi' }
        ]
    },
    {
        type: 'suffix',
        affix: '-tion',
        meaning: 'action or state',
        meaningVi: 'hành động, trạng thái',
        partOfSpeech: 'noun',
        examples: [
            { base: 'act', formed: 'action', meaningVi: 'hành động' },
            { base: 'educate', formed: 'education', meaningVi: 'giáo dục' },
            { base: 'inform', formed: 'information', meaningVi: 'thông tin' }
        ]
    },
    {
        type: 'suffix',
        affix: '-able',
        meaning: 'capable of being',
        meaningVi: 'có thể',
        partOfSpeech: 'adjective',
        examples: [
            { base: 'read', formed: 'readable', meaningVi: 'có thể đọc được' },
            { base: 'understand', formed: 'understandable', meaningVi: 'có thể hiểu được' }
        ]
    },
    {
        type: 'suffix',
        affix: '-ment',
        meaning: 'result or action',
        meaningVi: 'kết quả, hành động',
        partOfSpeech: 'noun',
        examples: [
            { base: 'develop', formed: 'development', meaningVi: 'sự phát triển' },
            { base: 'improve', formed: 'improvement', meaningVi: 'sự cải thiện' }
        ]
    }
];

function addWordFormations() {
    const dbPath = resolve('data/db.json');
    const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

    // Add wordFormations if not exists
    if (!db.wordFormations) {
        db.wordFormations = [];
    }

    // Add all prefixes and suffixes
    const allFormations = [...prefixes, ...suffixes].map(formation => ({
        id: uuidv4(),
        ...formation
    }));

    db.wordFormations = allFormations;

    writeFileSync(dbPath, JSON.stringify(db, null, 2));

    console.log(`✅ Added ${allFormations.length} word formations to database`);
    console.log(`  - Prefixes: ${prefixes.length}`);
    console.log(`  - Suffixes: ${suffixes.length}`);
}

addWordFormations();
