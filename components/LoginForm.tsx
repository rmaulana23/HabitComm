
import React, { useState } from 'react';
import { MailIcon, LockIcon } from './Icons';
import { AuthInput, AuthButton, EyeIcon, EyeSlashIcon } from './AuthShared';

interface LoginFormProps {
    onLogin: (email: string, pass: string) => void;
    onSwitchToRegister: () => void;
    onSwitchToForgot: () => void;
    t: (key: string) => string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister, onSwitchToForgot, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            onLogin(email, password);
            setLoading(false); 
        }, 500);
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-text-primary dark:text-neutral-200 text-center mb-1">HabitComm</h1>
            <h2 className="text-2xl font-bold text-primary dark:text-primary-400 text-center">{t('welcomeBack')}</h2>
            <p className="text-text-secondary dark:text-neutral-400 mb-6 text-center">{t('loginToContinue')}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('emailAddress')}</label>
                    <AuthInput icon={<MailIcon className="w-5 h-5"/>} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-text-primary dark:text-neutral-300">{t('password')}</label>
                        <button type="button" onClick={onSwitchToForgot} className="text-xs font-bold text-primary hover:underline">{t('forgotPassword')}</button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <LockIcon className="w-5 h-5"/>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-200 p-3 pl-10 pr-10 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 dark:text-neutral-400 hover:text-primary dark:hover:text-neutral-200 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
                <AuthButton type="submit" loading={loading}>
                    {t('logIn')}
                </AuthButton>
            </form>
            <p className="text-center text-sm mt-4">
                {t('noAccount')}{' '}
                <button onClick={onSwitchToRegister} className="font-bold text-primary hover:underline">{t('register')}</button>
            </p>
        </div>
    );
};
export default LoginForm;
