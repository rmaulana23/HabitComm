import React from 'react';
import { Event } from '../types';

interface EventsViewProps {
    events: Event[];
    t: (key: string) => string;
    onCreateEvent: () => void;
    onViewEvent: (event: Event) => void;
}

const EventCard: React.FC<{ event: Event, t: (key: string) => string, onClick: () => void }> = ({ event, t, onClick }) => (
    <button onClick={onClick} className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 text-left w-full">
        <img src={event.coverImage} alt={event.title} className="w-full h-40 object-cover" />
        <div className="p-4">
            <h3 className="font-bold text-lg text-text-primary dark:text-neutral-200">{event.title}</h3>
            <p className="text-sm text-text-secondary dark:text-neutral-400 mt-1">{event.date}</p>
            <div className="mt-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${event.isFree ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'}`}>
                    {event.isFree ? t('free') : t('paid')}
                </span>
            </div>
        </div>
    </button>
);


const EventsView: React.FC<EventsViewProps> = ({ events, t, onCreateEvent, onViewEvent }) => {
    return (
        <div className="flex-1 p-6 overflow-y-auto animate-fade-in flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200">
                    {t('upcomingEvents')}
                </h2>
                <button onClick={onCreateEvent} className="flex items-center text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-primary hover:bg-primary-600 shadow-sm hover:shadow-md">
                    <span className="mr-2">➕</span>
                    {t('createEvent')}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map(event => (
                    <EventCard key={event.id} event={event} t={t} onClick={() => onViewEvent(event)} />
                ))}
            </div>
        </div>
    );
};

export default EventsView;