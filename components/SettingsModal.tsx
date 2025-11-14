






import React from 'react';
import { Language, UserProfile, UserPreferences } from '../types';
import LogoutButton from './LogoutButton';

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
    currentUser: UserProfile;
    onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
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
    currentUser,
    onUpdatePreferences,
    t
}) => {
    // Safely access preferences with defaults
    const preferences = currentUser.preferences || { showStats: true, showBadges: true, showDailyTips: true, showTools: true };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-6">{t('settings')}</h2>
                
                <div className="space-y-6 overflow-y-auto pr-2">
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
                                    currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {t('dark')}
                            </button>
                        </div>
                    </div>

                    {/* Profile Display Settings */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('profileDisplay')}</label>
                        <div className="space-y-2 bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg border border-gray-200 dark:border-neutral-700">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-text-primary dark:text-neutral-300">{t('showStats')}</span>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.showStats} 
                                    onChange={(e) => onUpdatePreferences({ showStats: e.target.checked })}
                                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" 
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-text-primary dark:text-neutral-300">{t('showBadges')}</span>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.showBadges} 
                                    onChange={(e) => onUpdatePreferences({ showBadges: e.target.checked })}
                                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" 
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-text-primary dark:text-neutral-300">{t('showTools')}</span>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.showTools ?? true} 
                                    onChange={(e) => onUpdatePreferences({ showTools: e.target.checked })}
                                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" 
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-text-primary dark:text-neutral-300">{t('showDailyTips')}</span>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.showDailyTips} 
                                    onChange={(e) => onUpdatePreferences({ showDailyTips: e.target.checked })}
                                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('legal')}</label>
                        <div className="space-y-2">
                            <button onClick={onOpenPrivacyPolicy} className="w-full text-left text-sm text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 transition-colors py-1">
                                {t('privacyPolicy')}
                            </button>
                            <button onClick={onOpenTermsConditions} className="w-full text-left text-sm text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 transition-colors py-1">
                                {t('termsConditions')}
                            </button>
                            <button onClick={onOpenAbout} className="w-full text-left text-sm text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 transition-colors py-1">
                                {t('aboutHabitComm')}
                            </button>
                        </div>
                    </div>

                    {/* Other Links */}
                    <div className="pt-2 border-t border-gray-200 dark:border-neutral-800">
                         <a href="#" className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 mb-2">
                            {t('supportDeveloper')}
                        </a>
                        <a href="#" className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400">
                            {t('kritikSaran')}
                        </a>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-neutral-800">
                    <div className="md:hidden">
                        <LogoutButton
                            onLogout={onLogout}
                            t={t}
                            className="w-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold py-3 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                        >
                            {t('logOut')}
                        </LogoutButton>
                    </div>
                    <p className="text-center text-xs text-text-secondary dark:text-neutral-500 mt-4">{t('copyright')}</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;