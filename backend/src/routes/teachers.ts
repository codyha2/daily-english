import { Router } from "express";
import { dataStore } from "../services/dataStore.js";

export const teachersRouter = Router();

// Get all students for a teacher
teachersRouter.get("/:teacherId/students", async (req, res) => {
    await dataStore.init();
    const { teacherId } = req.params;
    const { teachers, users, userWords } = dataStore.snapshot;

    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    // Get all students
    const students = users
        .filter((u) => teacher.studentIds.includes(u.id))
        .map((student) => {
            const words = userWords.filter((uw) => uw.userId === student.id);
            const mastered = words.filter((uw) => uw.state === "mastered").length;

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                xp: student.xp,
                streak: student.streak,
                dailyGoal: student.dailyGoal,
                wordsLearned: words.length,
                wordsMastered: mastered,
                lastSessionAt: student.lastSessionAt,
            };
        });

    res.json({ students });
});

// Get detailed progress for a specific student
teachersRouter.get("/:teacherId/students/:studentId/summary", async (req, res) => {
    await dataStore.init();
    const { teacherId, studentId } = req.params;
    const { teachers, users, userWords, sessions, words: allWords, userBadges } = dataStore.snapshot;

    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    if (!teacher.studentIds.includes(studentId)) {
        return res.status(403).json({ error: "Student not in teacher's list" });
    }

    const student = users.find((u) => u.id === studentId);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    // Get student's words
    const words = userWords.filter((uw) => uw.userId === studentId);
    const mastered = words.filter((uw) => uw.state === "mastered").length;

    // Get weakest words
    const weakest = [...words]
        .sort((a, b) => a.recallPercent - b.recallPercent)
        .slice(0, 10)
        .map((entry) => {
            const details = allWords.find((word) => word.id === entry.wordId);
            if (!details) return null;
            return {
                ...details,
                recallPercent: entry.recallPercent,
            };
        })
        .filter(Boolean);

    // Get recent sessions
    const recentSessions = sessions
        .filter((s) => s.userId === studentId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 7)
        .map((s) => ({
            id: s.id,
            createdAt: s.createdAt,
            xpEarned: s.xpEarned,
            newWords: s.newTarget,
            reviewWords: s.reviewTarget,
        }));

    // Get badges
    const badges = userBadges
        .filter((ub) => ub.userId === studentId)
        .map((ub) => ub.badgeId);

    res.json({
        student: {
            id: student.id,
            name: student.name,
            email: student.email,
            xp: student.xp,
            streak: student.streak,
            dailyGoal: student.dailyGoal,
        },
        stats: {
            wordsLearned: words.length,
            wordsMastered: mastered,
            totalSessions: sessions.filter((s) => s.userId === studentId).length,
        },
        weakest,
        recentSessions,
        badges,
    });
});

// Get all classes for a teacher
teachersRouter.get("/:teacherId/classes", async (req, res) => {
    await dataStore.init();
    const { teacherId } = req.params;
    const { teachers, classes } = dataStore.snapshot;

    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    const teacherClasses = classes.filter((c) => c.teacherId === teacherId);

    res.json({ classes: teacherClasses });
});

// Create a new class
teachersRouter.post("/:teacherId/classes", async (req, res) => {
    await dataStore.init();
    const { teacherId } = req.params;
    const { name, description, studentIds, assignedDecks } = req.body;
    const { teachers } = dataStore.snapshot;

    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    const newClass = {
        id: `class-${Date.now()}`,
        teacherId,
        name,
        description: description || "",
        studentIds: studentIds || [],
        assignedDecks: assignedDecks || [],
        createdAt: new Date().toISOString(),
    };

    await dataStore.save((db) => {
        db.classes.push(newClass);
    });

    res.status(201).json({ class: newClass });
});

// Assign deck to a class
teachersRouter.post("/:teacherId/classes/:classId/assign-deck", async (req, res) => {
    await dataStore.init();
    const { teacherId, classId } = req.params;
    const { deckId } = req.body;
    const { teachers, classes } = dataStore.snapshot;

    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    const classItem = classes.find((c) => c.id === classId);
    if (!classItem) {
        return res.status(404).json({ error: "Class not found" });
    }

    if (classItem.teacherId !== teacherId) {
        return res.status(403).json({ error: "Not authorized" });
    }

    await dataStore.save((db) => {
        const cls = db.classes.find((c) => c.id === classId);
        if (cls && !cls.assignedDecks.includes(deckId)) {
            cls.assignedDecks.push(deckId);
        }
    });

    res.json({ success: true });
});
