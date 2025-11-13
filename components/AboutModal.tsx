import React from 'react';

interface AboutModalProps {
    onClose: () => void;
    t: (key: string) => string;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose, t }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-2xl relative shadow-2xl flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-4">{t('aboutHabitCommTitle')}</h2>
                
                <div className="overflow-y-auto pr-2 space-y-4 text-text-secondary dark:text-neutral-400">
                    <p>{t('aboutHabitCommContent')}</p>
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

export default AboutModal;