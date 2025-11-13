import React from 'react';
import { HabitStreak, StreakLog } from '../types';
import { calculateCurrentStreak, calculateLongestStreak, calculateCompletionRateLast30Days } from '../utils';

const CircularProgress: React.FC<{ percentage: number, color: string, size?: number, strokeWidth?: number }> = ({ percentage, color, size = 80, strokeWidth = 8 }) => {
    const radius = (size / 2) - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-gray-200 dark:text-neutral-800" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle
                    className={color}
                    strokeWidth={strokeWidth}
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
                <span className="text-xl font-bold text-text-primary dark:text-neutral-200">{percentage}%</span>
            </div>
        </div>
    );
}

const ActivityCalendar: React.FC<{ logs: StreakLog[], t: (key: string) => string }> = ({ logs, t }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const gridStartDate = new Date(today);
    gridStartDate.setDate(today.getDate() - 69);
    gridStartDate.setDate(gridStartDate.getDate() - gridStartDate.getDay());

    const gridDays = Array.from({ length: 70 }, (_, i) => {
        const day = new Date(gridStartDate);
        day.setDate(gridStartDate.getDate() + i);
        return day;
    });

    const loggedDayStrings = logs.map(l => new Date(l.date).toDateString());
    const dayLabels = t('dayLabels').split(',');

    return (
        <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 dark:text-neutral-500 font-bold mb-1">
                {dayLabels.map((label, index) => <div key={index}>{label}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {gridDays.map((day, index) => {
                    const isCompleted = loggedDayStrings.includes(day.toDateString());
                    const isFuture = day > today;
                    return (
                        <div
                            key={index}
                            title={day.toLocaleDateString()}
                            className={`w-full h-4 rounded-sm ${
                                isCompleted ? 'bg-primary-500' : isFuture ? 'bg-gray-100 dark:bg-neutral-800/50' : 'bg-gray-200 dark:bg-neutral-800'
                            }`}
                        />
                    )
                })}
            </div>
        </div>
    );
};

const StatCard: React.FC<{icon: string, label: string, value: string | number}> = ({icon, label, value}) => (
    <div className="bg-gray-50 dark:bg-neutral-800/50 p-3 rounded-lg flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
            <p className="font-bold text-xl text-text-primary dark:text-neutral-200">{value}</p>
            <p className="text-xs text-text-secondary dark:text-neutral-400">{label}</p>
        </div>
    </div>
);

interface HabitProgressProps {
    habitStreak: HabitStreak;
    t: (key: string) => string;
}

const HabitProgress: React.FC<HabitProgressProps> = ({ habitStreak, t }) => {
    const currentStreak = calculateCurrentStreak(habitStreak.logs);
    const longestStreak = calculateLongestStreak(habitStreak.logs);
    const completionRate = calculateCompletionRateLast30Days(habitStreak.logs);
    
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 p-4 space-y-4">
            <h3 className="text-lg font-bold text-text-primary dark:text-neutral-200 flex items-center">
                <span className="text-xl mr-2">📊</span>
                {t('yourProgress')}
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
                <StatCard icon="🔥" label={t('currentStreak')} value={currentStreak} />
                <StatCard icon="🏆" label={t('longestStreak')} value={longestStreak} />
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 dark:bg-neutral-800/50 p-3 rounded-lg">
                <CircularProgress percentage={completionRate} color="text-primary dark:text-primary-400" size={60} strokeWidth={6} />
                <div>
                     <p className="font-bold text-lg text-text-primary dark:text-neutral-200">{t('completionRate')}</p>
                     <p className="text-xs text-text-secondary dark:text-neutral-400">{t('last30days')}</p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-text-primary dark:text-neutral-300 mb-2">{t('activityCalendar')}</h4>
                <ActivityCalendar logs={habitStreak.logs} t={t} />
            </div>
        </div>
    );
};

export default HabitProgress;
