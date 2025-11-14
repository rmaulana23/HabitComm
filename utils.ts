
import React from 'react';
import { StreakLog } from './types';

export const getIconForTopic = (topic: string): string => {
  switch (topic.toLowerCase()) {
    case 'reading': return '📚';
    case 'running': return '🏃';
    case 'design': return '🎨';
    case 'language': return '🗣️';
    case 'challenge': return '🏆';
    case 'wellbeing': return '✨';
    case 'career': return '💼';
    case 'lifestyle': return '🏡';
    case 'social': return '👥';
    default: return '📖';
  }
};

export const getHighlightIcon = (iconName?: string): string | null => {
    if (!iconName) return null;
    switch (iconName.toLowerCase()) {
        case 'flame': return '🔥';
        case 'chat': return '💬';
        case 'vote': return '🗳️';
        case 'design': return '✍️';
        default: return null;
    }
}

export const parseContent = (content: string) => {
    const parts = content.split(/(#\w+)/g);
    return parts.map((part, i) =>
        part.startsWith('#') ? (
            React.createElement('span', { key: i, className: "text-primary-600 font-medium" }, part)
        ) : (
            part
        )
    );
};

export const calculateCurrentStreak = (logs: StreakLog[]): number => {
    if (!logs || logs.length === 0) {
        return 0;
    }
    const logDates = [...new Set(logs.map(l => {
        const d = new Date(l.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }))].sort((a, b) => b - a);

    if (logDates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (logDates[0] !== today.getTime() && logDates[0] !== yesterday.getTime()) {
        return 0;
    }

    let currentStreak = 1;
    let lastDate = new Date(logDates[0]);

    for (let i = 1; i < logDates.length; i++) {
        const currentDate = new Date(logDates[i]);
        const expectedDate = new Date(lastDate);
        expectedDate.setDate(lastDate.getDate() - 1);

        if (currentDate.getTime() === expectedDate.getTime()) {
            currentStreak++;
            lastDate = currentDate;
        } else {
            break;
        }
    }

    return currentStreak;
};

export const calculateLongestStreak = (logs: StreakLog[]): number => {
    if (!logs || logs.length < 1) {
        return 0;
    }
    const logDates = [...new Set(logs.map(l => {
        const d = new Date(l.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }))].sort((a, b) => a - b);

    if (logDates.length === 0) return 0;
    
    let longestStreak = 0;
    let currentStreak = 0;

    if (logDates.length > 0) {
        longestStreak = 1;
        currentStreak = 1;
    }

    for (let i = 1; i < logDates.length; i++) {
        const currentDate = new Date(logDates[i]);
        const prevDate = new Date(logDates[i - 1]);
        
        const expectedPrevDate = new Date(currentDate);
        expectedPrevDate.setDate(currentDate.getDate() - 1);
        
        if (prevDate.getTime() === expectedPrevDate.getTime()) {
            currentStreak++;
        } else {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    return longestStreak;
};


export const calculateCompletionRateLast30Days = (logs: StreakLog[]): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const uniqueLogDays = new Set(
        logs
            .map(log => {
                const logDate = new Date(log.date);
                logDate.setHours(0, 0, 0, 0);
                return logDate;
            })
            .filter(logDate => logDate >= thirtyDaysAgo && logDate <= today)
            .map(logDate => logDate.toDateString())
    );
    
    return Math.round((uniqueLogDays.size / 30) * 100);
};

export const slugify = (text: string): string => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};
