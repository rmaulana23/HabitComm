import React, { useState } from 'react';
import { Event } from '../types';

interface CreateEventModalProps {
    onClose: () => void;
    onSave: (eventData: Omit<Event, 'id'>) => void;
    t: (key: string) => string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onSave, t }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [isFree, setIsFree] = useState(true);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>('');
    const [organizer, setOrganizer] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [contactPerson, setContactPerson] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [eventType, setEventType] = useState<'online' | 'offline'>('offline');
    const [onlineUrl, setOnlineUrl] = useState('');


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
            if (coverImagePreview) {
                URL.revokeObjectURL(coverImagePreview);
            }
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app, this would be an async call to a service like Supabase Storage.
        // Here, we simulate the upload by creating a mock public URL.
        const getMockStorageUrl = (file: File) => {
            const mockDomain = 'https://ivbkvxxyuznztpvdbwva.supabase.co/storage/v1/object/public/habit_images/events';
            const fileExtension = file.name.split('.').pop() || 'jpg';
            const randomFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;
            return `${mockDomain}/${randomFileName}`;
        };

        const isLocationRequired = eventType === 'offline' && !location.trim();
        const isUrlRequired = eventType === 'online' && !onlineUrl.trim();

        if (!title.trim() || !date || !description.trim() || !coverImageFile || !organizer.trim() || (!isFree && !price) || isLocationRequired || isUrlRequired || !startTime) {
            alert(t('fillAllEventFields'));
            return;
        }

        const finalCoverImageUrl = getMockStorageUrl(coverImageFile);

        onSave({ 
            title, 
            date, 
            description, 
            isFree, 
            coverImage: finalCoverImageUrl,
            organizer,
            price: isFree ? undefined : Number(price),
            contactPerson: contactPerson || undefined,
            type: eventType,
            location: eventType === 'offline' ? location : undefined,
            onlineUrl: eventType === 'online' ? onlineUrl : undefined,
            startTime,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-3xl relative shadow-2xl flex flex-col max-h-[90vh]">
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-6 flex-shrink-0">{t('createNewEvent')}</h2>
                
                <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="event-title" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventTitle')}</label>
                                <input id="event-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div>
                                <label htmlFor="event-organizer" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventOrganizer')}</label>
                                <input id="event-organizer" type="text" placeholder={t('organizerPlaceholder')} value={organizer} onChange={e => setOrganizer(e.target.value)} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                             <div>
                                <label htmlFor="event-date" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventDate')}</label>
                                <input id="event-date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:light] dark:[color-scheme:dark]"/>
                            </div>
                            <div>
                                <label htmlFor="event-start-time" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventStartTime')}</label>
                                <input id="event-start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:light] dark:[color-scheme:dark]"/>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventType')}</label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setEventType('offline')}
                                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                            eventType === 'offline' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        {t('offline')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEventType('online')}
                                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                            eventType === 'online' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        {t('online')}
                                    </button>
                                </div>
                            </div>
                            {eventType === 'offline' ? (
                                <div className="animate-fade-in">
                                    <label htmlFor="event-location" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventLocationLabel')}</label>
                                    <input id="event-location" type="text" placeholder={t('locationPlaceholder')} value={location} onChange={e => setLocation(e.target.value)} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"/>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    <label htmlFor="event-online-url" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('onlineUrl')}</label>
                                    <input id="event-online-url" type="url" placeholder={t('onlineUrlPlaceholder')} value={onlineUrl} onChange={e => setOnlineUrl(e.target.value)} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"/>
                                </div>
                            )}
                            <div className="flex items-center pt-2">
                                <input id="event-is-free" type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="h-4 w-4 rounded border-gray-300 dark:border-neutral-600 text-primary focus:ring-primary"/>
                                <label htmlFor="event-is-free" className="ml-2 block text-sm text-text-primary dark:text-neutral-300 font-medium">{t('isFreeEvent')}</label>
                            </div>
                            {!isFree && (
                                <div className="animate-fade-in">
                                    <label htmlFor="event-price" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventPrice')}</label>
                                    <input id="event-price" type="number" placeholder={t('pricePlaceholder')} value={price} onChange={e => setPrice(e.target.value ? parseInt(e.target.value, 10) : '')} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"/>
                                </div>
                            )}
                            <div>
                                <label htmlFor="event-contact" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventContact')}</label>
                                <input id="event-contact" type="text" placeholder={t('contactPlaceholder')} value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                        </div>

                        {/* Spanning full width */}
                        <div className="md:col-span-2">
                            <label htmlFor="event-description" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventDescription')}</label>
                            <textarea id="event-description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary"/>
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="event-cover-image" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('eventCoverImage')}</label>
                            <input id="event-cover-image" type="file" accept="image/*" onChange={handleImageUpload} required className="w-full text-sm text-gray-500 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-500/20 file:text-primary dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-500/30"/>
                        </div>
                        {coverImagePreview && (
                            <div className="md:col-span-2">
                                 <img src={coverImagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2"/>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200 dark:border-neutral-800 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300">{t('cancel')}</button>
                    <button type="submit" className="px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-600 transition-colors text-white font-bold shadow-md hover:shadow-lg">{t('saveEvent')}</button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventModal;