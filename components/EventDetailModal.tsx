import React from 'react';
import { Event, Language } from '../types';

interface EventDetailModalProps {
    event: Event;
    onClose: () => void;
    t: (key: string) => string;
    language: Language;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, t, language }) => {
    const priceDisplay = event.isFree 
        ? t('free') 
        : event.price 
            ? `Rp${event.price.toLocaleString('id-ID')}` 
            : t('paid');
    
    const formattedDate = new Date(event.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' 
    });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-2xl relative shadow-2xl flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-200 bg-black/40 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 z-10">&times;</button>
                <div className="w-full h-56">
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover rounded-t-xl" />
                </div>
                <div className="p-8 overflow-y-auto">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full mb-4 inline-block ${event.isFree ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'}`}>
                        {priceDisplay}
                    </span>
                    <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200">{event.title}</h2>
                    <div className="text-text-secondary dark:text-neutral-400 mt-2 space-y-1 text-sm">
                        <p>{t('organizedBy')} <span className="font-bold text-text-primary dark:text-neutral-300">{event.organizer}</span></p>
                        <p>{t('onDate')} <span className="font-bold text-text-primary dark:text-neutral-300">{formattedDate}</span></p>
                        <p>{t('eventStartTime')} <span className="font-bold text-text-primary dark:text-neutral-300">{event.startTime}</span></p>
                        {event.type === 'offline' && event.location && (
                            <p>{t('eventLocationLabel')} <span className="font-bold text-text-primary dark:text-neutral-300">{event.location}</span></p>
                        )}
                        {event.type === 'online' && event.onlineUrl && (
                             <p>{t('eventLink')} <a href={event.onlineUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline truncate inline-block max-w-full align-bottom">{event.onlineUrl}</a></p>
                        )}
                    </div>

                    <p className="text-text-primary dark:text-neutral-300 mt-4 whitespace-pre-wrap">{event.description}</p>
                    
                    {event.contactPerson && (
                         <div className="mt-6 pt-4 border-t border-border-color dark:border-neutral-800">
                             <h4 className="font-semibold text-text-primary dark:text-neutral-300 mb-1">{t('eventContact').replace(' (Opsional)', '').replace(' (Optional)', '')}</h4>
                            <p className="text-text-secondary dark:text-neutral-400">{event.contactPerson}</p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end p-6 border-t border-border-color dark:border-neutral-800">
                    <button className="px-6 py-2.5 text-base font-semibold rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors">
                        {t('joinEvent')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;