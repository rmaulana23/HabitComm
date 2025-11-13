import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { generateMotto } from '../services/geminiService';

interface EditProfileModalProps {
    currentUser: UserProfile;
    onClose: () => void;
    onSave: (name: string, motto: string, avatarFile: File | null) => void;
    t: (key: string) => string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ currentUser, onClose, onSave, t }) => {
    const [name, setName] = useState(currentUser.name);
    const [motto, setMotto] = useState(currentUser.motto);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isGeneratingMotto, setIsGeneratingMotto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    
    const handleGenerateMotto = async () => {
        setIsGeneratingMotto(true);
        try {
            const newMotto = await generateMotto(currentUser.name);
            setMotto(newMotto);
        } catch (error) {
            console.error("Error generating motto:", error);
            alert("Failed to generate motto. Please try again.");
        } finally {
            setIsGeneratingMotto(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim(), motto.trim(), avatarFile);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-6 text-center">{t('editProfile')}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <img src={avatarPreview || currentUser.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-200" />
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-4xl"
                                aria-label={t('changeAvatar')}
                            >
                                📷
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="profile-name" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('yourName')}</label>
                        <input
                            id="profile-name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                     <div>
                        <label htmlFor="profile-motto" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">Motto</label>
                         <div className="relative">
                            <input
                                id="profile-motto"
                                type="text"
                                value={motto}
                                onChange={e => setMotto(e.target.value)}
                                placeholder="Your motivational motto"
                                className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                             <button 
                                type="button"
                                onClick={handleGenerateMotto}
                                disabled={isGeneratingMotto}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold bg-primary-100 dark:bg-primary-500/20 text-primary dark:text-primary-300 px-2 py-1 rounded-md hover:bg-primary-200 dark:hover:bg-primary-500/30 transition disabled:opacity-50"
                            >
                                {isGeneratingMotto ? '...' : '✨ Generate with AI'}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="px-8 py-2 rounded-lg bg-primary hover:bg-primary-600 transition-colors text-white font-bold shadow-md hover:shadow-lg">
                            {t('saveChanges')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;