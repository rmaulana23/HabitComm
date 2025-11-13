import React from 'react';
import { Habit, UserProfile, Language } from '../types';
import { getIconForTopic } from '../utils';
import { EventIcon, VerifiedIcon } from './Icons';

interface SidebarProps {
    habits: Habit[];
    selectedHabitId: string | null;
    currentView: 'habit' | 'profile' | 'explore' | 'createHabit' | 'events' | 'messagingList' | 'admin' | 'comingSoon' | 'groupHabits' | 'privateHabits';
    currentUser: UserProfile | null;
    onOpenSettings: () => void;
    onOpenEditProfile: () => void;
    t: (key: string) => string;
    language: Language;
}

const ProfileHeader: React.FC<{ user: UserProfile, onOpenEditProfile: () => void, t: (key: string) => string, language: Language }> = ({ user, onOpenEditProfile, t, language }) => (
    <div className="text-center p-4 border-b border-border-color dark:border-neutral-800">
        <a href={`/#/profile/${user.id}`} title={user.name} className="relative group w-20 h-20 mx-auto block">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto ring-2 ring-primary-200 group-hover:ring-4 transition-all" />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5">
              <VerifiedIcon className="w-5 h-5 text-blue-500" />
            </div>
        </a>
        <div className="mt-2 flex items-center justify-center space-x-1">
            <h2 className="text-lg font-bold text-text-primary dark:text-neutral-200">{user.name}</h2>
            <button onClick={onOpenEditProfile} className="text-gray-400 hover:text-primary transition-colors">
                <span>✏️</span>
            </button>
        </div>
        <p className="text-xs text-text-secondary dark:text-neutral-400">{t('joinedSince')} {user.memberSince.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long' })}</p>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ 
    habits, 
    selectedHabitId, 
    currentView, 
    currentUser, 
    onOpenSettings,
    onOpenEditProfile,
    t,
    language
}) => {
    const allUserHabits = currentUser ? habits.filter(h => h.members.some(m => m.id === currentUser.id)) : [];
    const groupHabits = allUserHabits.filter(h => h.type === 'group');
    const soloHabits = allUserHabits.filter(h => h.type === 'private');
    
    return (
        <aside className="hidden md:flex w-64 bg-white dark:bg-neutral-900 flex-col shrink-0 border-r border-border-color dark:border-neutral-800">
            {currentUser && <ProfileHeader user={currentUser} onOpenEditProfile={onOpenEditProfile} t={t} language={language} />}
            
            <div className="p-4 space-y-2">
                <a 
                    href="/#/createHabit" 
                    className="w-full flex items-center justify-center text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-primary hover:bg-primary-600 shadow-sm hover:shadow-md"
                >
                    <span className="mr-2">➕</span>
                    {t('createHabit')}
                </a>

                 <a href="/#/explore" title={t('exploreHabits')} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'explore' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
                    <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">🧭</span>
                    {t('exploreHabits')}
                </a>
                <a href="/#/events" title={t('events')} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'events' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
                    <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">🗓️</span>
                    {t('events')}
                </a>
                <a href="/#/messagingList" title={t('messages')} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'messagingList' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
                    <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">💬</span>
                    {t('messages')}
                </a>
                 {currentUser?.isAdmin && (
                    <a href="/#/admin" title={t('adminPanel')} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'admin' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
                        <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">🛡️</span>
                        {t('adminPanel')}
                    </a>
                )}
            </div>

            <div className="flex-grow p-4 space-y-1 pt-2 border-t dark:border-neutral-800 overflow-y-auto min-h-0">
                {currentUser && (
                    <>
                        <div className="mb-4">
                            <h3 className="px-2.5 pt-2 pb-1 text-sm font-semibold text-text-secondary dark:text-neutral-400">{t('grupHabitSaya')}</h3>
                            {groupHabits.length > 0 ? (
                                groupHabits.map(habit => (
                                    <a
                                        href={`/#/habit/${habit.id}`}
                                        key={habit.id}
                                        title={habit.name}
                                        className={`flex items-center p-2.5 rounded-lg transition-all duration-200 group ${selectedHabitId === habit.id ? 'bg-primary-50 dark:bg-primary-500/10 font-bold text-primary dark:text-primary-300' : 'hover:bg-primary-50 dark:hover:bg-neutral-800 text-text-primary dark:text-neutral-300'}`}
                                    >
                                        <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">{getIconForTopic(habit.topic)}</span>
                                        <span className="flex-1 truncate">{habit.name}</span>
                                    </a>
                                ))
                            ) : (
                                <p className="px-2.5 text-xs text-text-secondary dark:text-neutral-500">{t('noGroupHabits')}</p>
                            )}
                        </div>
                        <div>
                            <h3 className="px-2.5 pt-2 pb-1 text-sm font-semibold text-text-secondary dark:text-neutral-400">{t('privateHabitSaya')}</h3>
                            {soloHabits.length > 0 ? (
                                soloHabits.map(habit => (
                                    <a
                                        href={`/#/habit/${habit.id}`}
                                        key={habit.id}
                                        title={habit.name}
                                        className={`flex items-center p-2.5 rounded-lg transition-all duration-200 group ${selectedHabitId === habit.id ? 'bg-primary-50 dark:bg-primary-500/10 font-bold text-primary dark:text-primary-300' : 'hover:bg-primary-50 dark:hover:bg-neutral-800 text-text-primary dark:text-neutral-300'}`}
                                    >
                                        <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">{getIconForTopic(habit.topic)}</span>
                                        <span className="flex-1 truncate">{habit.name}</span>
                                    </a>
                                ))
                             ) : (
                                <p className="px-2.5 text-xs text-text-secondary dark:text-neutral-500">{t('noPrivateHabits')}</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {currentUser && (
                <div className="space-y-1 p-4 border-t border-border-color dark:border-neutral-800">
                    <button onClick={onOpenSettings} className="w-full flex items-center p-2.5 rounded-lg font-medium text-text-primary dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800">
                        <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">⚙️</span>
                        {t('settings')}
                    </button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;