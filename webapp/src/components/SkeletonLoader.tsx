import { motion } from 'framer-motion'

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', width, height, variant = 'rectangular' }: SkeletonProps) {
    const baseClasses = "bg-gray-200 animate-pulse";
    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-xl"
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ width, height }}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="space-y-2">
                    <Skeleton width={120} height={20} />
                    <Skeleton width={80} height={16} />
                </div>
            </div>
            <Skeleton width="100%" height={100} />
            <div className="flex justify-between items-center pt-4">
                <Skeleton width={100} height={40} />
                <Skeleton width={40} height={40} />
            </div>
        </div>
    );
}
