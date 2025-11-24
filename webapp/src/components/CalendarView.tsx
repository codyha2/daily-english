import { motion } from 'framer-motion';
import { CheckCircle, Lock, Star, Trophy } from 'lucide-react';

interface CalendarViewProps {
    currentDay: number;
    completedDays: number[];
    onDayClick: (day: number) => void;
}

export function CalendarView({ currentDay, completedDays, onDayClick }: CalendarViewProps) {
    const days = Array.from({ length: 60 }, (_, i) => i + 1);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Journey</h2>
                    <p className="text-gray-500">60 Days to English Mastery</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-600">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                        <span className="text-gray-600">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        <span className="text-gray-600">Locked</span>
                    </div>
                </div>
            </div>

            <motion.div
                className="grid grid-cols-7 gap-3 sm:gap-4"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.03
                        }
                    }
                }}
                initial="hidden"
                animate="show"
            >
                {days.map((day) => {
                    const isCompleted = completedDays.includes(day);
                    const isCurrent = day === currentDay;
                    const isLocked = !isCompleted && !isCurrent;
                    const isTestDay = day % 7 === 0;

                    return (
                        <motion.button
                            key={day}
                            variants={{
                                hidden: { opacity: 0, scale: 0.8 },
                                show: { opacity: 1, scale: 1 }
                            }}
                            whileHover={!isLocked ? { scale: 1.05 } : {}}
                            whileTap={!isLocked ? { scale: 0.95 } : {}}
                            onClick={() => !isLocked && onDayClick(day)}
                            disabled={isLocked}
                            className={`
                                relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
                                ${isCompleted
                                    ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100'
                                    : isCurrent
                                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-100'
                                        : 'bg-gray-50 text-gray-400 border border-gray-100'
                                }
                                ${isTestDay && !isLocked && !isCompleted && !isCurrent ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                            `}
                        >
                            {isTestDay && (
                                <div className="absolute -top-1 -right-1">
                                    <Trophy className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : isCurrent ? 'text-yellow-300' : 'text-purple-400'}`} />
                                </div>
                            )}

                            <span className={`text-lg font-bold ${isTestDay ? 'font-black' : ''}`}>
                                {day}
                            </span>

                            {isCompleted && (
                                <CheckCircle className="w-4 h-4" />
                            )}

                            {isLocked && (
                                <Lock className="w-4 h-4 opacity-50" />
                            )}

                            {isCurrent && (
                                <Star className="w-4 h-4 fill-current animate-pulse" />
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
