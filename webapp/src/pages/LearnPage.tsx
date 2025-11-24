import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Volume2, Trophy, Sparkles, RefreshCw, Search, Download, Star, BookOpen, GraduationCap } from 'lucide-react'
import { AudioButton } from '../components/AudioButton'
import { openaiClient } from '../services/openai'
import { toast } from '../utils/toast'
import { Skeleton } from '../components/SkeletonLoader'
import { Tooltip } from '../components/Tooltip'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

interface Word {
    id: string;
    headword: string;
    partOfSpeech: string;
    meaningVi: string;
    exampleEn?: string;
    exampleVi?: string;
    phonetic?: string;
}
import { API_BASE_URL } from '../config/api';

const API_BASE = API_BASE_URL;
const DECK_ID = 'deck-850-basic';

export default function LearnPage() {
    const [activeTab, setActiveTab] = useState<'practice' | 'vocabulary'>('practice');
    const [words, setWords] = useState<Word[]>([]);
    const [allWords, setAllWords] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completed, setCompleted] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('favorite_words');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPos, setFilterPos] = useState('all');
    const [sortBy, setSortBy] = useState<'a-z' | 'z-a' | 'newest'>('a-z');

    useEffect(() => {
        fetchLearningWords();
        fetchAllWords();
    }, []);

    useEffect(() => {
        localStorage.setItem('favorite_words', JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    const fetchLearningWords = async () => {
        try {
            setLoading(true);
            setCompleted(false);
            const response = await fetch(`${API_BASE}/words/learning/${DECK_ID}?limit=20`);
            const data = await response.json();

            if (data.success && data.words.length > 0) {
                setWords(data.words);
                setError('');
                setCurrentIndex(0);
            } else {
                setError('No words available to learn');
            }
        } catch (err) {
            setError('Failed to load vocabulary');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllWords = async () => {
        try {
            const response = await fetch(`${API_BASE}/words/learning/${DECK_ID}?limit=1000`);
            const data = await response.json();
            if (data.success) {
                setAllWords(data.words);
            }
        } catch (err) {
            console.error('Failed to load all words', err);
        }
    };

    const toggleFavorite = (wordId: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(wordId)) {
            newFavorites.delete(wordId);
            toast.success('Removed from favorites');
        } else {
            newFavorites.add(wordId);
            toast.success('Added to favorites');
        }
        setFavorites(newFavorites);
    };

    const handleExport = () => {
        const headers = ['Word', 'Part of Speech', 'Meaning (VN)', 'Example (EN)', 'Example (VN)'];
        const csvContent = [
            headers.join(','),
            ...allWords.map(w => [
                w.headword,
                w.partOfSpeech,
                `"${w.meaningVi}"`,
                `"${w.exampleEn || ''}"`,
                `"${w.exampleVi || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'my_vocabulary.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Vocabulary exported successfully');
    };

    const filteredWords = useMemo(() => {
        return allWords
            .filter(w => {
                const matchesSearch = w.headword.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    w.meaningVi.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesPos = filterPos === 'all' || w.partOfSpeech.toLowerCase() === filterPos.toLowerCase();
                return matchesSearch && matchesPos;
            })
            .sort((a, b) => {
                if (sortBy === 'a-z') return a.headword.localeCompare(b.headword);
                if (sortBy === 'z-a') return b.headword.localeCompare(a.headword);
                return 0;
            });
    }, [allWords, searchQuery, filterPos, sortBy]);

    // Practice Mode Logic
    const currentWord = words[currentIndex];
    const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

    const handleListen = async () => {
        if (currentWord) {
            await openaiClient.playTextToSpeech(currentWord.headword);
        }
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCompleted(true);
        }
    };

    // Keyboard Shortcuts
    useKeyboardShortcuts({
        'ArrowRight': handleNext,
        'Space': handleListen,
        'f': () => currentWord && toggleFavorite(currentWord.id)
    });

    if (loading && activeTab === 'practice') {
        return (
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <Skeleton width={200} height={32} />
                    <Skeleton width={100} height={24} />
                </div>
                <div className="bg-white rounded-3xl p-12 h-[500px] flex flex-col items-center justify-center space-y-6">
                    <Skeleton variant="circular" width={64} height={64} />
                    <Skeleton width={300} height={48} />
                    <div className="space-y-2 w-full max-w-md">
                        <Skeleton width="100%" height={24} />
                        <Skeleton width="80%" height={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setActiveTab('practice')}
                        className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'practice'
                            ? 'bg-white text-brand-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Practice
                    </button>
                    <button
                        onClick={() => setActiveTab('vocabulary')}
                        className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'vocabulary'
                            ? 'bg-white text-brand-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        My Vocabulary
                    </button>
                </div>
            </div>

            {activeTab === 'practice' ? (
                // PRACTICE TAB CONTENT
                completed ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-brand-200">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                            >
                                <Trophy className="w-12 h-12 text-white" />
                            </motion.div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Chúc mừng bạn! 🎉</h1>
                            <p className="text-xl text-gray-700 mb-2">
                                Bạn đã hoàn thành <span className="font-bold text-brand-600">{words.length} từ vựng</span>!
                            </p>
                            <p className="text-gray-600 mb-8">Tuyệt vời! Hãy tiếp tục phát huy nhé! 💪</p>

                            <div className="flex items-center justify-center gap-4 mb-8">
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                                <p className="text-lg font-semibold text-brand-700">
                                    Bạn đang trên con đường thành công!
                                </p>
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                            </div>

                            <button
                                onClick={fetchLearningWords}
                                className="mt-8 px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-700 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Học thêm từ mới
                            </button>
                        </div>
                    </motion.div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-red-600 mb-4">{error}</p>
                        <button onClick={fetchLearningWords} className="px-6 py-3 bg-brand-600 text-white rounded-xl">Retry</button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Learning Session</h1>
                                <p className="text-gray-500">850 Basic Words • {words.length - currentIndex} words remaining</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-gray-600">{Math.round(progress)}%</span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentWord?.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-panel rounded-3xl overflow-hidden min-h-[500px] flex flex-col relative"
                            >
                                <Tooltip content="Add to favorites (Press 'F')" position="left">
                                    <button
                                        onClick={() => toggleFavorite(currentWord.id)}
                                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
                                    >
                                        <Star className={`w-6 h-6 ${favorites.has(currentWord.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    </button>
                                </Tooltip>

                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
                                    <div className="mb-8">
                                        <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-4">
                                            {currentWord?.partOfSpeech || 'Word'}
                                        </span>
                                        <h2 className="text-5xl font-bold text-gray-900 mb-4">{currentWord?.headword}</h2>
                                        {currentWord?.phonetic && (
                                            <div className="flex items-center justify-center gap-3 text-gray-400">
                                                <span className="font-mono text-lg">{currentWord.phonetic}</span>
                                                <AudioButton text={currentWord.headword} voice="alloy" size="sm" variant="ghost" />
                                            </div>
                                        )}
                                    </div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 w-full max-w-2xl">
                                        <p className="text-2xl text-gray-700 font-medium">{currentWord?.meaningVi}</p>
                                        {currentWord?.exampleEn && (
                                            <div className="flex items-center justify-center gap-2 mt-4">
                                                <p className="text-gray-500 italic">"{currentWord.exampleEn}"</p>
                                                <AudioButton text={currentWord.exampleEn} voice="nova" size="sm" variant="ghost" />
                                            </div>
                                        )}
                                        {currentWord?.exampleVi && (
                                            <p className="text-gray-400 text-sm">({currentWord.exampleVi})</p>
                                        )}
                                    </motion.div>
                                </div>

                                <div className="p-6 bg-gray-50 border-t border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Tooltip content="Listen to pronunciation (Space)" position="top">
                                            <button onClick={handleListen} className="w-full py-4 bg-white border-2 border-blue-100 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 hover:border-blue-200 transition-colors flex items-center justify-center gap-2">
                                                <Volume2 className="w-6 h-6" /> Listen
                                            </button>
                                        </Tooltip>
                                        <Tooltip content="Next word (Right Arrow)" position="top">
                                            <button onClick={handleNext} className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                                                <CheckCircle className="w-6 h-6" /> I know it
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )
            ) : (
                // VOCABULARY TAB CONTENT
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* Controls */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search words..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                            <select
                                value={filterPos}
                                onChange={(e) => setFilterPos(e.target.value)}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Types</option>
                                <option value="noun">Noun</option>
                                <option value="verb">Verb</option>
                                <option value="adjective">Adjective</option>
                                <option value="adverb">Adverb</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="a-z">A-Z</option>
                                <option value="z-a">Z-A</option>
                            </select>

                            <Tooltip content="Download as CSV" position="top">
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-brand-50 text-brand-700 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Download className="w-4 h-4" /> Export CSV
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Word List */}
                    <div className="glass-panel rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Word</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Meaning</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Example</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredWords.map((word) => (
                                        <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => toggleFavorite(word.id)}>
                                                        <Star className={`w-4 h-4 ${favorites.has(word.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                    </button>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{word.headword}</p>
                                                        <p className="text-xs text-gray-500 font-mono">{word.phonetic}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{word.meaningVi}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {word.partOfSpeech}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 italic">"{word.exampleEn}"</p>
                                                <p className="text-xs text-gray-400 mt-1">{word.exampleVi}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <AudioButton text={word.headword} size="sm" variant="ghost" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredWords.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No words found matching your filters.
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
