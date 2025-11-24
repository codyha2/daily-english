import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Word {
    id: string;
    headword: string;
    partOfSpeech: string;
    meaningVi: string;
}

interface DailyLesson {
    day: number;
    type: 'lesson' | 'test';
    theme?: string;
    themeVi?: string;
    themeIcon?: string;
    wordIds: string[];
}

// Theme definitions for 60 days
const themes = [
    // Week 1: Animals & Nature
    { day: 1, theme: "Farm Animals", themeVi: "Động vật trang trại", icon: "🐄", keywords: ["cow", "sheep", "goat", "horse", "pig", "chicken", "fowl", "cattle"] },
    { day: 2, theme: "Wild Animals", themeVi: "Động vật hoang dã", icon: "🦁", keywords: ["monkey", "snake", "elephant", "lion", "bear", "tiger", "wolf"] },
    { day: 3, theme: "Birds & Insects", themeVi: "Chim & Côn trùng", icon: "🐦", keywords: ["bird", "fly", "bee", "ant", "butterfly", "insect", "worm"] },
    { day: 4, theme: "Nature & Plants", themeVi: "Thiên nhiên & Thực vật", icon: "🌳", keywords: ["tree", "flower", "grass", "leaf", "plant", "fruit", "berry", "seed", "root"] },
    { day: 5, theme: "Weather & Sky", themeVi: "Thời tiết & Bầu trời", icon: "☀️", keywords: ["cloud", "rain", "snow", "sun", "moon", "star", "thunder", "wind", "weather"] },
    { day: 6, theme: "Water & Land", themeVi: "Nước & Đất", icon: "🏔️", keywords: ["river", "sea", "ocean", "mountain", "island", "field", "earth", "wave", "water"] },
    { day: 7, type: "test" },

    // Week 2: Home & Daily Life
    { day: 8, theme: "Furniture", themeVi: "Đồ nội thất", icon: "🪑", keywords: ["table", "chair", "bed", "shelf", "door", "window", "frame"] },
    { day: 9, theme: "Kitchen Items", themeVi: "Đồ dùng bếp", icon: "🍽️", keywords: ["plate", "cup", "pot", "fork", "spoon", "knife", "pan", "kettle", "bottle"] },
    { day: 10, theme: "Clothing", themeVi: "Quần áo", icon: "👕", keywords: ["shirt", "coat", "dress", "shoe", "hat", "glove", "sock", "boot", "collar", "trousers", "skirt"] },
    { day: 11, theme: "Household Objects", themeVi: "Đồ gia dụng", icon: "🏠", keywords: ["brush", "bucket", "curtain", "cushion", "drawer", "umbrella", "key", "lock", "button"] },
    { day: 12, theme: "Tools & Instruments", themeVi: "Công cụ & Dụng cụ", icon: "🔨", keywords: ["hammer", "nail", "scissors", "needle", "screw", "pipe", "rod", "wire"] },
    { day: 13, theme: "Buildings", themeVi: "Công trình kiến trúc", icon: "🏛️", keywords: ["house", "church", "library", "bridge", "hospital", "school", "building", "office"] },
    { day: 14, type: "test" },

    // Week 3: Body & Health
    { day: 15, theme: "Body Parts 1", themeVi: "Bộ phận cơ thể 1", icon: "✋", keywords: ["head", "hand", "arm", "leg", "foot", "finger", "knee", "thumb", "toe", "nail"] },
    { day: 16, theme: "Face & Senses", themeVi: "Khuôn mặt & Giác quan", icon: "👁️", keywords: ["eye", "ear", "nose", "mouth", "tooth", "tongue", "lip", "chin", "throat", "neck"] },
    { day: 17, theme: "Internal Body", themeVi: "Cơ quan nội tạng", icon: "❤️", keywords: ["heart", "brain", "stomach", "blood", "bone", "muscle", "nerve", "skin", "chest", "back"] },
    { day: 18, theme: "Health & Sickness", themeVi: "Sức khỏe & Bệnh tật", icon: "🏥", keywords: ["pain", "disease", "wound", "ill", "healthy", "medical", "sick", "hurt", "care"] },
    { day: 19, theme: "Feelings & Emotions", themeVi: "Cảm xúc & Tâm trạng", icon: "😊", keywords: ["happy", "sad", "angry", "fear", "love", "hate", "hope", "shame", "surprise"] },
    { day: 20, theme: "Senses & Perception", themeVi: "Giác quan & Nhận thức", icon: "👃", keywords: ["see", "hear", "smell", "taste", "touch", "sense", "feeling", "sound", "sight"] },
    { day: 21, type: "test" },

    // Week 4: Actions & Movement
    { day: 22, theme: "Basic Actions", themeVi: "Hành động cơ bản", icon: "🎯", keywords: ["come", "go", "take", "give", "make", "do", "have", "get", "put", "keep"] },
    { day: 23, theme: "Movement", themeVi: "Chuyển động", icon: "🏃", keywords: ["walk", "run", "jump", "swim", "fly", "move", "roll", "slip", "fall"] },
    { day: 24, theme: "Hand Actions", themeVi: "Động tác tay", icon: "👐", keywords: ["push", "pull", "lift", "grip", "shake", "crush", "twist", "fold", "rub"] },
    { day: 25, theme: "Eating & Drinking", themeVi: "Ăn & Uống", icon: "🍴", keywords: ["eat", "drink", "bite", "chew", "taste", "cook", "burn", "boil"] },
    { day: 26, theme: "Communication", themeVi: "Giao tiếp", icon: "💬", keywords: ["say", "talk", "speak", "tell", "ask", "answer", "voice", "word", "language"] },
    { day: 27, theme: "Work & Study", themeVi: "Làm việc & Học tập", icon: "📚", keywords: ["work", "learn", "teach", "write", "read", "study", "teaching", "education"] },
    { day: 28, type: "test" },

    // Week 5: Food & Materials
    { day: 29, theme: "Food Items", themeVi: "Thực phẩm", icon: "🍞", keywords: ["bread", "butter", "cheese", "meat", "egg", "cake", "soup", "sugar"] },
    { day: 30, theme: "Fruits & Grains", themeVi: "Trái cây & Ngũ cốc", icon: "🍎", keywords: ["apple", "orange", "berry", "grain", "rice", "potato", "cotton"] },
    { day: 31, theme: "Liquids", themeVi: "Chất lỏng", icon: "💧", keywords: ["water", "milk", "wine", "soup", "liquid", "oil", "blood"] },
    { day: 32, theme: "Natural Materials", themeVi: "Vật liệu tự nhiên", icon: "🌲", keywords: ["wood", "metal", "glass", "paper", "cloth", "leather", "wool", "silk"] },
    { day: 33, theme: "Metals & Minerals", themeVi: "Kim loại & Khoáng chất", icon: "⚙️", keywords: ["stone", "iron", "gold", "silver", "brass", "copper", "steel", "coal"] },
    { day: 34, theme: "Substances", themeVi: "Chất", icon: "💨", keywords: ["powder", "paste", "dust", "smoke", "steam", "air", "gas", "flame"] },
    { day: 35, type: "test" },

    // Week 6: Qualities 1
    { day: 36, theme: "Size & Dimension", themeVi: "Kích thước & Chiều", icon: "📏", keywords: ["big", "small", "long", "short", "tall", "high", "wide", "narrow", "thick", "thin", "size", "distance"] },
    { day: 37, theme: "Colors", themeVi: "Màu sắc", icon: "🎨", keywords: ["red", "blue", "green", "yellow", "black", "white", "grey", "brown", "color", "bright", "dark"] },
    { day: 38, theme: "Shapes & Forms", themeVi: "Hình dạng", icon: "⭕", keywords: ["round", "square", "circle", "angle", "curve", "straight", "line", "edge", "form", "shape"] },
    { day: 39, theme: "Temperature", themeVi: "Nhiệt độ", icon: "🌡️", keywords: ["hot", "cold", "warm", "cool", "heat", "boiling", "ice", "fire"] },
    { day: 40, theme: "Texture & Feel", themeVi: "Kết cấu & Cảm giác", icon: "🤲", keywords: ["hard", "soft", "smooth", "rough", "sticky", "wet", "dry", "sharp"] },
    { day: 41, theme: "Weight & Density", themeVi: "Trọng lượng & Mật độ", icon: "⚖️", keywords: ["heavy", "light", "thick", "thin", "solid", "weight", "mass", "dense"] },
    { day: 42, type: "test" },

    // Week 7: Qualities 2
    { day: 43, theme: "Good & Bad", themeVi: "Tốt & Xấu", icon: "👍", keywords: ["good", "bad", "beautiful", "ugly", "clean", "dirty", "right", "wrong"] },
    { day: 44, theme: "Speed & Time", themeVi: "Tốc độ & Thời gian", icon: "⏱️", keywords: ["quick", "slow", "fast", "early", "late", "sudden", "time", "hour", "minute"] },
    { day: 45, theme: "Light & Sound", themeVi: "Ánh sáng & Âm thanh", icon: "💡", keywords: ["bright", "dark", "loud", "quiet", "light", "sound", "noise", "music"] },
    { day: 46, theme: "Strength & Power", themeVi: "Sức mạnh & Quyền lực", icon: "💪", keywords: ["strong", "weak", "powerful", "force", "power", "energy", "ability"] },
    { day: 47, theme: "Age & State", themeVi: "Tuổi tác & Trạng thái", icon: "🕰️", keywords: ["new", "old", "young", "fresh", "tired", "awake", "sleep", "dead", "living"] },
    { day: 48, theme: "Truth & Knowledge", themeVi: "Chân lý & Kiến thức", icon: "📖", keywords: ["true", "false", "real", "certain", "probable", "possible", "knowledge", "fact"] },
    { day: 49, type: "test" },

    // Week 8: Society
    { day: 50, theme: "People", themeVi: "Con người", icon: "👤", keywords: ["person", "man", "woman", "boy", "girl", "baby", "child", "male", "female"] },
    { day: 51, theme: "Family", themeVi: "Gia đình", icon: "👨‍👩‍👧", keywords: ["father", "mother", "brother", "sister", "son", "daughter", "family", "married", "friend"] },
    { day: 52, theme: "Jobs & Roles", themeVi: "Nghề nghiệp & Vai trò", icon: "👔", keywords: ["teacher", "worker", "manager", "servant", "secretary", "porter", "chief"] },
    { day: 53, theme: "Government & Law", themeVi: "Chính phủ & Luật pháp", icon: "⚖️", keywords: ["government", "law", "rule", "authority", "control", "military", "army", "war"] },
    { day: 54, theme: "Business & Money", themeVi: "Kinh doanh & Tiền bạc", icon: "💰", keywords: ["money", "business", "trade", "price", "value", "profit", "payment", "account", "credit"] },
    { day: 55, theme: "Education", themeVi: "Giáo dục", icon: "🎓", keywords: ["education", "learning", "knowledge", "teaching", "school", "book", "writing", "reading"] },
    { day: 56, type: "test" },

    // Week 9: Abstract
    { day: 57, theme: "Time & Space", themeVi: "Thời gian & Không gian", icon: "🌌", keywords: ["time", "space", "place", "distance", "direction", "position", "north", "south", "east", "west"] },
    { day: 58, theme: "Ideas & Thinking", themeVi: "Ý tưởng & Suy nghĩ", icon: "💭", keywords: ["idea", "thought", "mind", "reason", "opinion", "theory", "belief", "design"] },
    { day: 59, theme: "Events & Changes", themeVi: "Sự kiện & Thay đổi", icon: "🔄", keywords: ["event", "change", "start", "end", "process", "development", "growth", "increase"] },
    { day: 60, type: "test", theme: "Final Review", themeVi: "Ôn tập cuối kỳ", icon: "🎯" },
];

