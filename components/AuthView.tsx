
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { ForgotPasswordForm, ForgotPasswordSuccess } from './ForgotPasswordForm';

type AuthModalProps = {
    initialView: 'login' | 'register' | 'forgotPassword' | 'forgotPasswordSuccess';
    onLogin: (email: string, pass: string) => void;
    onRegister: (name: string, email: string, pass: string) => void;
    onForgotPassword: (email: string) => Promise<void>;
    onClose: () => void;
    t: (key: string) => string;
};

type View = 'login' | 'register' | 'forgotPassword' | 'forgotPasswordSuccess';

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onLogin, onRegister, onForgotPassword, onClose, t }) => {
    const [view, setView] = useState<View>(initialView);

    const renderContent = () => {
        switch(view) {
            case 'register':
                return <RegisterForm onRegister={onRegister} onSwitchToLogin={() => setView('login')} t={t} />;
            case 'forgotPassword':
                 return <ForgotPasswordForm onSwitchToSuccess={() => setView('forgotPasswordSuccess')} onSwitchToLogin={() => setView('login')} onSubmit={onForgotPassword} t={t} />;
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
