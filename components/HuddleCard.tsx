import React from 'react';
import { Habit, User } from '../types';
import { getIconForTopic, getHighlightIcon } from '../utils';

interface HabitCardProps {
    habit: Habit;
    currentUser: User | null;
    onJoin: (habitId: string) => void;
    onClick: () => void;
    t: (key: string) => string;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, currentUser, onJoin, onClick, t }) => {
    const isMember = currentUser ? habit.members.some(m => m.id === currentUser.id) : false;
    const isFull = habit.members.length >= habit.memberLimit;

    if (habit.coverImage) {
        return (
            <div
                onClick={onClick}
                className="rounded-xl shadow-md border border-gray-200 dark:border-neutral-800 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between h-80 bg-cover bg-center"
                style={{ backgroundImage: `url(${habit.coverImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl"></div>
                <div className="relative p-5 flex flex-col justify-end h-full text-white">
                    <h3 className="font-bold text-xl">{habit.name}</h3>
                    <p className="text-sm line-clamp-2 mt-1 text-gray-200">{habit.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-white/20">
                         <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="font-bold text-base">{habit.members.length} {t('members')}</p>
                            </div>
                            <div className="flex -space-x-3">
                                {habit.members.slice(0, 3).map(member => (
                                    <img key={member.id} src={member.avatar} alt={member.name} title={member.name} className="w-9 h-9 rounded-full ring-2 ring-white/50"/>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isMember && !isFull) onJoin(habit.id);
                            }}
                            disabled={isMember || isFull}
                            className="w-full text-center py-2.5 bg-white/30 backdrop-blur-sm rounded-lg font-bold text-white hover:bg-white/40 transition-colors duration-200 disabled:bg-gray-500/50 disabled:text-gray-200 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                        >
                             {isMember
                                ? t('joined')
                                : isFull
                                ? `${t('full')} (${habit.members.length}/${habit.memberLimit})`
                                : `${t('join')} (${habit.members.length}/${habit.memberLimit})`}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Fallback card without cover image
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-800 p-5 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between h-80"
        >
            <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="text-3xl text-text-secondary dark:text-neutral-400">
                        <span className="text-4xl">{getIconForTopic(habit.topic)}</span>
                    </div>
                    <h3 className="font-bold text-lg text-text-primary dark:text-neutral-200">{habit.name}</h3>
                </div>
                <p className="text-sm text-text-secondary dark:text-neutral-400 line-clamp-2">{habit.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="font-bold text-base text-text-primary dark:text-neutral-300">{habit.members.length} {t('members')}</p>
                        {habit.highlight && (
                            <div className="flex items-center space-x-1.5 text-xs font-medium text-text-secondary dark:text-neutral-400 mt-0.5">
                                <span className="text-sm">{getHighlightIcon(habit.highlightIcon)}</span>
                                <span>{habit.highlight}</span>
                            </div>
                        )}
                    </div>
                     <div className="flex -space-x-3">
                        {habit.members.slice(0, 3).map(member => (
                            <img key={member.id} src={member.avatar} alt={member.name} title={member.name} className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-neutral-900"/>
                        ))}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isMember && !isFull) onJoin(habit.id);
                    }}
                    disabled={isMember || isFull}
                    className="w-full text-center py-2.5 bg-primary rounded-lg font-bold text-white hover:bg-primary-600 transition-colors duration-200 disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                    {isMember
                        ? t('joined')
                        : isFull
                        ? `${t('full')} (${habit.members.length}/${habit.memberLimit})`
                        : `${t('join')} (${habit.members.length}/${habit.memberLimit})`}
                </button>
            </div>
        </div>
    );
}

export default HabitCard;