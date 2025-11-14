
import React from 'react';
import { Habit, UserProfile, Language } from '../types';
import { getIconForTopic } from '../utils';
import { EventIcon, VerifiedIcon } from './Icons';

interface SidebarProps {
    habits: Habit[];
    selectedHabitId: string | null;
    onSelectHabit: (id: string) => void;
    onSelectCreateHabit: () => void;
    currentView: 'habit' | 'profile' | 'explore' | 'createHabit' | 'events' | 'messagingList' | 'admin' | 'comingSoon' | 'groupHabits' | 'privateHabits';
    currentUser: UserProfile | null;
    onSelectExplore: () => void;
    onViewHabitDetail: (habit: Habit) => void;
    onViewProfile: (userId: string) => void;
    onOpenSettings: () => void;
    onOpenEditProfile: () => void;
    onSelectEvents: () => void;
    onSelectMessagingList: () => void;
    onSelectAdminView: () => void;
    onMarkRead: () => void;
    t: (key: string) => string;
    language: Language;
}

const ProfileHeader: React.FC<{ user: UserProfile, onViewProfile: (userId: string) => void, onOpenEditProfile: () => void, onMarkRead: () => void, t: (key: string) => string, language: Language }> = ({ user, onViewProfile, onOpenEditProfile, onMarkRead, t, language }) => {
    const hasUnread = user.notifications.some(n => !n.isRead);
    return (
        <div className="text-center p-4 border-b border-border-color dark:border-neutral-800">
            <button onClick={() => { onViewProfile(user.id); onMarkRead(); }} className="relative group w-20 h-20 mx-auto">
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto ring-2 ring-primary-200 group-hover:ring-4 transition-all" />
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5">
                  <VerifiedIcon className="w-5 h-5 text-blue-500" />
                </div>
                {hasUnread && (
                    <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900 z-10" />
                )}
            </button>
            <div className="mt-2 flex items-center justify-center space-x-1">
                <h2 className="text-lg font-bold text-text-primary dark:text-neutral-200">{user.name}</h2>
                <button onClick={onOpenEditProfile} className="text-gray-400 hover:text-primary transition-colors">
                    <span>✏️</span>
                </button>
            </div>
            <p className="text-xs text-text-secondary dark:text-neutral-400 mt-1 italic px-2 truncate">"{user.motto}"</p>
            <p className="text-xs text-text-secondary dark:text-neutral-400">{t('joinedSince')} {user.memberSince.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long' })}</p>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ 
    habits, 
    selectedHabitId, 
    onSelectHabit, 
    onSelectCreateHabit, 
    currentView, 
    currentUser, 
    onSelectExplore,
    onViewHabitDetail,
    onViewProfile,
    onOpenSettings,
    onOpenEditProfile,
    onSelectEvents,
    onSelectMessagingList,
    onSelectAdminView,
    onMarkRead,
    t,
    language
}) => {
    const allUserHabits = currentUser ? habits.filter(h => h.members.some(m => m.id === currentUser.id)) : [];
    const groupHabits = allUserHabits.filter(h => h.type === 'group');
    const soloHabits = allUserHabits.filter(h => h.type === 'private');
    
    return (
        <aside className="hidden md:flex w-64 bg-white dark:bg-neutral-900 flex-col shrink-0 border-r border-border-color dark:border-neutral-800">
            {currentUser && <ProfileHeader user={currentUser} onViewProfile={onViewProfile} onOpenEditProfile={onOpenEditProfile} onMarkRead={onMarkRead} t={t} language={language} />}
            
            <div className="p-4 space-y-2">
                <button 
                    onClick={onSelectCreateHabit} 
                    className="w-full flex items-center justify-center text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-primary hover:bg-primary-600 shadow-sm hover:shadow-md"
                >
                    <span className="mr-2">➕</span>
                    {t('createHabit')}
                </button>

                 <a href="#" onClick={(e) => { e.preventDefault(); onSelectExplore(); }} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'explore' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
                    <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">🧭</span>
                    {t('exploreHabits')}
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); onSelectEvents(); }} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'events' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
                    <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">🗓️</span>
                    {t('events')}
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); onSelectMessagingList(); }} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'messagingList' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
                    <span className="w-5 h-5 mr-3 text-lg flex items-center justify-center">💬</span>
                    {t('messages')}
                </a>
                 {currentUser?.isAdmin && (
                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectAdminView(); }} className={`flex items-center p-2.5 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 ${currentView === 'admin' ? 'text-primary dark:text-primary-400' : 'text-text-primary dark:text-neutral-300'}`}>
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
                                        href="#"
                                        key={habit.id}
                                        onClick={(e) => { e.preventDefault(); onSelectHabit(habit.id); }}
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
                                        href="#"
                                        key={habit.id}
                                        onClick={(e) => { e.preventDefault(); onSelectHabit(habit.id); }}
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
        </aside>
    );
};

export default Sidebar;
