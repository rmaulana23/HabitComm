
import React, { useState } from 'react';
import { UserIcon, MailIcon, LockIcon } from './Icons';
import { AuthInput, AuthButton, EyeIcon, EyeSlashIcon } from './AuthShared';

interface RegisterFormProps {
    onRegister: (name: string, email: string, pass: string) => void;
    onSwitchToLogin: () => void;
    t: (key: string) => string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin, t }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate network request
        setTimeout(() => {
            onRegister(name, email, password);
            setLoading(false);
        }, 500);
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-primary dark:text-primary-400 text-center mb-1">HabitComm</h1>
            <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 text-center">{t('createAccount')}</h2>
            <p className="text-text-secondary dark:text-neutral-400 mb-6 text-center">{t('createAccountToStart')}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('fullName')}</label>
                    <AuthInput icon={<UserIcon className="w-5 h-5"/>} type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('emailAddress')}</label>
                    <AuthInput icon={<MailIcon className="w-5 h-5"/>} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('password')}</label>
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
                    {t('register')}
                </AuthButton>
            </form>
            <p className="text-center text-sm mt-4">
                {t('haveAccount')}{' '}
                <button onClick={onSwitchToLogin} className="font-bold text-primary hover:underline">{t('logIn')}</button>
            </p>
        </div>
    );
};
export default RegisterForm;
