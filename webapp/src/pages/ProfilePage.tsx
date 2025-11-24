import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, Zap, Calendar, Award, Share2, Medal, Star, Flame } from 'lucide-react'

interface UserProgress {
    user: {
        name: string
        xp: number
        streak: number
        dailyGoal: number
    }
    stats: {
        wordsLearned: number
        wordsMastered: number
        totalSessions: number
    }
}

export default function ProfilePage() {
    const [data, setData] = useState<UserProgress | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/progress/demo-user')
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return null
    if (!data) return <div>No data</div>

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
                <div className="h-32 bg-gradient-to-r from-brand-600 to-violet-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="w-full h-full bg-brand-50 rounded-xl flex items-center justify-center text-4xl border border-brand-100">
                                    👨‍🎓
                                </div>
                            </div>
                            <div className="mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{data.user.name}</h1>
                                <p className="text-brand-600 font-medium">@demo-user</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-1">
                            <button className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                                Edit Profile
                            </button>
                            <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 py-6 border-t border-gray-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{data.user.xp}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total XP</div>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                                {data.user.streak} <span className="text-lg">🔥</span>
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Day Streak</div>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <div className="text-2xl font-bold text-gray-900">{data.stats.wordsLearned}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Words Learned</div>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <div className="text-2xl font-bold text-gray-900">{data.stats.totalSessions}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Sessions</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Goals Card */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-brand-600" />
                        Current Goals
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-700">Daily XP Goal</span>
                                <span className="font-bold text-brand-600">{data.user.dailyGoal} / 100</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-700">Weekly Streak</span>
                                <span className="font-bold text-emerald-600">5 / 7 days</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '71%' }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges Card */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-500" />
                        Recent Achievements
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                🚀
                            </div>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Starter</span>
                        </div>

                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                                🔥
                            </div>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">On Fire</span>
                        </div>

                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
                                ⭐
                            </div>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Star</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
