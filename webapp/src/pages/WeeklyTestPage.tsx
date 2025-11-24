import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Trophy, AlertCircle } from 'lucide-react';

interface Word {
    id: string;
    headword: string;
    partOfSpeech: string;
    meaningVi: string;
    exampleEn?: string;
    exampleVi?: string;
    phonetic?: string;
}

interface Question {
    id: number;
    type: 'meaning' | 'word';
    question: string;
    options: string[];
    correctAnswer: string;
    word: Word;
}import { API_BASE_URL } from '../config/api';

const API_BASE = API_BASE_URL;
const DECK_ID = 'deck-850-basic';
const USER_ID = 'demo-user';

export default function WeeklyTestPage() {
    const { day } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        fetchTestContent();
    }, [day]);

    const fetchTestContent = async () => {
        try {
            // Fetch the test lesson (which contains the words to test)
            const endpoint = day
                ? `${API_BASE}/curriculum/daily-lesson/${USER_ID}/${DECK_ID}/day/${day}`
                : `${API_BASE}/curriculum/daily-lesson/${USER_ID}/${DECK_ID}/current`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.success && data.words.length > 0) {
                generateQuestions(data.words);
            }
        } catch (err) {
            console.error('Failed to load test:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateQuestions = (words: Word[]) => {
        const generatedQuestions: Question[] = words.map((word, index) => {
            const isMeaningQuestion = Math.random() > 0.5;
            const otherWords = words.filter(w => w.id !== word.id);

            // Get 3 random distractors
            const distractors = otherWords
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(w => isMeaningQuestion ? w.meaningVi : w.headword);

            const correctAnswer = isMeaningQuestion ? word.meaningVi : word.headword;
            const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());

            return {
                id: index,
                type: isMeaningQuestion ? 'meaning' : 'word',
                question: isMeaningQuestion
                    ? `What is the meaning of "${word.headword}"?`
                    : `Which word means "${word.meaningVi}"?`,
                options,
                correctAnswer,
                word
            };
        });

        setQuestions(generatedQuestions);
    };

    const handleOptionClick = (option: string) => {
        if (selectedOption) return; // Prevent multiple clicks

        setSelectedOption(option);
        const correct = option === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        }

        // Auto advance after delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setShowResult(true);
                submitTest(score + (correct ? 1 : 0));
            }
        }, 1500);
    };

    const submitTest = async (finalScore: number) => {
        try {
            const percentage = (finalScore / questions.length) * 100;

            await fetch(`${API_BASE}/curriculum/weekly-test/${USER_ID}/${DECK_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    week: Math.ceil((parseInt(day || '0')) / 7),
                    score: percentage,
                    totalQuestions: questions.length,
                    correctAnswers: finalScore
                })
            });

            // If passed, also complete the day to unlock next week
            if (percentage >= 70) {
                await fetch(`${API_BASE}/curriculum/complete-day/${USER_ID}/${DECK_ID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        day: parseInt(day || '0'),
                        wordsLearned: 0 // Test doesn't add new words learned count usually, or maybe it should?
                    })
                });
            }

        } catch (err) {
            console.error('Failed to submit test:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8"
            >
                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {passed ? <Trophy className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                </div>

                <h2 className="text-3xl font-bold mb-2">{passed ? 'Test Passed!' : 'Test Failed'}</h2>
                <p className="text-gray-500 mb-8">You scored {percentage}% ({score}/{questions.length})</p>

                {passed ? (
                    <p className="text-emerald-600 font-medium mb-8">
                        Congratulations! You've unlocked the next week of lessons.
                    </p>
                ) : (
                    <p className="text-red-500 font-medium mb-8">
                        You need 70% to pass. Please review your words and try again.
                    </p>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors"
                >
                    Back to Dashboard
                </button>
            </motion.div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Weekly Test</h1>
                    <p className="text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
                <div className="text-right">
                    <span className="text-sm font-bold text-brand-600">Score: {score}</span>
                </div>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-brand-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {currentQuestion.question}
                    </h2>

                    <div className="grid gap-4">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedOption === option;
                            const isCorrectAnswer = option === currentQuestion.correctAnswer;

                            let className = "p-4 rounded-xl border-2 text-left font-medium transition-all ";

                            if (selectedOption) {
                                if (isSelected) {
                                    className += isCorrect
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                        : "bg-red-50 border-red-500 text-red-700";
                                } else if (isCorrectAnswer) {
                                    className += "bg-emerald-50 border-emerald-500 text-emerald-700";
                                } else {
                                    className += "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
                                }
                            } else {
                                className += "bg-white border-gray-100 hover:border-brand-200 hover:bg-brand-50 text-gray-700";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={selectedOption !== null}
                                    className={className}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {selectedOption && isSelected && (
                                            isCorrect
                                                ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                : <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
