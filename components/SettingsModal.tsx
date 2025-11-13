import React from 'react';
import { Language } from '../types';

interface SettingsModalProps {
    onClose: () => void;
    onLogout: () => void;
    currentLanguage: Language;
    onLanguageChange: (language: Language) => void;
    currentTheme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
    onOpenPrivacyPolicy: () => void;
    onOpenTermsConditions: () => void;
    onOpenAbout: () => void;
    t: (key: string) => string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    onClose,
    onLogout,
    currentLanguage,
    onLanguageChange,
    currentTheme,
    onThemeChange,
    onOpenPrivacyPolicy,
    onOpenTermsConditions,
    onOpenAbout,
    t
}) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-6">{t('settings')}</h2>
                
                <div className="space-y-6">
                    {/* Language Settings */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('language')}</label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onLanguageChange('id')}
                                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                    currentLanguage === 'id' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {t('indonesian')}
                            </button>
                            <button
                                onClick={() => onLanguageChange('en')}
                                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                    currentLanguage === 'en' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {t('english')}
                            </button>
                        </div>
                    </div>
                    
                    {/* Theme Settings */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('theme')}</label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onThemeChange('light')}
                                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                    currentTheme === 'light' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {t('light')}
                            </button>
                            <button
                                onClick={() => onThemeChange('dark')}
                                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                    currentTheme === 'dark' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {t('dark')}
                            </button>
                        </div>
                    </div>

                    {/* Legal Section */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('legal')}</label>
                        <div className="space-y-2">
                            <button onClick={() => { onOpenPrivacyPolicy(); onClose(); }} className="w-full text-left p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-primary dark:text-neutral-300 font-medium transition-colors">
                                {t('privacyPolicy')}
                            </button>
                             <button onClick={() => { onOpenTermsConditions(); onClose(); }} className="w-full text-left p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-primary dark:text-neutral-300 font-medium transition-colors">
                                {t('termsConditions')}
                            </button>
                             <button onClick={() => { onOpenAbout(); onClose(); }} className="w-full text-left p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-primary dark:text-neutral-300 font-medium transition-colors">
                                {t('aboutHabitComm')}
                            </button>
                             <a href="https://saweria.co/minekaze" target="_blank" rel="noopener noreferrer" className="w-full text-left p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-primary dark:text-neutral-300 font-medium transition-colors flex items-center">
                                <span className="mr-2">💖</span> {t('supportDeveloper')}
                            </a>
                             <a href="mailto:habitcomm.dev@gmail.com" className="w-full text-left p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-primary dark:text-neutral-300 font-medium transition-colors flex items-center">
                                <span className="mr-2">💡</span> {t('kritikSaran')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-end gap-2 pt-6 mt-auto border-t border-border-color dark:border-neutral-800">
                    <button
                        onClick={onLogout}
                        className="w-full py-2.5 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition-colors md:hidden"
                    >
                        {t('logOut')}
                    </button>
                    <button onClick={onClose} className="w-full md:w-auto px-6 py-2.5 text-base font-semibold rounded-lg bg-primary text-white hover:bg-primary-600">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;