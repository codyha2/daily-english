import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Target } from 'lucide-react';

export default function TensesPage() {
    const navigate = useNavigate();

    const tenseGroups = [
        {
            category: 'present',
            title: 'Present Tenses',
            titleVi: 'Các thì hiện tại',
            color: '#6366F1',
            gradient: 'from-indigo-500 to-purple-600',
            tenses: [
                { id: 'present-simple', name: 'Present Simple', nameVi: 'Hiện tại đơn' },
                { id: 'present-continuous', name: 'Present Continuous', nameVi: 'Hiện tại tiếp diễn' },
                { id: 'present-perfect', name: 'Present Perfect', nameVi: 'Hiện tại hoàn thành' },
                { id: 'present-perfect-continuous', name: 'Present Perfect Continuous', nameVi: 'Hiện tại hoàn thành tiếp diễn' }
            ]
        },
        {
            category: 'past',
            title: 'Past Tenses',
            titleVi: 'Các thì quá khứ',
            color: '#1E40AF',
            gradient: 'from-blue-700 to-blue-900',
            tenses: [
                { id: 'past-simple', name: 'Past Simple', nameVi: 'Quá khứ đơn' },
                { id: 'past-continuous', name: 'Past Continuous', nameVi: 'Quá khứ tiếp diễn' },
                { id: 'past-perfect', name: 'Past Perfect', nameVi: 'Quá khứ hoàn thành' },
                { id: 'past-perfect-continuous', name: 'Past Perfect Continuous', nameVi: 'Quá khứ hoàn thành tiếp diễn' }
            ]
        },
        {
            category: 'future',
            title: 'Future Tenses',
            titleVi: 'Các thì tương lai',
            color: '#EC4899',
            gradient: 'from-pink-500 to-rose-600',
            tenses: [
                { id: 'future-simple', name: 'Future Simple', nameVi: 'Tương lai đơn' },
                { id: 'future-continuous', name: 'Future Continuous', nameVi: 'Tương lai tiếp diễn' },
                { id: 'future-perfect', name: 'Future Perfect', nameVi: 'Tương lai hoàn thành' },
                { id: 'future-perfect-continuous', name: 'Future Perfect Continuous', nameVi: 'Tương lai hoàn thành tiếp diễn' }
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg"
                >
                    <Clock className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">English Tenses</h1>
                </motion.div>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                    Học 12 thì tiếng Anh với công thức đầy đủ, ví dụ minh họa và bài tập thực hành
                </p>
            </div>

            {/* Timeline Visualization */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="flex-1 h-2 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-700 font-semibold">
                            Past
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-700 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <div className="flex-1 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-indigo-600 font-semibold">
                            Present
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    </div>
                    <div className="flex-1 h-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-pink-600 font-semibold">
                            Future
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-600 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                </div>
            </div>

            {/* Tense Groups */}
            {tenseGroups.map((group, groupIndex) => (
                <motion.div
                    key={group.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className={`h-1 flex-grow bg-gradient-to-r ${group.gradient} rounded-full`}></div>
                        <h2 className="text-2xl font-bold" style={{ color: group.color }}>
                            {group.title}
                        </h2>
                        <div className={`h-1 flex-grow bg-gradient-to-r ${group.gradient} rounded-full`}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.tenses.map((tense, tenseIndex) => (
                            <motion.button
                                key={tense.id}
                                onClick={() => navigate(`/tenses/${tense.id}`)}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (groupIndex * 0.1) + (tenseIndex * 0.05) }}
                                className="relative group bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:border-opacity-50 transition-all text-left overflow-hidden"
                                style={{ borderColor: `${group.color}20` }}
                            >
                                {/* Background Gradient */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                                    style={{ background: `linear-gradient(135deg, ${group.color}, transparent)` }}
                                ></div>

                                <div className="relative z-10 flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-5 h-5" style={{ color: group.color }} />
                                            <h3 className="font-bold text-lg" style={{ color: group.color }}>
                                                {tense.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            {tense.nameVi}
                                        </p>
                                    </div>
                                    <Target className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>

                                {/* Hover Effect Line */}
                                <div
                                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300"
                                    style={{ backgroundColor: group.color }}
                                ></div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            ))}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">12</div>
                    <div className="text-gray-700 font-medium">Thì tiếng Anh</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600 mb-2">48+</div>
                    <div className="text-gray-700 font-medium">Ví dụ minh họa</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
                    <div className="text-3xl font-bold text-pink-600 mb-2">100+</div>
                    <div className="text-gray-700 font-medium">Bài tập luyện tập</div>
                </div>
            </div>
        </motion.div>
    );
}
