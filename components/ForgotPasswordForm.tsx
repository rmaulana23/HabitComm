
import React, { useState } from 'react';
import { MailIcon } from './Icons';
import { AuthInput, AuthButton } from './AuthShared';

interface ForgotPasswordFormProps {
    onSwitchToSuccess: () => void;
    onSwitchToLogin: () => void;
    onSubmit: (email: string) => Promise<void>;
    t: (key: string) => string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToSuccess, onSwitchToLogin, onSubmit, t }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(email);
            onSwitchToSuccess();
        } catch (error) {
            console.error(error);
            alert("Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200">{t('resetYourPassword')}</h2>
            <p className="text-text-secondary dark:text-neutral-400 mb-6">{t('resetPasswordInstruction')}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('emailAddress')}</label>
                    <AuthInput icon={<MailIcon className="w-5 h-5"/>} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <AuthButton type="submit" loading={loading}>
                    {t('sendResetLink')}
                </AuthButton>
            </form>
            <p className="text-center text-sm mt-4">
                 <button onClick={onSwitchToLogin} className="font-bold text-primary hover:underline">{t('backToLogin')}</button>
            </p>
        </div>
    );
};

interface ForgotPasswordSuccessProps {
    onSwitchToLogin: () => void;
    t: (key: string) => string;
}

export const ForgotPasswordSuccess: React.FC<ForgotPasswordSuccessProps> = ({ onSwitchToLogin, t }) => (
    <div className="text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200">{t('resetLinkSent')}</h2>
        <p className="text-text-secondary dark:text-neutral-400 my-4">{t('resetLinkSentInstruction')}</p>
        <button onClick={onSwitchToLogin} className="font-bold text-primary hover:underline">{t('backToLogin')}</button>
    </div>
);
