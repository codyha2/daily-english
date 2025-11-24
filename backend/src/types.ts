export type DeckCategory =
  | "operations"
  | "things_general"
  | "things_picturable"
  | "qualities";

export interface Deck {
  id: string;
  name: string;
  description: string;
  category: DeckCategory;
  totalWords: number;
  version: number;
  language: "vi" | "en";
}

export interface WordEntry {
  id: string;
  deckId: string;
  headword: string;
  partOfSpeech: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  picturable: boolean;
  audioUrl?: string;
  imageUrl?: string;
  tags?: string[];
  oppositeOf?: string;
}

export type WordState = "new" | "learning" | "mastered" | "forgotten";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  dailyGoal: number;
  language: "vi" | "en";
  streak: number;
  lastSessionAt?: string;
  xp: number;
  notificationTime?: string;
}

export interface UserWord {
  id: string;
  userId: string;
  wordId: string;
  state: WordState;
  interval: number;
  dueDate: string;
  successStreak: number;
  failureCount: number;
  recallPercent: number;
  lastResult?: "know" | "hard" | "dont";
}

export interface Session {
  id: string;
  userId: string;
  deckId: string;
  createdAt: string;
  completedAt?: string;
  newTarget: number;
  reviewTarget: number;
  status: "active" | "completed";
  answers: SessionAnswer[];
  xpEarned: number;
}

export interface SessionAnswer {
  wordId: string;
  result: "know" | "hard" | "dont";
  timestamp: string;
  timeSpentMs: number;
}

export interface ImportJob {
  id: string;
  userId: string;
  fileName: string;
  status: "pending" | "parsed" | "error";
  createdAt: string;
  rows: number;
  logs: string[];
}

export type BadgeCriteria =
  | { type: "streak"; value: number }
  | { type: "words_mastered"; value: number }
  | { type: "sessions_completed"; value: number }
  | { type: "xp"; value: number };

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  studentIds: string[];
  createdAt: string;
}

export interface Class {
  id: string;
  teacherId: string;
  name: string;
  description?: string;
  studentIds: string[];
  assignedDecks: string[];
  createdAt: string;
}

export interface AnalyticsData {
  period: number;
  dailyXp: { date: string; xp: number }[];
  wordMasteryRate: { date: string; rate: number }[];
  accuracyTrend: { date: string; accuracy: number }[];
  learningVelocity: number;
  weakCategories: { category: string; accuracy: number }[];
  totalSessions: number;
  averageSessionXp: number;
  comparisonVsPrevious: {
    xpChange: number;
    velocityChange: number;
    accuracyChange: number;
  };
}

export interface ShareBadgeResponse {
  imageBase64: string;
  shareText: string;
}

// Phase 3: Group Study
export interface StudyRoom {
  id: string;
  name: string;
  code: string; // 6-digit join code
  ownerId: string;
  memberIds: string[];
  deckId: string;
  status: "waiting" | "active" | "completed";
  maxMembers: number;
  isPublic: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

// Phase 3: LMS Integration
export interface LMSConnection {
  id: string;
  userId: string;
  platform: "moodle" | "canvas";
  instanceUrl: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  connected: boolean;
}

export interface LMSAssignment {
  id: string;
  courseId: string;
  courseName: string;
  name: string;
  description: string;
  dueDate?: string;
  maxGrade: number;
  deckId?: string; // mapped deck
}

// 60-Day Curriculum System
export type LessonType = "learn" | "review" | "test";

export interface DailyLesson {
  id: string;
  deckId: string;
  day: number; // 1-60
  weekNumber: number; // 1-9
  type: LessonType;
  wordIds: string[]; // Words to learn/review this day
  wordsCount: number; // Number of words
  name: string; // e.g., "Day 1: New Words", "Week 1 Review"
  description: string;
}

export interface WeeklyTestScore {
  week: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  passed: boolean; // >=70%
}

export interface UserProgress {
  id: string;
  userId: string;
  deckId: string;
  currentDay: number; // Current unlocked day (1-60)
  completedDays: number[]; // [1, 2, 3, ...list of completed days]
  weeklyTestScores: WeeklyTestScore[];
  totalWordsLearned: number;
  streak: number; // Consecutive days active
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string; // When finished all 60 days
  activityHistory: { date: string; count: number }[]; // Track daily words learned
}

// Phase 3: Multi-user Sync
export type SyncEventType = "word_learned" | "session_complete" | "badge_earned" | "streak_update";

export interface SyncEvent {
  id: string;
  userId: string;
  type: SyncEventType;
  data: any;
  timestamp: string;
  synced: boolean;
}

export interface DatabaseShape {
  users: User[];
  decks: Deck[];
  words: WordEntry[];
  userWords: UserWord[];
  sessions: Session[];
  importJobs: ImportJob[];
  userBadges: UserBadge[];
  teachers: Teacher[];
  classes: Class[];
  studyRooms: StudyRoom[];
  chatMessages: ChatMessage[];
  lmsConnections: LMSConnection[];
  syncEvents: SyncEvent[];
  dailyLessons: DailyLesson[];
  userProgress: UserProgress[];
}

