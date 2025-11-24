import { Flame, Target, Zap, Award } from 'lucide-react';

interface AchievementBadgesProps {
    progress: any; // Using any to avoid complex type duplication, but ideally should be UserProgress
}

export function AchievementBadges({ progress }: AchievementBadgesProps) {
    const badges = [
        {
            id: 1,
            name: '7 Day Streak',
            description: 'Study for 7 days in a row',
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-100',
            unlocked: (progress?.streak || 0) >= 7,
            progress: `${progress?.streak || 0}/7`
        },
        {
            id: 2,
            name: 'First 100 Words',
            description: 'Learn your first 100 words',
            icon: Target,
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            unlocked: (progress?.totalWordsLearned || 0) >= 100,
            progress: `${progress?.totalWordsLearned || 0}/100`
        },
        {
            id: 3,
            name: 'Grammar Master',
            description: 'Complete all grammar lessons',
            icon: Award,
            color: 'text-purple-500',
            bg: 'bg-purple-100',
            unlocked: false, // Placeholder logic
            progress: '0/10'
        },
        {
            id: 4,
            name: 'Early Bird',
            description: 'Complete a lesson before 8 AM',
            icon: Zap,
            color: 'text-yellow-500',
            bg: 'bg-yellow-100',
            unlocked: false, // Placeholder logic
            progress: '-'
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
                <div
                    key={badge.id}
                    className={`p-4 rounded-xl border-2 transition-all ${badge.unlocked
                        ? 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                        : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                        }`}
                >
                    <div className={`w-10 h-10 ${badge.bg} rounded-full flex items-center justify-center mb-3`}>
                        <badge.icon className={`w-5 h-5 ${badge.color}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{badge.description}</p>
                    {!badge.unlocked && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                            <p className="text-[10px] text-gray-400 mt-1 text-right">{badge.progress}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
