import React, { useState, useEffect } from 'react';
import { Mic, MicOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PronunciationCheckerProps {
    targetWord: string;
    onCorrect?: () => void;
}

// Add type definition for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export const PronunciationChecker: React.FC<PronunciationCheckerProps> = ({ targetWord, onCorrect }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'correct' | 'incorrect'>('idle');
    const [recognition, setRecognition] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = false;
                recognitionInstance.lang = 'en-US';
                recognitionInstance.interimResults = false;
                recognitionInstance.maxAlternatives = 1;

                recognitionInstance.onstart = () => {
                    setIsListening(true);
                    setStatus('listening');
                    setError('');
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                    if (status === 'listening') {
                        setStatus('idle');
                    }
                };

                recognitionInstance.onresult = (event: any) => {
                    const last = event.results.length - 1;
                    const text = event.results[last][0].transcript;
                    setTranscript(text);
                    checkPronunciation(text);
                };

                recognitionInstance.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setError('Could not hear you. Please try again.');
                    setIsListening(false);
                    setStatus('idle');
                };

                setRecognition(recognitionInstance);
            } else {
                setError('Speech recognition not supported in this browser.');
            }
        }
    }, [targetWord]);

    const checkPronunciation = (spokenText: string) => {
        setStatus('processing');

        // Simple normalization
        const normalizedSpoken = spokenText.toLowerCase().trim().replace(/[.,!?]/g, '');
        const normalizedTarget = targetWord.toLowerCase().trim().replace(/[.,!?]/g, '');

        if (normalizedSpoken === normalizedTarget) {
            setStatus('correct');
            if (onCorrect) onCorrect();
        } else {
            setStatus('incorrect');
        }
    };

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            setTranscript('');
            setStatus('idle');
            recognition.start();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pronunciation Check</h3>

            <div className="relative">
                <button
                    onClick={toggleListening}
                    disabled={!recognition}
                    className={`
                        w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg
                        ${status === 'listening'
                            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                            : status === 'correct'
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-brand-600 hover:bg-gray-50 border-2 border-brand-100'
                        }
                    `}
                >
                    {status === 'listening' ? (
                        <MicOff className="w-8 h-8" />
                    ) : status === 'correct' ? (
                        <CheckCircle className="w-8 h-8" />
                    ) : (
                        <Mic className="w-8 h-8" />
                    )}
                </button>

                {/* Ripple effect when listening */}
                {status === 'listening' && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
                )}
            </div>

            <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {status === 'listening' && (
                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-gray-500 font-medium"
                        >
                            Listening...
                        </motion.p>
                    )}

                    {status === 'processing' && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-2 text-gray-500"
                        >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Checking...</span>
                        </motion.div>
                    )}

                    {status === 'correct' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-green-600 font-bold flex items-center gap-2"
                        >
                            <span>Perfect! "{transcript}"</span>
                        </motion.div>
                    )}

                    {status === 'incorrect' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-red-500 font-medium text-center"
                        >
                            <p>Heard: "{transcript}"</p>
                            <p className="text-xs text-gray-400 mt-1">Try again!</p>
                        </motion.div>
                    )}

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
