import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Calendar, Award, AlertCircle, Volume2 } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { getAIExamples, translateText } from '../services/openai';

interface Word {
    id: string;
    headword: string;
    partOfSpeech: string;
    meaningVi: string;
    exampleEn?: string;
    exampleVi?: string;
    phonetic?: string;
}

interface DailyLesson {
    id: string;
    day: number;
    weekNumber: number;
    type: 'learn' | 'review' | 'test';
    name: string;
    description: string;
    wordsCount: number;
    theme?: string;
    themeVi?: string;
    themeIcon?: string;
}

interface UserProgress {
    currentDay: number;
    completedDays: number[];
    totalWordsLearned: number;
    streak: number;
}
import { API_BASE_URL } from '../config/api';

const API_BASE = API_BASE_URL;
const DECK_ID = 'deck-850-basic';
const USER_ID = 'user-1';

export default function DailyLessonPage() {
    const { day } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<DailyLesson | null>(null);
    const [words, setWords] = useState<Word[]>([]);
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completing, setCompleting] = useState(false);
    const [aiExample, setAiExample] = useState<string>('');
    const [aiExampleVi, setAiExampleVi] = useState<string>('');
    const [loadingExample, setLoadingExample] = useState(false);
    const [wordImage, setWordImage] = useState<string>('');

    useEffect(() => {
        fetchDailyLesson();
    }, [day]);

    const fetchDailyLesson = async () => {
        try {
            setLoading(true);
            const endpoint = day
                ? `${API_BASE}/curriculum/daily-lesson/${USER_ID}/${DECK_ID}/day/${day}`
                : `${API_BASE}/curriculum/daily-lesson/${USER_ID}/${DECK_ID}/current`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.success) {
                if (data.lesson.type === 'test') {
                    navigate(`/weekly-test/${data.lesson.day}`);
                    return;
                }
                setLesson(data.lesson);
                setWords(data.words);
                setProgress(data.progress);
                setError('');
            } else {
                setError(data.error || 'Failed to load lesson');
            }
        } catch (err) {
            setError('Failed to load daily lesson');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
        }
    };

    const handleCompleteDay = async () => {
        if (!lesson || !progress) return;

        try {
            setCompleting(true);
            const response = await fetch(
                `${API_BASE}/curriculum/complete-day/${USER_ID}/${DECK_ID}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        day: lesson.day,
                        wordsLearned: words.length
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                // Navigate to home or show completion screen
                navigate('/');
            }
        } catch (err) {
            console.error('Failed to complete day:', err);
        } finally {
            setCompleting(false);
        }
    };

    const currentWord = words[currentIndex];

    useEffect(() => {
        if (currentWord && (currentWord.exampleEn?.startsWith('Example for') || !currentWord.exampleEn)) {
            loadAiExample(currentWord.headword);
        } else {
            setAiExample('');
            setAiExampleVi('');
        }
        // Load word image from Unsplash
        if (currentWord) {
            loadWordImage(currentWord.headword);
        }
    }, [currentIndex, words]);

    const loadWordImage = async (word: string) => {
        try {
            // Using Unsplash Source API for free random images
            const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(word)},illustration`;
            setWordImage(imageUrl);
        } catch (err) {
            console.error('Failed to load word image:', err);
            setWordImage('');
        }
    };

    const loadAiExample = async (word: string) => {
        setLoadingExample(true);
        try {
            const examples = await getAIExamples(word, 1);
            if (examples.length > 0) {
                const englishExample = examples[0];
                setAiExample(englishExample);

                // Translate to Vietnamese
                const vietnameseTranslation = await translateText(englishExample, 'en', 'vi');
                setAiExampleVi(vietnameseTranslation);
            }
        } catch (err) {
            console.error('Failed to load AI example:', err);
        } finally {
            setLoadingExample(false);
        }
    };


    const wordProgress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;
    const isLastWord = currentIndex === words.length - 1;
    const isCompleted = lesson && progress?.completedDays.includes(lesson.day);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (error || !lesson || !currentWord) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{error || 'No lesson available'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {lesson.themeIcon && (
                                <span className="text-3xl">{lesson.themeIcon}</span>
                            )}
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${lesson.type === 'learn' ? 'bg-blue-100 text-blue-700' :
                                lesson.type === 'review' ? 'bg-purple-100 text-purple-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                {lesson.type === 'learn' ? '📚 Learning' :
                                    lesson.type === 'review' ? '🔄 Review' :
                                        '📝 Test'}
                            </div>
                            <span className="text-sm text-gray-500">Week {lesson.weekNumber}</span>
                        </div>
                        {lesson.theme && (
                            <div className="mb-2">
                                <h2 className="text-lg font-bold text-brand-600">{lesson.theme}</h2>
                                {lesson.themeVi && <p className="text-sm text-gray-500">{lesson.themeVi}</p>}
                            </div>
                        )}
                        <h1 className="text-2xl font-bold text-gray-900">{lesson.name}</h1>
                        <p className="text-gray-600">{lesson.description}</p>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>Day {lesson.day}/60</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Award className="w-4 h-4" />
                            <span>{progress?.streak || 0} day streak</span>
                        </div>
                    </div>
                </div>

                {isCompleted && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-center gap-3 text-yellow-700">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Review Mode: You have already completed this lesson.</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{currentIndex + 1} / {words.length} words</span>
                    <span>{Math.round(wordProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-300"
                        style={{ width: `${wordProgress}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl shadow-brand-500/10 border border-gray-100 overflow-hidden min-h-[600px] flex flex-col relative"
                >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/10 to-brand-400/10 rounded-full blur-2xl -ml-24 -mb-24"></div>

                    {/* Word Image */}
                    {wordImage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative h-64 overflow-hidden"
                        >
                            <img
                                src={wordImage}
                                alt={currentWord.headword}
                                className="w-full h-full object-cover"
                                onError={() => setWordImage('')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
                        </motion.div>
                    )}

                    {/* Card Content */}
                    <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10 ${wordImage ? '-mt-8' : ''}`}>
                        <div className="mb-8">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-brand-700 to-purple-700 mb-4 drop-shadow-sm"
                            >
                                {currentWord.headword}
                            </motion.h2>
                            {currentWord.phonetic && (
                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                    <span className="font-mono text-lg">{currentWord.phonetic}</span>
                                    <AudioButton
                                        text={currentWord.headword}
                                        voice="alloy"
                                        size="sm"
                                        variant="ghost"
                                    />
                                </div>
                            )}
                        </div>

                        {showAnswer ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4 w-full max-w-2xl"
                            >
                                <p className="text-3xl text-gray-700 font-medium">
                                    {currentWord.meaningVi}
                                </p>
                                {currentWord.exampleEn && !aiExample && (
                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        <p className="text-gray-500 italic">"{currentWord.exampleEn}"</p>
                                        <AudioButton
                                            text={currentWord.exampleEn}
                                            voice="nova"
                                            size="sm"
                                            variant="ghost"
                                        />
                                    </div>
                                )}
                                {aiExample && (
                                    <div className="space-y-2 mt-6">
                                        {loadingExample ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                                <span className="text-sm text-gray-400">Generating example...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-center gap-2">
                                                    <p className="text-gray-500 italic">"{aiExample}"</p>
                                                    <AudioButton
                                                        text={aiExample}
                                                        voice="nova"
                                                        size="sm"
                                                        variant="ghost"
                                                    />
                                                </div>
                                                {aiExampleVi && (
                                                    <p className="text-gray-400 text-sm text-center">({aiExampleVi})</p>
                                                )}
                                                <div className="flex justify-center">
                                                    <span className="text-xs text-brand-500 font-medium bg-brand-50 px-2 py-0.5 rounded-full">✨ AI Generated</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                                {!aiExample && currentWord.exampleVi && !currentWord.exampleVi.startsWith('Ví dụ cho') && (
                                    <p className="text-gray-400 text-sm mt-4">({currentWord.exampleVi})</p>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-32 flex items-center justify-center">
                                <p className="text-gray-400 text-sm">Click "Show Answer" to reveal meaning</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        {!showAnswer ? (
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:scale-[1.02] transition-all active:scale-[0.98]"
                            >
                                Show Answer
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {!isLastWord ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                // Play audio for the word in English (word + example if available)
                                                const exampleText = aiExample || currentWord.exampleEn || '';
                                                const textToSpeak = exampleText
                                                    ? `${currentWord.headword}. ${exampleText}`
                                                    : currentWord.headword;
                                                const audio = new Audio();
                                                fetch(`${API_BASE}/ai/test/tts?text=${encodeURIComponent(textToSpeak)}&voice=alloy`)
                                                    .then(res => res.blob())
                                                    .then(blob => {
                                                        const url = URL.createObjectURL(blob);
                                                        audio.src = url;
                                                        audio.play();
                                                        audio.onended = () => URL.revokeObjectURL(url);
                                                    })
                                                    .catch(err => console.error('Audio playback failed:', err));
                                            }}
                                            className="py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Volume2 className="w-6 h-6" /> Listen Again
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-6 h-6" /> Got It!
                                        </button>
                                    </>
                                ) : (
                                    isCompleted ? (
                                        <button
                                            onClick={() => navigate('/')}
                                            className="col-span-2 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Back to Calendar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCompleteDay}
                                            disabled={completing}
                                            className="col-span-2 py-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {completing ? (
                                                <><Loader2 className="w-6 h-6 animate-spin" /> Completing...</>
                                            ) : (
                                                <><Award className="w-6 h-6" /> Complete Day {lesson.day}</>
                                            )}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div >
    );
}
