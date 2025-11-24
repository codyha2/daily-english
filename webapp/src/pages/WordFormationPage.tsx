import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Minus, Sparkles, CheckCircle } from 'lucide-react';

interface WordFormation {
    id: string;
    type: 'prefix' | 'suffix';
    affix: string;
    meaning: string;
    meaningVi: string;
    partOfSpeech?: string;
    examples: {
        base: string;
        formed: string;
        meaningVi: string;
    }[];
}import { API_BASE_URL } from '../config/api';

const API_BASE = API_BASE_URL;

export default function WordFormationPage() {
    const [formations, setFormations] = useState<WordFormation[]>([]);
    const [selectedType, setSelectedType] = useState<'prefix' | 'suffix' | 'all'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWordFormations();
    }, []);

    const fetchWordFormations = async () => {
        try {
            const response = await fetch(`${API_BASE}/word-formations`);
            const data = await response.json();
            if (data.success) {
                setFormations(data.wordFormations);
            }
        } catch (err) {
            console.error('Failed to fetch word formations:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredFormations = selectedType === 'all'
        ? formations
        : formations.filter(f => f.type === selectedType);

    const prefixCount = formations.filter(f => f.type === 'prefix').length;
    const suffixCount = formations.filter(f => f.type === 'suffix').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-3xl p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Word Formation</h1>
                        <p className="text-blue-100 text-lg">Tạo từ mới với Tiền tố & Hậu tố</p>
                    </div>
                </div>
                <p className="text-blue-50 max-w-3xl">
                    Học cách biến đổi từ bằng cách thêm <strong>tiền tố (prefix)</strong> vào đầu hoặc <strong>hậu tố (suffix)</strong> vào cuối từ gốc.
                    Điều này giúp bạn mở rộng vốn từ vựng gấp nhiều lần!
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSelectedType('all')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedType === 'all'
                        ? 'bg-brand-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Tất cả ({formations.length})
                </button>
                <button
                    onClick={() => setSelectedType('prefix')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedType === 'prefix'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Minus className="w-5 h-5" />
                    Tiền tố ({prefixCount})
                </button>
                <button
                    onClick={() => setSelectedType('suffix')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedType === 'suffix'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Plus className="w-5 h-5" />
                    Hậu tố ({suffixCount})
                </button>
            </div>

            {/* Formation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFormations.map((formation, index) => (
                    <motion.div
                        key={formation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
                    >
                        {/* Affix Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl
                                    ${formation.type === 'prefix'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}>
                                    {formation.affix}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{formation.meaning}</h3>
                                    <p className="text-gray-500 text-sm">{formation.meaningVi}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold
                                ${formation.type === 'prefix'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-purple-50 text-purple-700'
                                }`}>
                                {formation.type === 'prefix' ? 'TIỀN TỐ' : 'HẬU TỐ'}
                            </div>
                        </div>

                        {/* Examples */}
                        <div className="space-y-3">
                            {formation.examples.map((example, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {formation.type === 'prefix' ? (
                                            <>
                                                <span className="px-2 py-1 bg-blue-200 text-blue-900 rounded font-bold text-sm">
                                                    {formation.affix}
                                                </span>
                                                <span className="font-medium">{example.base}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="font-bold text-brand-600">{example.formed}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-medium">{example.base}</span>
                                                <span className="px-2 py-1 bg-purple-200 text-purple-900 rounded font-bold text-sm">
                                                    {formation.affix}
                                                </span>
                                                <span className="text-gray-400">→</span>
                                                <span className="font-bold text-brand-600">{example.formed}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 ml-2">
                                        <CheckCircle className="w-3 h-3 inline mr-1 text-emerald-500" />
                                        {example.meaningVi}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {formation.partOfSpeech && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    <BookOpen className="w-4 h-4 inline mr-1" />
                                    Tạo ra: <span className="font-semibold text-gray-700">{formation.partOfSpeech}</span>
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredFormations.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Không có dữ liệu cho bộ lọc này</p>
                </div>
            )}
        </motion.div>
    );
}
