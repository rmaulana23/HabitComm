import React from 'react';
import { Habit, UserProfile, StreakLog } from '../types';
import { calculateCurrentStreak } from '../utils';

const Leaderboard: React.FC<{ habit: Habit; allUsers: UserProfile[], t: (key: string) => string; onViewProfile: (userId: string) => void; }> = ({ habit, allUsers, t, onViewProfile }) => {
    
    const leaderboardData = habit.members
        .map(member => {
            const userProfile = allUsers.find(u => u.id === member.id);
            const habitStreak = userProfile?.streaks.find(s => s.habitId === habit.id);
            const currentStreak = habitStreak ? calculateCurrentStreak(habitStreak.logs) : 0;
            return {
                user: member,
                streak: currentStreak,
            };
        })
        .filter(data => data.streak > 0)
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 10); // Show top 10

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 p-4">
            <h3 className="text-lg font-bold text-text-primary dark:text-neutral-200 mb-4 flex items-center">
                <span className="text-2xl mr-2 text-amber-500">🏆</span>
                {t('leaderboard')}
            </h3>
            {leaderboardData.length > 0 ? (
                <ul className="space-y-3">
                    {leaderboardData.map((data, index) => (
                        <li key={data.user.id} className="flex items-center">
                            <span className="font-bold text-lg text-text-secondary dark:text-neutral-400 w-6">{index + 1}.</span>
                            <button onClick={() => onViewProfile(data.user.id)} className="flex items-center flex-1 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/50 p-1 rounded-md">
                                <img src={data.user.avatar} alt={data.user.name} className="w-9 h-9 rounded-full mr-3" />
                                <span className="font-semibold text-text-primary dark:text-neutral-300 truncate">{data.user.name}</span>
                            </button>
                            <span className="font-bold text-primary dark:text-primary-400">{data.streak} {t('days')}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-text-secondary dark:text-neutral-500 text-center py-4">{t('noUpdatesYet')}</p>
            )}
        </div>
    );
};

export default Leaderboard;