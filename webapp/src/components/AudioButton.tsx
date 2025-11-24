import { Volume2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { openaiClient } from '../services/openai';

interface AudioButtonProps {
    text: string;
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'ghost';
}

export function AudioButton({
    text,
    voice = 'alloy',
    size = 'md',
    variant = 'primary'
}: AudioButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = async () => {
        if (isPlaying) return;

        setIsPlaying(true);
        try {
            await openaiClient.playTextToSpeech(text, voice);
        } catch (error) {
            console.error('Failed to play audio:', error);
        } finally {
            setIsPlaying(false);
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24
    };

    const variantClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg',
        ghost: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
            disabled={isPlaying}
            className={`
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                rounded-full
                flex items-center justify-center
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95
            `}
            title="Listen to pronunciation"
        >
            {isPlaying ? (
                <Loader2 size={iconSizes[size]} className="animate-spin" />
            ) : (
                <Volume2 size={iconSizes[size]} />
            )}
        </motion.button>
    );
}
