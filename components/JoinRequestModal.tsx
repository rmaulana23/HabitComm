import React from 'react';
import { Habit } from '../types';

interface JoinRequestModalProps {
    habit: Habit;
    onClose: () => void;
    onConfirm: () => void;
    t: (key: string) => string;
}

const JoinRequestModal: React.FC<JoinRequestModalProps> = ({ habit, onClose, onConfirm, t }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                
                <div className="mb-4 flex justify-center text-5xl">
                    🔒
                </div>

                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-2">{t('joinRequestTitle')}</h2>
                <h3 className="text-lg font-semibold text-primary dark:text-primary-400 mb-4">{habit.name}</h3>
                
                <p className="text-text-secondary dark:text-neutral-400 mb-6">
                    {t('joinRequestDesc')}
                </p>

                <div className="flex justify-end space-x-3 pt-4 border-t border-border-color dark:border-neutral-800">
                    <button 
                        onClick={onClose} 
                        className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300"
                    >
                        {t('cancel')}
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-600 transition-colors text-white font-bold shadow-md"
                    >
                        {t('sendRequest')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinRequestModal;