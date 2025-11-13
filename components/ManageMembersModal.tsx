import React from 'react';
import { Habit, User } from '../types';

interface ManageMembersModalProps {
    habit: Habit;
    currentUser: User;
    onClose: () => void;
    onKickMember: (userId: string) => void;
    t: (key: string) => string;
}

const ManageMembersModal: React.FC<ManageMembersModalProps> = ({ habit, currentUser, onClose, onKickMember, t }) => {

    const handleKick = (userId: string) => {
        if (window.confirm(t('kickConfirmation'))) {
            onKickMember(userId);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-1">{t('manageMembers')}</h2>
                <p className="text-text-secondary dark:text-neutral-400 mb-6">{habit.name}</p>
                
                <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
                    {habit.members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                            <div className="flex items-center">
                                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                                <span className="font-semibold text-text-primary dark:text-neutral-300">{member.name}</span>
                            </div>
                            {member.id !== currentUser.id && (
                                <button
                                    onClick={() => handleKick(member.id)}
                                    className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-700 rounded-md hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-colors"
                                >
                                    {t('kickMember')}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-6 mt-4 border-t border-border-color dark:border-neutral-800">
                    <button onClick={onClose} className="px-6 py-2.5 text-base font-semibold rounded-lg bg-primary text-white hover:bg-primary-600">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageMembersModal;
