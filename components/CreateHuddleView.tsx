import React, { useState, useMemo } from 'react';
import { Habit } from '../types';
import { getIconForTopic } from '../utils';

interface CreateHabitViewProps {
    onCancel: () => void;
    // FIX: Updated signature to pass cover image file separately to match parent handler.
    onCreate: (habitData: Omit<Habit, 'id' | 'members' | 'posts' | 'memberLimit' | 'highlightIcon' | 'creatorId' | 'coverImage'>, coverImageFile: File | null) => void;
    t: (key: string) => string;
}

const CreateHabitView: React.FC<CreateHabitViewProps> = ({ onCancel, onCreate, t }) => {
    const [habitType, setHabitType] = useState<'group' | 'private' | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedGroupName, setSelectedGroupName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [rules, setRules] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

    const habitCategories = useMemo(() => [
        { 
            group: t('cat_learning'),
            items: [
                { name: t('cat_learning_lang'), topic: 'Language' },
                { name: t('cat_learning_tech'), topic: 'Design' },
                { name: t('cat_learning_academic'), topic: 'Reading' },
                { name: t('cat_learning_readwrite'), topic: 'Reading' },
                { name: t('cat_learning_art'), topic: 'Wellbeing' }
            ]
        },
        {
            group: t('cat_health_phys'),
            items: [
                { name: t('cat_health_phys_sport'), topic: 'Running' },
                { name: t('cat_health_phys_diet'), topic: 'Wellbeing' },
                { name: t('cat_health_phys_sleep'), topic: 'Wellbeing' }
            ]
        },
        {
            group: t('cat_health_mental'),
            items: [
                { name: t('cat_health_mental_meditate'), topic: 'Wellbeing' },
                { name: t('cat_health_mental_emo'), topic: 'Social' },
                { name: t('cat_health_mental_prod'), topic: 'Design' }
            ]
        },
        {
            group: t('cat_finance'),
            items: [
                { name: t('cat_finance_manage'), topic: 'Career' },
                { name: t('cat_finance_dev'), topic: 'Career' },
                { name: t('cat_finance_side'), topic: 'Career' }
            ]
        },
        {
            group: t('cat_lifestyle'),
            items: [
                { name: t('cat_lifestyle_org'), topic: 'Lifestyle' },
                { name: t('cat_lifestyle_env'), topic: 'Lifestyle' },
                { name: t('cat_lifestyle_hobby'), topic: 'Wellbeing' }
            ]
        },
        {
            group: t('cat_social'),
            items: [
                { name: t('cat_social_net'), topic: 'Social' },
                { name: t('cat_social_comm'), topic: 'Social' }
            ]
        },
        {
            group: t('cat_challenge'),
            items: [
                { name: t('cat_challenge_general'), topic: 'Challenge' },
                { name: t('cat_challenge_project'), topic: 'Challenge' }
            ]
        }
    ], [t]);

    const allCategoryItems = habitCategories.flatMap(g => g.items);
    const selectedSubCategory = allCategoryItems.find(c => c.name === subCategoryName);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!habitType || !name.trim() || !description.trim() || !subCategoryName) {
            alert(t('fillFormPrompt'));
            return;
        }
        if (!selectedSubCategory) {
            alert(t('invalidCategory'));
            return;
        }

        onCreate({ name, topic: selectedSubCategory.topic, description, rules, type: habitType }, coverImageFile);
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto animate-fade-in flex flex-col">
            <div className="max-w-3xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200 mb-6 text-center">{t('createNewHabit')}</h2>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-md border border-border-color dark:border-neutral-800 space-y-4 flex-grow flex flex-col">
                    <div className="flex-grow space-y-4">
                         <div>
                            <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('selectHabitType')}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setHabitType('group')}
                                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${habitType === 'group' ? 'border-primary bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-500'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-2xl ${habitType === 'group' ? 'text-primary' : 'text-gray-500'}`}>👥</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-text-primary dark:text-neutral-200">{t('groupHabit')}</p>
                                            <p className="text-xs text-text-secondary dark:text-neutral-400">{t('groupHabitDesc')}</p>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setHabitType('private')}
                                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${habitType === 'private' ? 'border-primary bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-500'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-2xl ${habitType === 'private' ? 'text-primary' : 'text-gray-500'}`}>👤</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-text-primary dark:text-neutral-200">{t('privateHabit')}</p>
                                            <p className="text-xs text-text-secondary dark:text-neutral-400">{t('privateHabitDesc')}</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {habitType && (
                            <div className="space-y-4 animate-fade-in pt-4 border-t border-gray-100 dark:border-neutral-800">
                                <div>
                                    <label htmlFor="habit-name" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('habitName')}</label>
                                    <input
                                        id="habit-name"
                                        type="text"
                                        placeholder={t('habitNamePlaceholder')}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="habit-description" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('description')}</label>
                                    <textarea
                                        id="habit-description"
                                        placeholder={t('habitDescriptionPlaceholder')}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 h-24 focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-sm"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="habit-main-category" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('mainCategory')}</label>
                                    <select
                                        id="habit-main-category"
                                        value={selectedGroupName}
                                        onChange={e => {
                                            setSelectedGroupName(e.target.value);
                                            setSubCategoryName('');
                                        }}
                                        required
                                        className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm font-medium"
                                    >
                                        <option value="" disabled>{t('selectMainCategory')}</option>
                                        {habitCategories.map(group => (
                                            <option key={group.group} value={group.group}>{group.group}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedGroupName && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('subCategory')}</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {habitCategories.find(g => g.group === selectedGroupName)?.items.map(item => {
                                                const isSelected = subCategoryName === item.name;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={item.name}
                                                        onClick={() => setSubCategoryName(item.name)}
                                                        className={`p-3 rounded-lg border dark:border-neutral-700 text-left transition-all duration-200 flex items-center space-x-3 text-sm font-semibold ${
                                                            isSelected
                                                                ? 'bg-primary text-white ring-2 ring-primary-300 shadow-lg'
                                                                : 'bg-white dark:bg-neutral-800 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:border-primary-300 dark:hover:border-primary-400'
                                                        }`}
                                                    >
                                                        <span className={isSelected ? 'text-white' : 'text-text-secondary dark:text-neutral-400'}>{getIconForTopic(item.topic)}</span>
                                                        <span>{item.name}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                {habitType === 'group' && (
                                    <>
                                        <div>
                                            <label htmlFor="habit-rules" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('habitRulesOptional')}</label>
                                            <input
                                                id="habit-rules"
                                                type="text"
                                                placeholder={t('habitRulesPlaceholder')}
                                                value={rules}
                                                onChange={e => setRules(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cover-image" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('coverImageOptional')}</label>
                                            <input
                                                id="cover-image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="w-full text-sm text-gray-500 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-500/20 file:text-primary dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-500/30"
                                            />
                                        </div>
                                        {coverImage && (
                                            <div className="animate-fade-in">
                                                <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('imagePreview')}</label>
                                                <img src={coverImage} alt="Cover preview" className="w-full h-40 object-cover rounded-lg shadow-sm" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-neutral-800 mt-auto">
                        <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300">
                            {t('cancel')}
                        </button>
                        <button type="submit" disabled={!habitType} className="px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-600 transition-colors text-white font-bold shadow-md hover:shadow-lg disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed">
                            {t('createHabitButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateHabitView;
