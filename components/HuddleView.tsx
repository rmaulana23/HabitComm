
import React, { useRef } from 'react';
import { Habit, User, ReactionType, UserProfile } from '../types';
import PostCard from './PostCard';
import HabitProgress from './HabitProgress';
import { SettingsIcon, UserIcon } from './Icons';

interface HabitViewProps {
    selectedHabit: Habit | undefined;
    currentUser: User;
    allUsers: UserProfile[];
    postContent: string;
    setPostContent: (content: string) => void;
    postImage: string | null;
    setPostImage: (image: string | null) => void;
    handleImageSelect: (file: File) => void;
    handlePostSubmit: (e: React.FormEvent) => void;
    handleReaction: (postId: string, reaction: ReactionType) => void;
    handleCommentSubmit: (habitId: string, postId: string, content: string) => void;
    handleBoostHabit: (habitId: string) => void;
    onOpenManageMembers: (habitId: string) => void;
    onViewProfile: (userId: string) => void;
    onOpenJoinRequests?: (habitId: string) => void; // Optional for now to avoid breaking changes if not passed immediately
    t: (key: string) => string;
    boostedHabitId: string | null;
}

const HabitView: React.FC<HabitViewProps> = ({
    selectedHabit,
    currentUser,
    allUsers,
    postContent,
    setPostContent,
    postImage,
    setPostImage,
    handleImageSelect,
    handlePostSubmit,
    handleReaction,
    handleCommentSubmit,
    handleBoostHabit,
    onOpenManageMembers,
    onViewProfile,
    onOpenJoinRequests,
    t,
    boostedHabitId
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!selectedHabit) {
        return (
            <div className="flex-1 flex items-center justify-center text-center text-text-secondary dark:text-neutral-400">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200">{t('welcomeToHabitcom')}</h2>
                    <p className="mt-2">{t('selectHabitPrompt')}</p>
                </div>
            </div>
        );
    }
    
    const currentUserProfile = allUsers.find(u => u.id === currentUser.id);
    const habitStreak = currentUserProfile?.streaks.find(s => s.habitId === selectedHabit.id);

    const isMember = selectedHabit.members.some(m => m.id === currentUser.id);
    const isCreator = selectedHabit.creatorId === currentUser.id;
    const isBoostActive = !!boostedHabitId;
    const hasPendingRequests = (selectedHabit.pendingMembers || []).length > 0;

    return (
        <div className="flex-1 flex flex-col h-full">
            <header className="p-6 border-b border-border-color dark:border-neutral-800 flex-shrink-0 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                         <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200">{selectedHabit.name}</h2>
                         {selectedHabit.isLocked && <span title={t('privateGroup')} className="text-lg">🔒</span>}
                    </div>
                    <p className="text-text-secondary dark:text-neutral-400">{selectedHabit.description}</p>
                </div>
                {isMember && isCreator && (
                    <div className="flex items-center space-x-2">
                        {hasPendingRequests && onOpenJoinRequests && (
                            <button 
                                onClick={() => onOpenJoinRequests(selectedHabit.id)}
                                title={t('pendingRequests')}
                                className="relative flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary dark:text-primary-300 font-bold p-3 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all shadow-sm"
                            >
                                <UserIcon className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                            </button>
                        )}
                        <button 
                            onClick={() => onOpenManageMembers(selectedHabit.id)}
                            title={t('manageMembers')}
                            className="flex items-center justify-center bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 font-bold p-3 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-all shadow-sm"
                        >
                            <SettingsIcon className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={() => handleBoostHabit(selectedHabit.id)}
                            disabled={isBoostActive}
                            title={isBoostActive ? t('boostInProgress') : t('boostHabit')}
                            className="flex items-center justify-center space-x-2 bg-amber-400 text-amber-900 font-bold p-3 md:px-4 md:py-2 rounded-lg hover:bg-amber-500 transition-all shadow-sm hover:shadow-md disabled:bg-amber-200 disabled:text-amber-600 disabled:cursor-not-allowed"
                        >
                            <span className="text-xl">⚡️</span>
                            <span className="hidden md:inline">{t('boostHabit')}</span>
                        </button>
                    </div>
                )}
            </header>
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                 <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {selectedHabit.posts.length > 0 ? (
                            selectedHabit.posts.map(post => (
                                <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    currentUser={currentUser} 
                                    onReact={handleReaction} 
                                    onCommentSubmit={(content) => handleCommentSubmit(selectedHabit.id, post.id, content)}
                                    onViewProfile={onViewProfile}
                                    t={t} 
                                />
                            ))
                        ) : (
                            <div className="text-center text-text-secondary dark:text-neutral-400 py-20">
                                <p className="text-lg">{t('noUpdatesYet')}</p>
                                <p>{t('beTheFirst')}</p>
                            </div>
                        )}
                    </div>
                    <aside className="hidden lg:block lg:col-span-1 space-y-4">
                       {habitStreak && <HabitProgress habitStreak={habitStreak} t={t} />}
                    </aside>
                </div>
            </div>
            <div className="p-4 border-t border-border-color dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
                <form onSubmit={handlePostSubmit} className="w-full max-w-6xl mx-auto">
                    {postImage && (
                        <div className="relative mb-3 inline-block">
                            <img src={postImage} alt="Preview" className="max-h-32 w-auto rounded-lg border-2 border-gray-200 dark:border-neutral-700" />
                            <button
                                type="button"
                                onClick={() => setPostImage(null)}
                                className="absolute -top-2 -right-2 bg-gray-700/80 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold hover:bg-black"
                                aria-label="Remove image"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="flex items-center space-x-3">
                        <img src={currentUser.avatar} alt="Your avatar" className="w-10 h-10 rounded-full" />
                        <input
                            type="text"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder={t('shareProgressPlaceholder')}
                            className="flex-1 bg-secondary dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-border-color dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input 
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleImageSelect(e.target.files[0]);
                                }
                                e.target.value = ''; // Reset file input
                            }}
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg text-gray-600 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </button>
                        <button type="submit" disabled={!postContent.trim() && !postImage} className="p-3 bg-primary rounded-lg text-white disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:text-gray-500 transition-colors">
                            <span className="text-2xl leading-none">➤</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitView;
