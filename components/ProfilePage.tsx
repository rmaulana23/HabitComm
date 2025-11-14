
import React, { useState, useEffect } from 'react';
import { UserProfile, Badge, Habit, HabitStreak, StreakLog, User, Language } from '../types';
import { getIconForTopic, parseContent } from '../utils';
import NotificationsFeed from './NotificationsFeed';
import { generateHealthTip } from '../services/geminiService';
import BMICalculatorCard from './BMICalculatorCard';

interface ProfilePageProps {
    profileToView: UserProfile;
    currentUserProfile: UserProfile;
    allHabits: Habit[];
    onAddHabit: () => void;
    onDayClick: (streakId: string, date: Date) => void;
    onOpenMessage: (user: User) => void;
    onSelectHabit: (habitId: string) => void;
    onViewProfile: (userId: string) => void;
    onOpenEditProfile?: () => void;
    t: (key: string) => string;
    language: Language;
}

const CircularProgress: React.FC<{ percentage: number, color: string, size?: number }> = ({ percentage, color, size = 120 }) => {
    const radius = (size / 2) - 4; // Reduced stroke width from 8 to 4 for smaller size
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-gray-200 dark:text-neutral-800" strokeWidth="4" stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle
                    className={color}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-text-primary dark:text-neutral-200">{percentage}%</span>
            </div>
        </div>
    );
}

const StreakCalendar: React.FC<{
    logs: StreakLog[] | null;
    color: string;
    onDayClick: (date: Date) => void;
    t: (key: string) => string;
    language: Language;
}> = ({ logs, color, onDayClick, t, language }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const changeMonth = (amount: number) => {
        setViewDate(current => {
            const newDate = new Date(current);
            newDate.setDate(1); // Avoids issues with different month lengths
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    if (!logs) {
        return (
            <div className="p-2 bg-white dark:bg-neutral-900 rounded-b-lg flex flex-col items-center justify-center min-h-[250px]">
                <span className="text-3xl text-gray-300 dark:text-neutral-600">🔒</span>
                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 text-center">{t('lockedHabit')}</p>
            </div>
        );
    }
    
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthName = viewDate.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
    const dayLabels = t('dayLabels').split(',');

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const loggedDays = new Set(logs.map(l => new Date(l.date).toDateString()));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const calendarCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
        <div key={`pad-${i}`} className="w-8 h-8"></div>
    ));

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        
        const isCompleted = loggedDays.has(date.toDateString());
        const isToday = date.getTime() === today.getTime();
        const isFuture = date > today;
        const canClick = !isFuture;

        let dayClasses = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150';

        if (canClick) {
            dayClasses += ' cursor-pointer hover:scale-110';
        } else {
            dayClasses += ' cursor-default';
        }

        if (isToday) {
            dayClasses += ' ring-2 ring-primary dark:ring-primary-400';
        }

        if (isCompleted) {
            dayClasses += ` ${color} text-white font-bold`;
        } else if (isFuture) {
            dayClasses += ' text-gray-300 dark:text-neutral-600';
        } else {
            dayClasses += ' bg-gray-100 dark:bg-neutral-800 text-text-primary dark:text-neutral-300';
        }

        calendarCells.push(
            <button
                key={day}
                onClick={() => canClick && onDayClick(date)}
                disabled={!canClick}
                className={dayClasses}
            >
                {day}
            </button>
        );
    }

    return (
        <div className="p-3 bg-white dark:bg-neutral-900 rounded-b-lg">
            <div className="flex items-center justify-between mb-2 px-1">
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-text-secondary dark:text-neutral-400"
                    aria-label="Previous month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h4 className="font-bold text-sm text-text-primary dark:text-neutral-200">{monthName}</h4>
                <button
                    onClick={() => changeMonth(1)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-text-secondary dark:text-neutral-400"
                    aria-label="Next month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 dark:text-neutral-500 font-bold mb-2">
                {dayLabels.map((label, index) => <div key={index}>{label}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1 place-items-center">
                {calendarCells}
            </div>
        </div>
    );
};


const ProgressCard: React.FC<{ userProfile: UserProfile, t: (key: string) => string }> = ({ userProfile, t }) => {
    const topStreaks = [...userProfile.streaks]
        .sort((a, b) => b.logs.length - a.logs.length)
        .slice(0, 2);

    const totalConsistentDays = userProfile.streaks.reduce((total, streak) => total + streak.logs.length, 0);
    
    return (
        <div className="bg-primary p-6 rounded-xl text-white shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-6xl font-bold">{userProfile.totalDaysActive}</p>
                    <p className="font-semibold">{t('totalActiveDays')}</p>
                </div>
                <div className="flex space-x-2">
                    {topStreaks.map(streak =>
                        <span key={streak.id} className="text-3xl opacity-80">{getIconForTopic(streak.topic)}</span>
                    )}
                </div>
            </div>
            <div className="flex justify-end items-center mt-6 text-sm font-semibold space-x-4">
                <span><span className="font-bold">{totalConsistentDays}</span> {t('totalConsistentDays')}</span>
                <span><span className="font-bold">{userProfile.cheersGiven}</span> {t('cheers')}</span>
                <span><span className="font-bold">{userProfile.pushesGiven}</span> {t('pushes')}</span>
            </div>
        </div>
    );
};

const InteractionStats: React.FC<{ userProfile: UserProfile, t: (key: string) => string }> = ({ userProfile, t }) => {
    const getConsistencyDescription = (percentage: number) => {
        if (percentage < 40) {
            return t('consistencyDescLow');
        }
        if (percentage < 75) {
            return t('consistencyDescMid');
        }
        return t('consistencyDescHigh');
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 p-4">
            <h3 className="text-sm font-bold text-text-secondary dark:text-neutral-400 mb-3 uppercase tracking-wider">{t('interactionStats')}</h3>
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <CircularProgress percentage={userProfile.checkInPercentage} color="text-primary dark:text-primary-400" size={60} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-text-primary dark:text-neutral-200">{t('checkInConsistency')}</p>
                    <p className="text-xs text-text-secondary dark:text-neutral-400 mt-1 leading-relaxed">
                        {getConsistencyDescription(userProfile.checkInPercentage)}
                    </p>
                </div>
            </div>
        </div>
    );
};

const BadgesAndAchievements: React.FC<{ userProfile: UserProfile, t: (key: string) => string }> = ({ userProfile, t }) => {
    const totalConsistentDays = userProfile.streaks.reduce((total, streak) => total + streak.logs.length, 0);

    const achievements = [
        { days: 30, name: t('badge30day') },
        { days: 120, name: t('badge120day') },
        { days: 180, name: t('badge180day') },
        { days: 365, name: t('badge365day') },
    ];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 p-4">
            <h3 className="text-lg font-bold text-text-primary dark:text-neutral-200 mb-4">{t('badgesAndAchievements')}</h3>
            <div className="grid grid-cols-4 gap-3">
                {achievements.map((ach, index) => {
                    const isUnlocked = totalConsistentDays >= ach.days;
                    return (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors text-3xl ${
                                isUnlocked 
                                    ? 'bg-amber-400 text-white shadow-lg' 
                                    : 'bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600'
                            }`}>
                                🏅
                            </div>
                            <p className={`mt-2 text-xs font-semibold ${
                                isUnlocked 
                                    ? 'text-text-primary dark:text-neutral-300' 
                                    : 'text-text-secondary dark:text-neutral-500'
                            }`}>{ach.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const DailyTipsCard: React.FC<{ t: (key: string) => string, language: Language }> = ({ t, language }) => {
    const [tip, setTip] = useState(t('loadingTip'));

    useEffect(() => {
        const fetchTip = async () => {
            const generatedTip = await generateHealthTip(language);
            setTip(generatedTip);
        };
        fetchTip();
    }, [language, t]);

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800 p-4 flex items-start space-x-3">
            <div className="text-2xl flex-shrink-0">💡</div>
            <div>
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">{t('dailyTip')}</h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed italic">
                    "{tip}"
                </p>
            </div>
        </div>
    );
};

const MobileProfileHeader: React.FC<{ user: UserProfile, isOwnProfile: boolean, onEdit?: () => void, t: (key: string) => string }> = ({ user, isOwnProfile, onEdit, t }) => (
    <div className="md:hidden flex flex-col items-center mb-6 animate-fade-in">
        <div className="relative">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full ring-4 ring-primary-100 dark:ring-primary-900 object-cover" />
            {isOwnProfile && onEdit && (
                <button onClick={onEdit} className="absolute bottom-0 right-0 bg-white dark:bg-neutral-800 p-1.5 rounded-full shadow-md border border-gray-200 dark:border-neutral-700 text-sm">
                    ✏️
                </button>
            )}
        </div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mt-3">{user.name}</h1>
        <p className="text-sm text-text-secondary dark:text-neutral-400 italic">"{user.motto}"</p>
    </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ profileToView, currentUserProfile, allHabits, onAddHabit, onDayClick, onOpenMessage, onSelectHabit, onViewProfile, onOpenEditProfile, t, language }) => {
    
    const isOwnProfile = profileToView.id === currentUserProfile.id;

    const streakColors = [
      { bg: 'bg-gradient-to-r from-grad-pink-start to-grad-pink-end', text: 'text-white', calendar: 'bg-pink-400' },
      { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-800 dark:text-green-300', calendar: 'bg-green-400' },
      { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-800 dark:text-blue-300', calendar: 'bg-blue-400' },
    ];

    const canViewStreakLogs = (streak: HabitStreak): boolean => {
        if (isOwnProfile) return true;
        
        // Find the corresponding full habit object
        const habit = allHabits.find(h => h.id === streak.habitId);
        
        // If it's a private habit (no corresponding group habit), it's locked
        if (!habit || habit.type === 'private') return false; 
        
        // Check if the current viewing user is also a member of this group habit
        return habit.members.some(m => m.id === currentUserProfile.id);
    };

    // Determine display preferences, defaulting to true if not set
    const showStats = profileToView.preferences?.showStats ?? true;
    const showBadges = profileToView.preferences?.showBadges ?? true;
    const showDailyTips = profileToView.preferences?.showDailyTips ?? true;
    const showTools = profileToView.preferences?.showTools ?? true;

    return (
        <div className="flex-1 p-6 overflow-y-auto animate-fade-in">
            <MobileProfileHeader user={profileToView} isOwnProfile={isOwnProfile} onEdit={onOpenEditProfile} t={t} />

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-4 hidden md:block">{isOwnProfile ? t('myProgress') : profileToView.name}</h2>
                        <ProgressCard userProfile={profileToView} t={t} />
                        {!isOwnProfile && (
                            <div className="mt-4">
                                <button onClick={() => onOpenMessage(profileToView)} className="w-full flex items-center justify-center text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-primary/90 hover:bg-primary shadow-sm hover:shadow-md">
                                    <span className="mr-2">✉️</span>
                                    {t('message')} {profileToView.name}
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200">{t('habitStreaks')}</h2>
                            {isOwnProfile && (
                                <button onClick={onAddHabit} className="flex items-center text-sm font-bold bg-primary-100 dark:bg-primary-500/20 text-primary dark:text-primary-300 px-4 py-2 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-500/30 transition">
                                    <span className="mr-2">➕</span>
                                    {t('addHabitNote')}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileToView.streaks.map((streak, index) => {
                                const canView = canViewStreakLogs(streak);
                                return (
                                <div key={streak.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow-md border border-border-color dark:border-neutral-800 overflow-hidden">
                                    <div className={`p-2 flex items-center justify-between ${streakColors[index % streakColors.length].bg} ${streakColors[index % streakColors.length].text}`}>
                                        <span className="font-bold text-sm truncate">{streak.name.toUpperCase()}</span>
                                        <span className="text-xl">{getIconForTopic(streak.topic)}</span>
                                    </div>
                                    <StreakCalendar 
                                        logs={canView ? streak.logs : null} 
                                        color={streakColors[index % streakColors.length].calendar} 
                                        onDayClick={(date) => isOwnProfile && onDayClick(streak.id, date)} 
                                        t={t}
                                        language={language}
                                    />
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {isOwnProfile && (
                        <NotificationsFeed 
                            notifications={profileToView.notifications} 
                            t={t}
                            onOpenMessage={onOpenMessage}
                            onSelectHabit={onSelectHabit}
                            onViewProfile={onViewProfile}
                         />
                    )}
                    {showStats && <InteractionStats userProfile={profileToView} t={t} />}
                    {showBadges && <BadgesAndAchievements userProfile={profileToView} t={t} />}
                    {showTools && <BMICalculatorCard t={t} />}
                    {showDailyTips && <DailyTipsCard t={t} language={language} />}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
