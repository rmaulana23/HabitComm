import React from 'react';
import { Notification, NotificationType, ReactionType, User } from '../types';

interface NotificationsFeedProps {
    notifications: Notification[];
    t: (key: string) => string;
    onOpenMessage: (user: User) => void;
}

const getNotificationIcon = (type: NotificationType, reactionType?: ReactionType) => {
    switch (type) {
        case NotificationType.NEW_MESSAGE:
            return <span className="text-xl">💬</span>;
        case NotificationType.NEW_REACTION:
            return reactionType === ReactionType.CHEER 
                ? <span className="text-xl">👏</span> 
                : <span className="text-xl">🔥</span>;
        case NotificationType.NEW_POST:
            return <span className="text-xl">✍️</span>;
        case NotificationType.NEW_MEMBER:
            return <span className="text-xl">👥</span>;
        default:
            return <span className="text-xl">🔔</span>;
    }
};

const NotificationsFeed: React.FC<NotificationsFeedProps> = ({ notifications, t, onOpenMessage }) => {
    
    const getNotificationText = (notification: Notification) => {
        const { type, sender, habit, postContent, reactionType } = notification;
        let text = '';
        switch(type) {
            case NotificationType.NEW_MESSAGE:
                text = t('notificationNewMessage').replace('{name}', sender.name);
                break;
            case NotificationType.NEW_REACTION:
                const key = reactionType === ReactionType.CHEER ? 'notificationNewReactionCheer' : 'notificationNewReactionPush';
                text = t(key).replace('{name}', sender.name).replace('{habitName}', habit?.name || '');
                break;
            case NotificationType.NEW_POST:
                text = t('notificationNewPost')
                    .replace('{name}', sender.name)
                    .replace('{habitName}', habit?.name || '')
                    .replace('{postContent}', postContent || '');
                break;
            case NotificationType.NEW_MEMBER:
                text = t('notificationNewMember').replace('{name}', sender.name).replace('{habitName}', habit?.name || '');
                break;
            default:
                return 'New notification';
        }

        const parts = text.split(new RegExp(`(${sender.name}|${habit?.name})`, 'g'));
        return (
             <p className="text-text-primary dark:text-neutral-300 leading-tight">
                {parts.map((part, index) => {
                    if (part === sender.name) {
                        return <a key={index} href={`/#/profile/${sender.id}`} onClick={(e) => e.stopPropagation()} className="font-bold hover:underline">{part}</a>;
                    }
                    if (habit && part === habit.name) {
                        return <a key={index} href={`/#/habit/${habit.id}`} onClick={(e) => e.stopPropagation()} className="font-bold hover:underline">{part}</a>;
                    }
                    return part;
                })}
            </p>
        );
    };

    const handleNotificationClick = (notification: Notification) => {
        if (notification.type === NotificationType.NEW_MESSAGE) {
            onOpenMessage(notification.sender);
        }
    };
    
    const renderNotification = (notification: Notification) => {
        const commonClasses = "w-full flex items-start text-left space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors";
        
        const content = (
            <>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mt-0.5">
                    {getNotificationIcon(notification.type, notification.reactionType)}
                </div>
                <div className="flex-1">
                    {getNotificationText(notification)}
                    <p className="text-text-secondary dark:text-neutral-400 text-xs">
                        {new Date(notification.timestamp).toLocaleString()}
                    </p>
                </div>
            </>
        );

        if (notification.type === NotificationType.NEW_MESSAGE) {
            return (
                <button 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={commonClasses}
                >
                    {content}
                </button>
            );
        } else {
            return (
                <a 
                    key={notification.id}
                    href={notification.habit ? `/#/habit/${notification.habit.id}` : '#'}
                    className={commonClasses}
                >
                    {content}
                </a>
            );
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 p-4">
            <h3 className="text-lg font-bold text-text-primary dark:text-neutral-200 mb-4 flex items-center">
                <span className="text-xl mr-2">🔔</span>
                {t('notifications')}
            </h3>
            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map(notification => renderNotification(notification))
                ) : (
                    <p className="text-sm text-text-secondary dark:text-neutral-500 text-center py-4">{t('noUpdatesYet')}</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsFeed;