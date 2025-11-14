import React from 'react';
import { Habit, User } from '../types';
import { getIconForTopic } from '../utils';

interface HabitDetailModalProps {
    habit: Habit;
    currentUser: User | null;
    onClose: () => void;
    onJoin: (habitId: string) => void;
    isMember: boolean;
    onViewProfile: (userId: string) => void;
    t: (key: string) => string;
}

const HabitDetailModal: React.FC<HabitDetailModalProps> = ({ habit, currentUser, onClose, onJoin, isMember, onViewProfile, t }) => {
    const isFull = habit.members.length >= habit.memberLimit;
    const isPending = currentUser ? (habit.pendingMembers || []).includes(currentUser.id) : false;

    const handleViewProfileClick = (userId: string) => {
        onClose(); // Close this modal first
        onViewProfile(userId);
    };

    const getButtonText = () => {
        if (isMember) return t('joined');
        if (isPending) return t('requested');
        if (isFull) return t('full');
        return t('joinHabit');
    };

    const isDisabled = isMember || isFull || isPending;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-lg relative shadow-2xl flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mr-4 text-primary dark:text-primary-300">
                        <span className="text-3xl">{getIconForTopic(habit.topic)}</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200">{habit.name}</h2>
                        <p className="text-text-secondary dark:text-neutral-400">{habit.topic}</p>
                    </div>
                </div>

                <div className="overflow-y-auto pr-2 space-y-5 flex-grow">
                    <div>
                        <h3 className="font-semibold text-text-primary dark:text-neutral-300 mb-1">{t('description')}</h3>
                        <p className="text-text-secondary dark:text-neutral-400">{habit.description}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-text-primary dark:text-neutral-300 mb-1">{t('rules')}</h3>
                        <p className="text-text-secondary dark:text-neutral-400 whitespace-pre-wrap">{habit.rules || 'Saling mendukung dan konsisten!'}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-text-primary dark:text-neutral-300 mb-1">{habit.members.length} / {habit.memberLimit} {t('members')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {habit.members.slice(0, 50).map(member => ( // Show max 50 avatars for performance
                                <button key={member.id} onClick={() => handleViewProfileClick(member.id)}>
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        title={member.name}
                                        className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-neutral-900 hover:ring-primary-400 transition-all"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 mt-auto border-t border-border-color dark:border-neutral-800">
                    <button 
                        onClick={() => onJoin(habit.id)}
                        disabled={isDisabled}
                        className={`px-6 py-2.5 text-base font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed
                                   ${isPending 
                                        ? 'bg-amber-500 text-white hover:bg-amber-600' 
                                        : 'bg-primary text-white hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:text-gray-500'
                                   }`}
                    >
                        {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HabitDetailModal;