import { v4 as uuid } from "uuid";
import { dataStore } from "./services/dataStore.js";

const sampleDecks = [
  {
    id: "deck-operations",
    name: "Operations",
    description: "100 từ chức năng, động từ, giới từ",
    category: "operations" as const,
    totalWords: 100,
    version: 1,
    language: "vi" as const,
  },
  {
    id: "deck-things",
    name: "Things (General)",
    description: "400 danh từ cơ bản",
    category: "things_general" as const,
    totalWords: 400,
    version: 1,
    language: "vi" as const,
  },
  {
    id: "deck-picturable",
    name: "Things (Picturable)",
    description: "200 từ có thể minh họa",
    category: "things_picturable" as const,
    totalWords: 200,
    version: 1,
    language: "vi" as const,
  },
  {
    id: "deck-qualities",
    name: "Qualities & Opposites",
    description: "100 tính từ + 50 cặp trái nghĩa",
    category: "qualities" as const,
    totalWords: 150,
    version: 1,
    language: "vi" as const,
  },
];

const sampleWords = [
  {
    deckId: "deck-operations",
    headword: "accept",
    partOfSpeech: "verb",
    meaningVi: "chấp nhận",
    exampleEn: "Please accept the gift.",
    exampleVi: "Hãy nhận món quà.",
    picturable: false,
  },
  {
    deckId: "deck-operations",
    headword: "across",
    partOfSpeech: "preposition",
    meaningVi: "băng qua",
    exampleEn: "Walk across the street.",
    exampleVi: "Băng qua con đường.",
    picturable: false,
  },
  {
    deckId: "deck-things",
    headword: "apple",
    partOfSpeech: "noun",
    meaningVi: "quả táo",
    exampleEn: "I eat an apple every morning.",
    exampleVi: "Tôi ăn một quả táo mỗi sáng.",
    picturable: true,
    imageUrl: "https://cdn.example.com/images/apple.png",
  },
  {
    deckId: "deck-picturable",
    headword: "bridge",
    partOfSpeech: "noun",
    meaningVi: "cây cầu",
    exampleEn: "The bridge crosses the river.",
    exampleVi: "Cây cầu bắc qua con sông.",
    picturable: true,
    imageUrl: "https://cdn.example.com/images/bridge.png",
  },
  {
    deckId: "deck-qualities",
    headword: "able",
    partOfSpeech: "adjective",
    meaningVi: "có năng lực",
    exampleEn: "She is able to finish on time.",
    exampleVi: "Cô ấy có thể hoàn thành đúng hạn.",
    picturable: false,
    oppositeOf: "unable",
  },
];

export async function seedIfNeeded() {
  const db = dataStore.snapshot;
  if (db.decks.length === 0) {
    await dataStore.save((store) => {
      store.decks.push(...sampleDecks);
    });
  }

  if (db.words.length === 0) {
    await dataStore.save((store) => {
      sampleWords.forEach((word) => {
        store.words.push({
          id: uuid(),
          audioUrl: `https://cdn.example.com/audio/${word.headword}.mp3`,
          ...word,
        });
      });
    });
  }

  if (db.users.length === 0) {
    await dataStore.save((store) => {
      store.users.push({
        id: "demo-user",
        name: "Demo Learner",
        email: "demo@example.com",
        role: "student",
        dailyGoal: 10,
        language: "vi",
        streak: 0,
        xp: 0,
        notificationTime: "20:00",
      });
    });
  }

  // Seed demo teacher and students
  if (!db.teachers || db.teachers.length === 0) {
    await dataStore.save((store) => {
      // Initialize arrays if they don't exist
      if (!store.teachers) store.teachers = [];
      if (!store.classes) store.classes = [];

      // Add demo teacher
      store.teachers.push({
        id: "demo-teacher",
        name: "Giáo viên Demo",
        email: "teacher@example.com",
        studentIds: ["demo-user", "student-001", "student-002"],
        createdAt: new Date().toISOString(),
      });

      // Add demo students
      store.users.push(
        {
          id: "student-001",
          name: "Học viên A",
          email: "student001@example.com",
          role: "student",
          dailyGoal: 10,
          language: "vi",
          streak: 5,
          xp: 250,
          notificationTime: "19:00",
        },
        {
          id: "student-002",
          name: "Học viên B",
          email: "student002@example.com",
          role: "student",
          dailyGoal: 20,
          language: "vi",
          streak: 3,
          xp: 180,
          notificationTime: "20:30",
        }
      );
    });
  }

  // Seed demo class
  if (!db.classes || db.classes.length === 0) {
    await dataStore.save((store) => {
      if (!store.classes) store.classes = [];

      store.classes.push({
        id: "class-demo",
        teacherId: "demo-teacher",
        name: "Lớp tiếng Anh cơ bản",
        description: "Lớp học từ vựng cơ bản cho người mới bắt đầu",
        studentIds: ["demo-user", "student-001", "student-002"],
        assignedDecks: ["deck-operations", "deck-things"],
        createdAt: new Date().toISOString(),
      });
    });
  }
}