function categorizeWords(words: Word[]): Map<number, string[]> {
    const dayToWords = new Map<number, string[]>();
    const usedWordIds = new Set<string>();

    // Initialize all days
    themes.forEach(t => {
        if (t.type !== 'test') {
            dayToWords.set(t.day, []);
        }
    });

    // First pass: exact keyword matches
    themes.forEach(theme => {
        if (theme.type === 'test' || !theme.keywords) return;

        const dayWords = dayToWords.get(theme.day)!;

        theme.keywords.forEach(keyword => {
            const matchingWords = words.filter(w =>
                !usedWordIds.has(w.id) &&
                w.headword.toLowerCase() === keyword.toLowerCase()
            );

            matchingWords.forEach(w => {
                dayWords.push(w.id);
                usedWordIds.add(w.id);
            });
        });
    });

    // Second pass: partial matches and part of speech
    themes.forEach(theme => {
        if (theme.type === 'test' || !theme.keywords) return;

        const dayWords = dayToWords.get(theme.day)!;
        const targetCount = 15;

        if (dayWords.length < targetCount) {
            const remaining = words.filter(w => !usedWordIds.has(w.id));

            // Try to find related words
            const related = remaining.filter(w => {
                const headword = w.headword.toLowerCase();
                return theme.keywords?.some(kw =>
                    headword.includes(kw.toLowerCase()) ||
                    kw.toLowerCase().includes(headword)
                );
            });

            const toAdd = related.slice(0, targetCount - dayWords.length);
            toAdd.forEach(w => {
                dayWords.push(w.id);
                usedWordIds.add(w.id);
            });
        }
    });

    // Third pass: distribute remaining words evenly
    const remainingWords = words.filter(w => !usedWordIds.has(w.id));
    let currentDay = 1;

    remainingWords.forEach(word => {
        // Find next lesson day (skip tests)
        while (themes.find(t => t.day === currentDay)?.type === 'test') {
            currentDay++;
            if (currentDay > 59) currentDay = 1;
        }

        const dayWords = dayToWords.get(currentDay);
        if (dayWords && dayWords.length < 18) { // Max 18 words per day
            dayWords.push(word.id);
            usedWordIds.add(word.id);
        }

        // Move to next day
        currentDay++;
        if (currentDay > 59) currentDay = 1;
    });

    return dayToWords;
}

