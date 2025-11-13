import React from 'react';
import { BoostRequest, Habit, UserProfile } from '../types';

interface AdminViewProps {
    requests: BoostRequest[];
    habits: Habit[];
    users: UserProfile[];
    onApprove: (requestId: string) => void;
    onReject: (requestId: string) => void;
    t: (key: string) => string;
}

const AdminView: React.FC<AdminViewProps> = ({ requests, habits, users, onApprove, onReject, t }) => {
    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <div className="flex-1 p-6 overflow-y-auto animate-fade-in flex flex-col">
            <h2 className="text-3xl font-bold text-text-primary dark:text-neutral-200 mb-6">
                {t('pendingVerifications')}
            </h2>
            {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                    {pendingRequests.map(request => {
                        const habit = habits.find(h => h.id === request.habitId);
                        const user = users.find(u => u.id === request.userId);

                        if (!habit || !user) return null;

                        return (
                            <div key={request.id} className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 p-4 flex flex-col md:flex-row md:items-start gap-4">
                                <div className="md:w-1/2">
                                    <h3 className="font-bold text-lg text-text-primary dark:text-neutral-200">{habit.name}</h3>
                                    <p className="text-sm text-text-secondary dark:text-neutral-400">
                                        {t('submittedBy')}: <span className="font-medium text-text-primary dark:text-neutral-300">{user.name}</span>
                                    </p>
                                    <p className="text-xs text-text-secondary dark:text-neutral-500 mt-1">{new Date(request.timestamp).toLocaleString()}</p>
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => onApprove(request.id)}
                                            className="px-4 py-2 rounded-lg font-semibold bg-green-500 text-sm text-white hover:bg-green-600 transition-colors"
                                        >
                                            {t('approve')}
                                        </button>
                                        <button
                                            onClick={() => onReject(request.id)}
                                            className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-sm text-white hover:bg-red-600 transition-colors"
                                        >
                                            {t('reject')}
                                        </button>
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                     <label className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('proofOfPayment')}</label>
                                     <a href={request.proofImage} target="_blank" rel="noopener noreferrer">
                                        <img src={request.proofImage} alt="Proof of payment" className="w-full h-auto max-h-60 object-contain rounded-lg bg-gray-100 dark:bg-neutral-800 border dark:border-neutral-700 cursor-pointer" />
                                     </a>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center text-text-secondary dark:text-neutral-400 py-20">
                    <p className="text-lg font-bold">{t('noPendingVerifications')}</p>
                </div>
            )}
        </div>
    );
};

export default AdminView;
