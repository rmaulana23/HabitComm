import React, { useState } from 'react';
import { StreakLog, Language } from '../types';

interface StreakDayModalProps {
    date: Date;
    log: StreakLog | null;
    onClose: () => void;
    onSave: (note: string) => void;
    t: (key: string) => string;
    language: Language;
}

const StreakDayModal: React.FC<StreakDayModalProps> = ({ date, log, onClose, onSave, t, language }) => {
    const [note, setNote] = useState(log?.note || '');
    const isViewMode = log !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim() && !isViewMode) {
            alert(t('fillLogPrompt'));
            return;
        }
        onSave(note);
    };
    
    const formattedDate = date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-2">{isViewMode ? t('viewLog') : t('addLog')}</h2>
                <p className="text-text-secondary dark:text-neutral-400 mb-6">{formattedDate}</p>
                
                <form onSubmit={handleSubmit}>
                    {isViewMode ? (
                        <p className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 min-h-[100px]">{log?.note}</p>
                    ) : (
                        <div>
                            <label htmlFor="log-note" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('progressNote')}</label>
                            <textarea
                                id="log-note"
                                placeholder={t('progressNotePlaceholder')}
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                required
                                className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 h-24 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>
                    )}
                     <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-neutral-800 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300">
                            {isViewMode ? t('close') : t('cancel')}
                        </button>
                        {!isViewMode && (
                            <button type="submit" className="px-8 py-2 rounded-lg bg-primary hover:bg-primary-600 transition-colors text-white font-bold shadow-md hover:shadow-lg">
                                {t('saveLog')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StreakDayModal;