import { v4 as uuid } from "uuid";
// Force recompile
import { dataStore } from "../src/services/dataStore.js";
import { DailyLesson, LessonType } from "../src/types.js";

const DECK_ID = "deck-850-basic";
const TOTAL_DAYS = 60;
const WORDS_PER_LEARNING_DAY = 15;

/**
 * Generate 60-day curriculum for 850 Basic Words
 * 
 * Structure:
 * - Days 1-5: Learn (15 words each = 75 words)
 * - Day 6: Review (75 words from days 1-5)
 * - Day 7: Test (week 1)
 * ... repeat for 8.5 weeks
 */
async function generateCurriculum() {
    console.log("🎯 Generating 60-Day Curriculum...\n");

    const db = dataStore.snapshot;

    // Get all words from the deck
    const deckWords = db.words.filter(w => w.deckId === DECK_ID);
    console.log(`📚 Found ${deckWords.length} words in deck`);

    if (deckWords.length === 0) {
        console.error("❌ No words found in deck. Run addBasicWords.ts first!");
        return;
    }

    // Shuffle words for variety
    const shuffledWords = [...deckWords].sort(() => Math.random() - 0.5);

    const lessons: DailyLesson[] = [];
    let wordIndex = 0;
    let day = 1;

    // Generate 8 complete weeks
    for (let week = 1; week <= 8; week++) {
        console.log(`\n📅 Week ${week}:`);

        // Days 1-5: Learning days
        const weekWordIds: string[] = [];

        for (let dayInWeek = 1; dayInWeek <= 5; dayInWeek++) {
            const lessonWordIds: string[] = [];

            // Assign words for this day
            for (let i = 0; i < WORDS_PER_LEARNING_DAY && wordIndex < shuffledWords.length; i++) {
                lessonWordIds.push(shuffledWords[wordIndex].id);
                weekWordIds.push(shuffledWords[wordIndex].id);
                wordIndex++;
            }

            if (lessonWordIds.length > 0) {
                lessons.push({
                    id: uuid(),
                    deckId: DECK_ID,
                    day,
                    weekNumber: week,
                    type: "learn",
                    wordIds: lessonWordIds,
                    wordsCount: lessonWordIds.length,
                    name: `Day ${day}: Learn New Words`,
                    description: `Learn ${lessonWordIds.length} new vocabulary words`
                });

                console.log(`  Day ${day}: Learn ${lessonWordIds.length} words`);
                day++;
            }
        }

        // Day 6: Review day
        if (weekWordIds.length > 0) {
            lessons.push({
                id: uuid(),
                deckId: DECK_ID,
                day,
                weekNumber: week,
                type: "review",
                wordIds: weekWordIds,
                wordsCount: weekWordIds.length,
                name: `Day ${day}: Week ${week} Review`,
                description: `Review all ${weekWordIds.length} words from this week`
            });

            console.log(`  Day ${day}: Review ${weekWordIds.length} words`);
            day++;
        }

        // Day 7: Test day
        lessons.push({
            id: uuid(),
            deckId: DECK_ID,
            day,
            weekNumber: week,
            type: "test",
            wordIds: weekWordIds,
            wordsCount: 20, // 20 questions
            name: `Day ${day}: Week ${week} Test`,
            description: `Weekly assessment with 20 questions`
        });

        console.log(`  Day ${day}: Test (20 questions from week ${week})`);
        day++;
    }

    // Fill remaining days with review and final test
    const remainingWords = shuffledWords.slice(0, wordIndex);

    while (day <= TOTAL_DAYS) {
        const daysLeft = TOTAL_DAYS - day + 1;

        if (daysLeft > 1) {
            // Review days
            lessons.push({
                id: uuid(),
                deckId: DECK_ID,
                day,
                weekNumber: 9,
                type: "review",
                wordIds: remainingWords.slice(0, Math.min(50, remainingWords.length)).map(w => w.id),
                wordsCount: Math.min(50, remainingWords.length),
                name: `Day ${day}: Comprehensive Review`,
                description: `Review vocabulary learned so far`
            });
            console.log(`\nDay ${day}: Comprehensive Review`);
            day++;
        } else {
            // Final test (Last day)
            lessons.push({
                id: uuid(),
                deckId: DECK_ID,
                day,
                weekNumber: 9,
                type: "test",
                wordIds: remainingWords.map(w => w.id),
                wordsCount: 30,
                name: `Day ${day}: Final Exam`,
                description: `Comprehensive final assessment`
            });
            console.log(`\nDay ${day}: Final Exam`);
            day++;
        }
    }

    // Save to database
    // Save to database
    console.log('💾 Saving to database...');
    try {
        await dataStore.save((store) => {
            console.log('  Inside save mutator');
            console.log(`  Current dailyLessons count: ${store.dailyLessons?.length}`);

            // Clear existing lessons for this deck
            store.dailyLessons = store.dailyLessons.filter(l => l.deckId !== DECK_ID);
            console.log(`  After filter: ${store.dailyLessons.length}`);

            // Add new lessons
            store.dailyLessons.push(...lessons);
            console.log(`  After push: ${store.dailyLessons.length}`);
        });
        console.log('✅ Save function returned');
    } catch (error) {
        console.error('❌ Error saving to database:', error);
    }

    console.log(`\n✅ Generated ${lessons.length} daily lessons`);
    console.log(`📊 Learning days: ${lessons.filter(l => l.type === 'learn').length}`);
    console.log(`🔄 Review days: ${lessons.filter(l => l.type === 'review').length}`);
    console.log(`📝 Test days: ${lessons.filter(l => l.type === 'test').length}`);
    console.log(`📈 Total words: ${wordIndex}/${shuffledWords.length}`);
    console.log("\n🎉 Curriculum generation complete!");
}

async function run() {
    await dataStore.init();
    await generateCurriculum();
}

run().catch(console.error);
