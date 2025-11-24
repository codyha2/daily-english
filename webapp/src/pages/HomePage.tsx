import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Book, Trophy, Zap, Clock, CheckCircle, Star, TrendingUp, Calendar as CalendarIcon, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CalendarView } from '../components/CalendarView'
import { ProgressChart } from '../components/ProgressChart'
import { StudyHeatmap } from '../components/StudyHeatmap'
import { AchievementBadges } from '../components/AchievementBadges'
import { Skeleton, CardSkeleton } from '../components/SkeletonLoader'

interface DailyLesson {
    id: string;
    day: number;
    weekNumber: number;
    type: 'learn' | 'review' | 'test';
    name: string;
    description: string;
    wordsCount: number;
}

interface UserProgress {
    currentDay: number;
    completedDays: number[];
    totalWordsLearned: number;
    streak: number;
    activityHistory: { date: string; count: number }[];
}
import { API_BASE_URL } from '../config/api';

const API_BASE = API_BASE_URL;
const DECK_ID = 'deck-850-basic';
const USER_ID = 'user-1';

export default function HomePage() {
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<DailyLesson | null>(null);
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyData();
    }, []);

    const fetchDailyData = async () => {
        try {
            const response = await fetch(
                `${API_BASE}/curriculum/daily-lesson/${USER_ID}/${DECK_ID}/current`
            );
            const data = await response.json();

            if (data.success) {
                setLesson(data.lesson);
                setProgress(data.progress);
            }
        } catch (err) {
            console.error('Failed to fetch daily data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <Skeleton width={300} height={40} />
                        <Skeleton width={200} height={24} />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton width={120} height={40} variant="circular" className="rounded-full" />
                        <Skeleton width={150} height={40} variant="circular" className="rounded-full" />
                    </div>
                </div>
                <CardSkeleton />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton width="100%" height={300} />
                    <Skeleton width="100%" height={300} />
                </div>
            </div>
        );
    }

    const isDayComplete = progress?.completedDays.includes(lesson?.day || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                        Welcome back! <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        {isDayComplete
                            ? <span className="text-emerald-600 font-semibold">You've completed today's goal! Great job!</span>
                            : "Ready to continue your English journey?"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-orange-600 rounded-2xl border border-orange-100 shadow-sm">
                        <Zap className="w-5 h-5 fill-orange-500 text-orange-500" />
                        <span className="font-bold">{progress?.streak || 0} Day Streak</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                        <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
                        <span className="font-bold">{progress?.totalWordsLearned || 0} Words</span>
                    </div>
                </div>
            </div>

            {/* Daily Task Card */}
            {lesson && (
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-violet-700 text-white shadow-xl shadow-brand-500/20 group"
                >
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-4 py-1.5 rounded-full bg-white/20 text-sm font-bold backdrop-blur-md border border-white/10 shadow-inner">
                                        Day {lesson.day} of 60
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-bold backdrop-blur-md border border-white/5 text-blue-100">
                                        Week {lesson.weekNumber}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{lesson.name}</h2>
                                <p className="text-blue-100 text-lg max-w-xl leading-relaxed">{lesson.description}</p>
                            </div>

                            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl rotate-3 group-hover:rotate-6 transition-all duration-500">
                                {lesson.type === 'learn' ? <Book className="w-12 h-12 text-white drop-shadow-lg" /> :
                                    lesson.type === 'review' ? <Clock className="w-12 h-12 text-white drop-shadow-lg" /> :
                                        <Trophy className="w-12 h-12 text-white drop-shadow-lg" />}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {!isDayComplete ? (
                                <button
                                    onClick={() => navigate('/daily-lesson')}
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-brand-600 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Start Today's Lesson
                                </button>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                    <div className="w-full sm:w-auto px-8 py-4 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl font-bold text-lg text-emerald-100 flex items-center justify-center gap-3 backdrop-blur-sm">
                                        <CheckCircle className="w-6 h-6" />
                                        Completed
                                    </div>
                                    <button
                                        onClick={() => navigate('/daily-lesson')}
                                        className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm"
                                    >
                                        Review Again
                                    </button>
                                </div>
                            )}

                            <div className="hidden sm:block h-12 w-px bg-white/20"></div>

                            <div className="text-center sm:text-left">
                                <p className="text-blue-200 text-sm font-medium mb-1 uppercase tracking-wider">Task Content</p>
                                <p className="font-bold text-xl">{lesson.wordsCount} {lesson.type === 'test' ? 'Questions' : 'Words'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Progress Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Activity */}
                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                <TrendingUp className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Weekly Activity</h3>
                                <p className="text-sm text-gray-500">Your learning momentum</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500">Last 7 days</span>
                    </div>
                    <ProgressChart data={progress?.activityHistory || []} />
                </div>

                {/* Study Consistency */}
                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-50 rounded-2xl">
                                <CalendarIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Study Consistency</h3>
                                <p className="text-sm text-gray-500">Every day counts</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500">Last 3 months</span>
                    </div>
                    <StudyHeatmap data={progress?.activityHistory || []} />
                </div>
            </div>

            {/* Achievements */}
            <div className="glass-card p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-yellow-50 rounded-2xl">
                        <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Achievements</h3>
                        <p className="text-sm text-gray-500">Badges you've earned</p>
                    </div>
                </div>
                <AchievementBadges progress={progress} />
            </div>

            {/* Calendar View */}
            {progress && (
                <div className="glass-card p-8 rounded-3xl">
                    <CalendarView
                        currentDay={progress.currentDay}
                        completedDays={progress.completedDays}
                        onDayClick={(day) => navigate(`/daily-lesson/${day}`)}
                    />
                </div>
            )}
        </motion.div>
    )
}
