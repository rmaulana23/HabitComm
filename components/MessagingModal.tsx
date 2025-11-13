import React, { useState, useRef, useEffect } from 'react';
import { Conversation, User } from '../types';

interface MessagingModalProps {
    recipient: User;
    currentUser: User;
    conversation?: Conversation;
    onClose: () => void;
    onSendMessage: (content: string) => void;
    t: (key: string) => string;
}

const MessagingModal: React.FC<MessagingModalProps> = ({ recipient, currentUser, conversation, onClose, onSendMessage, t }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-lg relative shadow-2xl flex flex-col h-[70vh]">
                <header className="flex items-center p-4 border-b border-border-color dark:border-neutral-800">
                    <img src={recipient.avatar} alt={recipient.name} className="w-10 h-10 rounded-full mr-3" />
                    <h2 className="text-lg font-bold text-text-primary dark:text-neutral-200 flex-1">{recipient.name}</h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {conversation?.messages.map((msg, index) => {
                        const isSentByCurrentUser = msg.senderId === currentUser.id;
                        return (
                            <div key={index} className={`flex items-end gap-2 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                {!isSentByCurrentUser && <img src={recipient.avatar} alt={recipient.name} className="w-6 h-6 rounded-full"/>}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isSentByCurrentUser ? 'bg-primary text-white rounded-br-lg' : 'bg-gray-200 dark:bg-neutral-800 text-text-primary dark:text-neutral-200 rounded-bl-lg'}`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                                {isSentByCurrentUser && <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full"/>}
                            </div>
                        )
                    })}
                     <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t border-border-color dark:border-neutral-800 flex items-center space-x-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('messagePlaceholder')}
                        className="flex-1 bg-secondary dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-border-color dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" disabled={!message.trim()} className="p-3 bg-primary rounded-lg text-white disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:text-gray-500 transition-colors">
                        <span className="text-2xl leading-none">➤</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessagingModal;