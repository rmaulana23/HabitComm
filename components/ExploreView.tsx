import React from 'react';
import { Habit, User } from '../types';
import HabitCard from './HuddleCard';

interface ExploreViewProps {
    allHabits: Habit[];
    currentUser: User | null;
    onJoinHabit: (habitId: string) => void;
    onViewDetail: (habit: Habit) => void;
    t: (key: string) => string;
    boostedHabitId: string | null;
}

const ExploreView: React.FC<ExploreViewProps> = ({ allHabits, currentUser, onJoinHabit, onViewDetail, t, boostedHabitId }) => {
    const groupHabits = allHabits.filter(h => h.type === 'group');
    
    // Dynamically find the boosted habit
    const habitOfTheDay = boostedHabitId ? groupHabits.find(h => h.id === boostedHabitId) : null;
    
    // Filter out the habit of the day from the main list
    const otherHabits = groupHabits.filter(h => h.id !== boostedHabitId);
    
    // Determine the state for the quick join button
    const isMember = currentUser && habitOfTheDay ? habitOfTheDay.members.some(m => m.id === currentUser.id) : false;
    const isFull = habitOfTheDay ? habitOfTheDay.members.length >= habitOfTheDay.memberLimit : false;

    return (
        <div className="flex-1 p-6 overflow-y-auto animate-fade-in flex flex-col">
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img src="https://i.imgur.com/CRKlyet.jpg" alt={t('exploreHeader')} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center p-4">
                    <h1 className="text-4xl font-extrabold text-white text-center leading-tight drop-shadow-lg max-w-lg">
                        {t('exploreHeader')}
                    </h1>
                </div>
            </div>

            {/* Habit of the Day Feature */}
            {habitOfTheDay && (
                <div 
                    onClick={() => onViewDetail(habitOfTheDay)}
                    className="bg-gradient-to-br from-primary-600 to-red-800 rounded-2xl p-6 mb-8 text-white shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
                >
                    <p className="font-bold text-xs uppercase tracking-wider opacity-80 mb-2">{t('habitOfTheDay')}</p>
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-2xl">
                            <span>⚡️</span>
                        </div>
                        <h3 className="font-bold text-2xl">{habitOfTheDay.name}</h3>
                    </div>
                    <p className="text-sm opacity-90 mb-4 line-clamp-2">{habitOfTheDay.description}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                {habitOfTheDay.members.slice(0, 4).map(member => (
                                    <img key={member.id} src={member.avatar} alt={member.name} title={member.name} className="w-8 h-8 rounded-full ring-2 ring-primary-500"/>
                                ))}
                            </div>
                            <span className="text-sm font-semibold ml-3">{habitOfTheDay.members.length} {t('members')}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isMember && !isFull) onJoinHabit(habitOfTheDay.id);
                            }}
                            disabled={isMember || isFull}
                            className="flex items-center justify-center font-bold bg-white text-primary px-5 py-2.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors disabled:bg-white/50 disabled:text-primary/70 disabled:cursor-not-allowed"
                        >
                            <span className="mr-2">⚡️</span>
                            {isMember ? t('joined') : isFull ? t('full') : t('quickJoin')}
                        </button>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherHabits.map(habit => (
                    <HabitCard 
                        key={habit.id}
                        habit={habit}
                        currentUser={currentUser}
                        onJoin={onJoinHabit}
                        onClick={() => onViewDetail(habit)}
                        t={t}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExploreView;