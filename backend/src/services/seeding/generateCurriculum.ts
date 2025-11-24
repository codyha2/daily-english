import { v4 as uuid } from "uuid";
import { prisma } from "../../db";

const DECK_ID = "deck-850-basic";
const TOTAL_DAYS = 60;
const WORDS_PER_LEARNING_DAY = 15;

/**
 * Generate 60-day curriculum for 850 Basic Words
 */
export async function generateCurriculum() {
    console.log("🎯 Generating 60-Day Curriculum...\n");

    // Get all words from the deck
    const deckWords = await prisma.wordEntry.findMany({
        where: { deckId: DECK_ID }
    });
    console.log(`📚 Found ${deckWords.length} words in deck`);

    if (deckWords.length === 0) {
        console.error("❌ No words found in deck. Run addBasicWords first!");
        return;
    }

    // Shuffle words for variety
    const shuffledWords = [...deckWords].sort(() => Math.random() - 0.5);

    const lessons: any[] = [];
    let wordIndex = 0;
    let day = 1;

    // Generate 8 complete weeks
    for (let week = 1; week <= 8; week++) {
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
            day++;
        }
    }

    // Save to database
    console.log('💾 Saving to database...');
    try {
        // Clear existing lessons for this deck
        await prisma.dailyLesson.deleteMany({
            where: { deckId: DECK_ID }
        });
        console.log(`  Cleared existing lessons`);

        // Add new lessons
        // Use Promise.all with create instead of createMany for better compatibility across DB providers
        await Promise.all(lessons.map(l =>
            prisma.dailyLesson.create({
                data: {
                    id: l.id,
                    deckId: l.deckId,
                    day: l.day,
                    weekNumber: l.weekNumber,
                    type: l.type,
                    wordIds: JSON.stringify(l.wordIds),
                    wordsCount: l.wordsCount,
                    name: l.name,
                    description: l.description
                }
            })
        ));
        console.log(`  Added ${lessons.length} lessons`);
    } catch (error) {
        console.error('❌ Error saving to database:', error);
        throw error;
    }

    console.log("\n🎉 Curriculum generation complete!");
}
