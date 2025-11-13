import React, { useState, useMemo } from 'react';
import { getIconForTopic } from '../utils';

interface AddHabitModalProps {
    onClose: () => void;
    onSave: (data: { name: string, topic: string }) => void;
    t: (key: string) => string;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, onSave, t }) => {
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');

    const habitCategories = useMemo(() => [
        { name: t('cat_reading'), topic: 'Reading' },
        { name: t('cat_running'), topic: 'Running' },
        { name: t('cat_design'), topic: 'Design' },
        { name: t('cat_language'), topic: 'Language' },
        { name: t('cat_challenge_cat'), topic: 'Challenge' },
        { name: t('cat_wellbeing'), topic: 'Wellbeing' },
        { name: t('cat_career'), topic: 'Career' },
        { name: t('cat_lifestyle_cat'), topic: 'Lifestyle' },
        { name: t('cat_social_cat'), topic: 'Social' },
    ], [t]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !topic) {
            alert(t('fillHabitPrompt'));
            return;
        }
        onSave({ name, topic });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-6">{t('addNewHabitNote')}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="habit-name" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('habitName')}</label>
                        <input
                            id="habit-name"
                            type="text"
                            // FIX: Changed translation key to avoid conflict.
                            placeholder={t('addHabitNamePlaceholder')}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('category')}</label>
                        <div className="grid grid-cols-3 gap-3">
                             {habitCategories.map(item => {
                                const isSelected = topic === item.topic;
                                return (
                                    <button
                                        type="button"
                                        key={item.topic}
                                        onClick={() => setTopic(item.topic)}
                                        className={`p-3 rounded-lg border dark:border-neutral-700 text-left transition-all duration-200 flex flex-col items-center justify-center space-y-2 text-sm font-semibold ${
                                            isSelected
                                                ? 'bg-primary text-white ring-2 ring-primary-300 shadow-lg'
                                                : 'bg-white dark:bg-neutral-800 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:border-primary-300 dark:hover:border-primary-400'
                                        }`}
                                    >
                                        <span className={`text-2xl ${isSelected ? 'text-white' : 'text-text-secondary dark:text-neutral-400'}`}>{getIconForTopic(item.topic)}</span>
                                        <span>{item.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                     <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="px-8 py-2 rounded-lg bg-primary hover:bg-primary-600 transition-colors text-white font-bold shadow-md hover:shadow-lg">
                            {t('saveHabitNote')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHabitModal;