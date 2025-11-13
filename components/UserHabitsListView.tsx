import React from 'react';
import { Habit } from '../types';
import { getIconForTopic } from '../utils';

interface UserHabitsListViewProps {
    allUserHabits: Habit[];
    type: 'group' | 'private';
    onSelectHabit: (id: string) => void;
    t: (key: string) => string;
}

const UserHabitsListView: React.FC<UserHabitsListViewProps> = ({ allUserHabits, type, onSelectHabit, t }) => {
    const habitsToDisplay = allUserHabits.filter(h => h.type === type);
    const title = type === 'group' ? t('grupHabitSaya') : t('privateHabitSaya');
    const noHabitsText = type === 'group' ? t('noGroupHabits') : t('noPrivateHabits');

    return (
        <div className="flex-1 p-6 overflow-y-auto animate-fade-in flex flex-col">
            <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200 mb-6">
                {title}
            </h2>

            {habitsToDisplay.length > 0 ? (
                <div className="space-y-3">
                    {habitsToDisplay.map(habit => (
                        <button
                            key={habit.id}
                            onClick={() => onSelectHabit(habit.id)}
                            className="w-full flex items-center p-4 rounded-xl transition-all duration-200 group bg-white dark:bg-neutral-900 shadow-sm border border-border-color dark:border-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:border-primary-200 dark:hover:border-primary-500/30"
                        >
                            <span className="w-8 h-8 mr-4 text-2xl flex items-center justify-center">{getIconForTopic(habit.topic)}</span>
                            <span className="flex-1 text-left font-bold text-text-primary dark:text-neutral-200">{habit.name}</span>
                            <span className="text-gray-400 dark:text-neutral-500 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors text-xl">›</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center text-text-secondary dark:text-neutral-400 py-20">
                    <p className="text-lg">{noHabitsText}</p>
                </div>
            )}
        </div>
    );
};

export default UserHabitsListView;