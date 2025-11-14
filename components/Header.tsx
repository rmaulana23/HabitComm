
import React, { useState, useRef, useEffect } from 'react';
import { AppLogo, SettingsIcon, AdminIcon } from './Icons';
import { UserProfile, Language } from '../types';
import LogoutModal from './LogoutModal';

interface HeaderProps {
    currentUser: UserProfile | null;
    onLogout: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    language: Language;
    onLanguageChange: (language: Language) => void;
    theme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
    onOpenSettings: () => void;
    onSelectCreateHabit: () => void;
    onSelectAdminView: () => void;
    onMarkRead: () => void;
    t: (key: string) => string;
}

const UserMenu: React.FC<{ user: UserProfile, onLogout: () => void, onMarkRead: () => void, t: (key: string) => string }> = ({ user, onLogout, onMarkRead, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const hasUnread = user.notifications.some(n => !n.isRead);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => { if(!isOpen) onMarkRead(); setIsOpen(!isOpen); }} className="relative">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full ring-2 ring-primary-200 hover:ring-4 transition-all" />
                {hasUnread && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-800" />
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl py-1 border border-border-color dark:border-neutral-700 animate-fade-in">
                    <div className="px-4 py-2 text-sm text-text-secondary dark:text-neutral-400 border-b border-border-color dark:border-neutral-700">
                        {t('signedInAs')} <br/>
                        <span className="font-bold text-text-primary dark:text-neutral-200">{user.name}</span>
                    </div>
                    <button
                        onClick={() => { setIsOpen(false); setShowLogoutModal(true); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                        {t('logOut')}
                    </button>
                </div>
            )}
            {showLogoutModal && (
                <LogoutModal 
                    onClose={() => setShowLogoutModal(false)} 
                    onConfirm={onLogout} 
                    t={t} 
                />
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onLoginClick, onRegisterClick, language, onLanguageChange, theme, onThemeChange, onOpenSettings, onSelectCreateHabit, onSelectAdminView, onMarkRead, t }) => (
    <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10 p-3 border-b border-border-color dark:border-neutral-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <AppLogo className="h-8 w-8 mr-2 hidden md:block" />
                <h1 className="text-xl font-bold text-text-primary dark:text-neutral-200">HabitComm</h1>
            </div>
            
            <div className="flex-1 hidden md:flex justify-center px-4">
                 {currentUser && (
                    <div className="w-full max-w-sm">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500">
                                <span>🔍</span>
                            </span>
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full bg-secondary dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 pl-10 pr-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300" />
                        </div>
                    </div>
                 )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                 {currentUser ? (
                    <>
                        {/* Mobile buttons */}
                        <div className="md:hidden flex items-center space-x-2">
                            <button onClick={onSelectCreateHabit} className="px-3 py-1.5 rounded-lg font-semibold bg-primary text-sm text-white hover:bg-primary-600 transition-colors">
                                {t('createHabit')}
                            </button>
                            {currentUser.isAdmin && (
                                <button onClick={onSelectAdminView} className="text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 p-1">
                                    <AdminIcon className="w-6 h-6" />
                                </button>
                            )}
                            <button onClick={onOpenSettings} className="text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 p-1">
                                <SettingsIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Desktop user menu & icons */}
                        <div className="hidden md:flex items-center space-x-4">
                             {currentUser.isAdmin && (
                                <button onClick={onSelectAdminView} className="text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 p-1" title={t('adminPanel')}>
                                    <AdminIcon className="w-6 h-6" />
                                </button>
                            )}
                             <button onClick={onOpenSettings} className="text-text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-primary-400 p-1" title={t('settings')}>
                                <SettingsIcon className="w-6 h-6" />
                            </button>
                            <UserMenu user={currentUser} onLogout={onLogout} onMarkRead={onMarkRead} t={t} />
                        </div>
                    </>
                 ) : (
                    <div className="flex items-center space-x-2">
                        <button
                             onClick={() => onLanguageChange(language === 'id' ? 'en' : 'id')}
                             className="px-3 py-2 rounded-lg font-semibold border border-gray-300 dark:border-neutral-700 text-sm text-text-primary dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                             {language === 'id' ? 'EN' : 'ID'}
                        </button>
                        <button onClick={onRegisterClick} className="hidden md:block px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-neutral-700 text-sm text-text-primary dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                            {t('signUpFree')}
                        </button>
                        <button onClick={onLoginClick} className="px-4 py-2 rounded-lg font-semibold bg-primary text-sm text-white hover:bg-primary-600 transition-colors">
                            {t('logIn')}
                        </button>
                    </div>
                 )}
            </div>
        </div>
    </header>
);

export default Header;
