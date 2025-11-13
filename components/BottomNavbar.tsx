import React from 'react';
import { UserProfile } from '../types';
import { ExploreIcon, PlusIcon, GroupIcon, PrivateIcon, MessageIcon, EventIcon } from './Icons';

interface BottomNavbarProps {
    currentView: string;
    currentUser: UserProfile | null;
    viewingProfileId: string | null;
    onSelectExplore: () => void;
    onSelectGroupHabits: () => void;
    onSelectPrivateHabits: () => void;
    onSelectMessagingList: () => void;
    onSelectEvents: () => void;
    onSelectCreateHabit: () => void;
    onViewProfile: (userId: string) => void;
    t: (key: string) => string;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
            isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400'
        }`}
    >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
    </button>
);


const BottomNavbar: React.FC<BottomNavbarProps> = ({
    currentView,
    currentUser,
    viewingProfileId,
    onSelectExplore,
    onSelectGroupHabits,
    onSelectPrivateHabits,
    onSelectMessagingList,
    onSelectEvents,
    onViewProfile,
    t
}) => {
    if (!currentUser) {
        return null;
    }

    const viewingOwnProfile = currentView === 'profile' && viewingProfileId === currentUser.id;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-20">
            <nav className="relative bg-white dark:bg-neutral-900 border-t border-border-color dark:border-neutral-800 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] h-full">
                <div className="max-w-[1100px] mx-auto flex items-center justify-around h-full px-2">
                    <NavItem
                        icon={<ExploreIcon className="w-6 h-6" />}
                        label={t('explore')}
                        isActive={currentView === 'explore'}
                        onClick={onSelectExplore}
                    />
                     <NavItem
                        icon={<GroupIcon className="w-6 h-6" />}
                        label={t('grup')}
                        isActive={currentView === 'groupHabits'}
                        onClick={onSelectGroupHabits}
                    />
                     <NavItem
                        icon={<PrivateIcon className="w-6 h-6" />}
                        label={t('privat')}
                        isActive={currentView === 'privateHabits'}
                        onClick={onSelectPrivateHabits}
                    />
                     <NavItem
                        icon={<EventIcon className="w-6 h-6" />}
                        label={t('events')}
                        isActive={currentView === 'events'}
                        onClick={onSelectEvents}
                    />
                     <NavItem
                        icon={<MessageIcon className="w-6 h-6" />}
                        label={t('messages')}
                        isActive={currentView === 'messagingList'}
                        onClick={onSelectMessagingList}
                    />
                    <button
                        onClick={() => onViewProfile(currentUser.id)}
                        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
                            viewingOwnProfile ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400'
                        }`}
                    >
                        <img src={currentUser.avatar} alt={t('you')} className={`w-6 h-6 rounded-full ring-2 ${viewingOwnProfile ? 'ring-primary' : 'ring-transparent'}`} />
                        <span className="text-xs font-medium mt-1">{t('you')}</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default BottomNavbar;