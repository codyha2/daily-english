import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { tensesData } from '../data/tensesData';
import { AudioButton } from '../components/AudioButton';

export default function TenseDetailPage() {
    const { tenseId } = useParams<{ tenseId: string }>();
    const navigate = useNavigate();

    const tense = tensesData.find(t => t.id === tenseId);

    if (!tense) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-700">Tense not found</h2>
                    <button
                        onClick={() => navigate('/tenses')}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        ← Back to Tenses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/tenses')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-2 h-12 rounded-full"
                            style={{ backgroundColor: tense.color }}
                        />
                        <div>
                            <h1 className="text-3xl font-bold" style={{ color: tense.color }}>
                                {tense.name}
                            </h1>
                            <p className="text-gray-600 text-lg">{tense.nameVi}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Definition */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: tense.color }}>
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${tense.color}15` }}>
                        <BookOpen className="w-6 h-6" style={{ color: tense.color }} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Định nghĩa</h2>
                        <p className="text-gray-700 leading-relaxed mb-2">{tense.definitionVi}</p>
                        <p className="text-gray-600 text-sm italic">{tense.definition}</p>
                    </div>
                </div>
            </div>

            {/* Formulas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${tense.color}15` }}>
                        <CheckCircle2 className="w-6 h-6" style={{ color: tense.color }} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Công thức</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2" style={{ borderColor: `${tense.color}30` }}>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Loại câu</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Động từ thường</th>
                                {tense.formulas.affirmative.toBe && (
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Động từ to be</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-700">Khẳng định</td>
                                <td className="py-4 px-4">
                                    <code className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-mono text-sm">
                                        {tense.formulas.affirmative.regular}
                                    </code>
                                </td>
                                {tense.formulas.affirmative.toBe && (
                                    <td className="py-4 px-4">
                                        <code className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-mono text-sm">
                                            {tense.formulas.affirmative.toBe}
                                        </code>
                                    </td>
                                )}
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-700">Phủ định</td>
                                <td className="py-4 px-4">
                                    <code className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-mono text-sm">
                                        {tense.formulas.negative.regular}
                                    </code>
                                </td>
                                {tense.formulas.negative.toBe && (
                                    <td className="py-4 px-4">
                                        <code className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-mono text-sm">
                                            {tense.formulas.negative.toBe}
                                        </code>
                                    </td>
                                )}
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-700">Nghi vấn/Câu hỏi Yes/No</td>
                                <td className="py-4 px-4">
                                    <code className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-mono text-sm">
                                        {tense.formulas.interrogative.regular}
                                    </code>
                                </td>
                                {tense.formulas.interrogative.toBe && (
                                    <td className="py-4 px-4">
                                        <code className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-mono text-sm">
                                            {tense.formulas.interrogative.toBe}
                                        </code>
                                    </td>
                                )}
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-700">Nghi vấn/Câu hỏi thông tin</td>
                                <td className="py-4 px-4">
                                    <code className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-mono text-sm">
                                        {tense.formulas.wh_question.regular}
                                    </code>
                                </td>
                                {tense.formulas.wh_question.toBe && (
                                    <td className="py-4 px-4">
                                        <code className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-mono text-sm">
                                            {tense.formulas.wh_question.toBe}
                                        </code>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Usages */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${tense.color}15` }}>
                        <Lightbulb className="w-6 h-6" style={{ color: tense.color }} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Cách dùng</h2>
                </div>

                <div className="space-y-4">
                    {tense.usages.map((usage, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-5 rounded-xl border-2 border-gray-100 hover:border-opacity-50 transition-all"
                            style={{ borderColor: `${tense.color}20` }}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm"
                                    style={{ backgroundColor: tense.color }}
                                >
                                    {index + 1}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h3 className="font-bold text-gray-800">{usage.title}</h3>
                                    <p className="text-gray-600 text-sm">{usage.description}</p>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-gray-800 mb-1">{usage.example.en}</p>
                                        <p className="text-gray-600 italic text-sm">→ {usage.example.vi}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Time Markers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${tense.color}15` }}>
                        <Clock className="w-6 h-6" style={{ color: tense.color }} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Dấu hiệu nhận biết</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tense.timeMarkers.map((marker, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="px-4 py-2 rounded-full text-sm font-medium border-2"
                            style={{
                                backgroundColor: `${tense.color}10`,
                                borderColor: `${tense.color}30`,
                                color: tense.color
                            }}
                        >
                            {marker}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Examples */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ví dụ</h2>

                <div className="space-y-6">
                    {['affirmative', 'negative', 'interrogative', 'wh_question'].map((type) => {
                        const typeExamples = tense.examples.filter(ex => ex.type === type);
                        if (typeExamples.length === 0) return null;

                        const typeNames: Record<string, string> = {
                            affirmative: 'Khẳng định',
                            negative: 'Phủ định',
                            interrogative: 'Nghi vấn/Câu hỏi Yes/No',
                            wh_question: 'Nghi vấn/Câu hỏi thông tin'
                        };

                        return (
                            <div key={type}>
                                <h3 className="font-bold text-lg text-gray-800 mb-3">{typeNames[type]}</h3>
                                <div className="space-y-3">
                                    {typeExamples.map((example, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="text-gray-800 font-medium mb-1">{example.en}</p>
                                                    <p className="text-gray-600 italic text-sm">({example.vi})</p>
                                                </div>
                                                <AudioButton
                                                    text={example.en}
                                                    voice="alloy"
                                                    size="sm"
                                                    variant="ghost"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={() => navigate('/tenses')}
                    className="px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: tense.color }}
                >
                    ← Quay lại trang tổng quan
                </button>
            </div>
        </motion.div>
    );
}
