import React from 'react';

interface ComingSoonViewProps {
    t: (key: string) => string;
}

const ComingSoonView: React.FC<ComingSoonViewProps> = ({ t }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <span className="text-6xl mb-4">🚧</span>
            <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200">{t('comingSoonTitle')}</h2>
            <p className="mt-2 text-text-secondary dark:text-neutral-400 max-w-sm">{t('comingSoonDescription')}</p>
        </div>
    );
};

export default ComingSoonView;
