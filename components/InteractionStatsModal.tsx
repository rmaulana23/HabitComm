import React from 'react';
import { UserProfile } from '../types';

interface InteractionStatsModalProps {
    userProfile: UserProfile;
    onClose: () => void;
    t: (key: string) => string;
}

const CircularProgress: React.FC<{ percentage: number, color: string, size?: number }> = ({ percentage, color, size = 120 }) => {
    const radius = (size / 2) - 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-gray-200 dark:text-neutral-800" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle
                    className={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text-primary dark:text-neutral-200">{percentage}%</span>
            </div>
        </div>
    );
}

const StatItem: React.FC<{ icon: string; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg flex items-center space-x-4">
        <div className="text-primary dark:text-primary-400 text-2xl">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary dark:text-neutral-400">{label}</p>
            <p className="text-lg font-bold text-text-primary dark:text-neutral-200">{value}</p>
        </div>
    </div>
);

const InteractionStatsModal: React.FC<InteractionStatsModalProps> = ({ userProfile, onClose, t }) => {
    
    const totalConsistentDays = userProfile.streaks.reduce((total, streak) => total + streak.logs.length, 0);
    const totalHabitsJoined = userProfile.streaks.length;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-lg relative shadow-2xl flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-6 text-center">{t('interactionStatsTitle')}</h2>
                
                <div className="flex flex-col items-center mb-6">
                    <CircularProgress percentage={userProfile.checkInPercentage} color="text-primary dark:text-primary-400" size={140} />
                    <p className="font-bold text-text-primary dark:text-neutral-300 mt-2">{t('checkInConsistency')}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatItem icon="👏" label={t('totalCheersGiven')} value={userProfile.cheersGiven} />
                    <StatItem icon="🔥" label={t('totalPushesGiven')} value={userProfile.pushesGiven} />
                    <StatItem icon="🗓️" label={t('totalConsistentDays')} value={totalConsistentDays} />
                    <StatItem icon="➕" label={t('totalHabitsJoined')} value={totalHabitsJoined} />
                </div>

                <div className="flex justify-end pt-6 mt-auto border-t border-border-color dark:border-neutral-800">
                    <button onClick={onClose} className="px-6 py-2.5 text-base font-semibold rounded-lg bg-primary text-white hover:bg-primary-600">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InteractionStatsModal;