async function reorganizeCurriculum() {
    const dbPath = resolve('data/db.json');
    const db = JSON.parse(readFileSync(dbPath, 'utf-8'));
    const words: Word[] = db.words;

    console.log(`Total words: ${words.length}`);

    // Categorize words by theme
    const dayToWords = categorizeWords(words);

    // Create daily lessons
    const dailyLessons: DailyLesson[] = themes.map(theme => {
        if (theme.type === 'test') {
            return {
                day: theme.day,
                type: 'test',
                theme: theme.theme || 'Weekly Test',
                themeVi: theme.themeVi || 'Kiểm tra tuần',
                themeIcon: theme.icon || '📝',
                wordIds: []
            };
        }

        return {
            day: theme.day,
            type: 'lesson',
            theme: theme.theme!,
            themeVi: theme.themeVi!,
            themeIcon: theme.icon!,
            wordIds: dayToWords.get(theme.day) || []
        };
    });

    // Update database
    db.dailyLessons = dailyLessons;

    writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Print summary
    console.log('\n✅ Reorganization Complete!\n');
    dailyLessons.forEach(lesson => {
        if (lesson.type === 'lesson') {
            console.log(`Day ${lesson.day}: ${lesson.theme} (${lesson.wordIds.length} words)`);
        } else {
            console.log(`Day ${lesson.day}: ${lesson.theme}`);
        }
    });

    const totalAssigned = dailyLessons.reduce((sum, l) => sum + l.wordIds.length, 0);
    console.log(`\n📊 Total words assigned: ${totalAssigned}/${words.length}`);
}

reorganizeCurriculum().catch(console.error);
