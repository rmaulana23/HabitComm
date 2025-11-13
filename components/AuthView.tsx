import React, { useState } from 'react';
import { UserIcon, LockIcon, MailIcon } from './Icons';

// --- Shared Internal Components ---

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a.75.75 0 010-1.113zM12.001 18C7.899 18 4.109 15.425 2.68 12c1.43-3.425 5.22-6 9.322-6s7.892 2.575 9.322 6c-1.429 3.425-5.22 6-9.322 6z" clipRule="evenodd" />
  </svg>
);
  
const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
    <path d="M15.75 12c0 .18-.013.357-.037.53l-1.5-1.5A3.75 3.75 0 0012 8.25c-1.05 0-1.973.44-2.633 1.148l-1.521-1.521A11.222 11.222 0 0112 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113a11.248 11.248 0 01-2.63 4.31zM4.717 14.555A11.22 11.22 0 011.323 12.447a.75.75 0 010-1.113C2.811 6.976 7.028 3.75 12.001 3.75a11.248 11.248 0 014.242.827l-1.522 1.522a3.75 3.75 0 00-4.241 4.241L4.717 14.555z" />
  </svg>
);

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
}

const AuthInput: React.FC<AuthInputProps> = ({ icon, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
        </div>
        <input 
            {...props}
            className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder-neutral-400 p-3 pl-10 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
);

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ loading, children, ...props }) => (
    <button 
        {...props}
        disabled={loading || props.disabled}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 dark:disabled:bg-primary-700/50 flex items-center justify-center"
    >
        {loading ? <SpinnerIcon className="h-5 w-5" /> : children}
    </button>
);


// --- Form View Components ---

type LoginFormProps = {
    onLogin: (email: string, pass: string) => void;
    onSwitchToRegister: () => void;
    onSwitchToForgot: () => void;
    t: (key: string) => string;
};
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

type RegisterFormProps = {
    onRegister: (name: string, email: string) => void;
    onSwitchToLogin: () => void;
    t: (key: string) => string;
};
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
            onRegister(name, email);
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

type ForgotPasswordFormProps = {
    onSwitchToSuccess: () => void;
    onSwitchToLogin: () => void;
    t: (key: string) => string;
};
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToSuccess, onSwitchToLogin, t }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            onSwitchToSuccess();
            setLoading(false);
        }, 500);
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

type ForgotPasswordSuccessProps = {
    onSwitchToLogin: () => void;
    t: (key: string) => string;
};
const ForgotPasswordSuccess: React.FC<ForgotPasswordSuccessProps> = ({ onSwitchToLogin, t }) => (
    <div className="text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200">{t('resetLinkSent')}</h2>
        <p className="text-text-secondary dark:text-neutral-400 my-4">{t('resetLinkSentInstruction')}</p>
        <button onClick={onSwitchToLogin} className="font-bold text-primary hover:underline">{t('backToLogin')}</button>
    </div>
);


// --- Main Modal Component ---

type AuthModalProps = {
    initialView: 'login' | 'register' | 'forgotPassword' | 'forgotPasswordSuccess';
    onLogin: (email: string, pass: string) => void;
    onRegister: (name: string, email: string) => void;
    onClose: () => void;
    t: (key: string) => string;
};

type View = 'login' | 'register' | 'forgotPassword' | 'forgotPasswordSuccess';

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onLogin, onRegister, onClose, t }) => {
    const [view, setView] = useState<View>(initialView);

    const renderContent = () => {
        switch(view) {
            case 'register':
                return <RegisterForm onRegister={onRegister} onSwitchToLogin={() => setView('login')} t={t} />;
            case 'forgotPassword':
                 return <ForgotPasswordForm onSwitchToSuccess={() => setView('forgotPasswordSuccess')} onSwitchToLogin={() => setView('login')} t={t} />;
            case 'forgotPasswordSuccess':
                 return <ForgotPasswordSuccess onSwitchToLogin={() => setView('login')} t={t} />;
            case 'login':
            default:
                return <LoginForm onLogin={onLogin} onSwitchToRegister={() => setView('register')} onSwitchToForgot={() => setView('forgotPassword')} t={t} />;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
             <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-sm relative shadow-2xl">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold z-10">&times;</button>
                 <div className="p-8">
                    {renderContent()}
                 </div>
            </div>
        </div>
    );
};

export default AuthModal;