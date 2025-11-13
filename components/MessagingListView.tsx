import React from 'react';
import { Conversation, UserProfile, User } from '../types';

interface MessagingListViewProps {
    conversations: Conversation[];
    users: UserProfile[];
    currentUserProfile: UserProfile;
    onOpenConversation: (user: User) => void;
    t: (key: string) => string;
}

const MessagingListView: React.FC<MessagingListViewProps> = ({ conversations, users, currentUserProfile, onOpenConversation, t }) => {
    const userConversations = conversations
        .filter(c => c.participantIds.includes(currentUserProfile.id))
        .map(c => {
            const otherParticipantId = c.participantIds.find(id => id !== currentUserProfile.id);
            const otherUser = users.find(u => u.id === otherParticipantId);
            const lastMessage = c.messages[c.messages.length - 1];
            return { conversation: c, otherUser, lastMessage };
        })
        .sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());

    return (
        <div className="flex-1 p-6 overflow-y-auto animate-fade-in flex flex-col">
            <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200 mb-6">
                {t('allMessages')}
            </h2>

            {userConversations.length > 0 ? (
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 divide-y divide-border-color dark:divide-neutral-800">
                    {userConversations.map(({ conversation, otherUser, lastMessage }) => {
                        if (!otherUser) return null;
                        const isLastMessageFromCurrentUser = lastMessage.senderId === currentUserProfile.id;
                        
                        return (
                            <button
                                key={conversation.id}
                                onClick={() => onOpenConversation(otherUser)}
                                className="w-full flex items-center p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors text-left"
                            >
                                <img src={otherUser.avatar} alt={otherUser.name} className="w-12 h-12 rounded-full mr-4" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-text-primary dark:text-neutral-200 truncate">{otherUser.name}</p>
                                        <p className="text-xs text-text-secondary dark:text-neutral-500 shrink-0 ml-2">
                                            {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <p className="text-sm text-text-secondary dark:text-neutral-400">
                                        {isLastMessageFromCurrentUser && `${t('you')}: `}{lastMessage.content}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-text-secondary dark:text-neutral-400 py-20">
                    <p className="text-lg font-bold">{t('noMessages')}</p>
                </div>
            )}
        </div>
    );
};

export default MessagingListView;