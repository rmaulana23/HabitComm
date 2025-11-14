
import React from 'react';

interface LogoutModalProps {
    onClose: () => void;
    onConfirm: () => void;
    t: (key: string) => string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose, onConfirm, t }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-sm relative shadow-2xl flex flex-col transform transition-all">
                <h2 className="text-xl font-bold text-text-primary dark:text-neutral-200 mb-2">{t('logoutConfirmationTitle')}</h2>
                <p className="text-text-secondary dark:text-neutral-400 mb-6">{t('logoutConfirmationText')}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300">
                        {t('cancel')}
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white font-bold shadow-md">
                        {t('yesLogOut')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
