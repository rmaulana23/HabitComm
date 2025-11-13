import React, { useState, useEffect } from 'react';
import { Habit } from '../types';

interface BoostHabitModalProps {
    habit: Habit;
    onClose: () => void;
    onSubmit: (proofImageFile: File) => void;
    t: (key: string) => string;
}

const BoostHabitModal: React.FC<BoostHabitModalProps> = ({ habit, onClose, onSubmit, t }) => {
    const [proofImageFile, setProofImageFile] = useState<File | null>(null);
    const [proofImagePreview, setProofImagePreview] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    useEffect(() => {
        // Cleanup function to revoke object URL
        return () => {
            if (proofImagePreview) {
                URL.revokeObjectURL(proofImagePreview);
            }
        };
    }, [proofImagePreview]);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProofImageFile(file);
            if (proofImagePreview) {
                URL.revokeObjectURL(proofImagePreview);
            }
            setProofImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (proofImageFile) {
            onSubmit(proofImageFile);
            setIsSubmitted(true);
            setTimeout(onClose, 3000); // Close modal after 3 seconds
        }
    };
    
    if (isSubmitted) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col items-center text-center">
                     <span className="text-5xl mb-4">✅</span>
                     <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200">{t('paymentSubmitted')}</h2>
                     <p className="text-text-secondary dark:text-neutral-400 mt-2">{t('paymentSubmittedDesc')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-text-primary dark:text-neutral-200 mb-2">{t('boostYourHabit')}</h2>
                <p className="text-text-secondary dark:text-neutral-400 mb-6">{t('boostDescription')}</p>
                
                <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700 space-y-3 mb-4">
                    <h3 className="font-bold text-text-primary dark:text-neutral-200">{t('paymentDetails')}</h3>
                    <div className="flex justify-between">
                        <span className="text-text-secondary dark:text-neutral-400">{t('bankName')}</span>
                        <span className="font-semibold text-text-primary dark:text-neutral-300">BCA</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-secondary dark:text-neutral-400">{t('accountNumber')}</span>
                        <span className="font-semibold text-text-primary dark:text-neutral-300">1671 291 391</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-secondary dark:text-neutral-400">{t('transferAmount')}</span>
                        <span className="font-semibold text-text-primary dark:text-neutral-300">Rp29.000</span>
                    </div>
                </div>

                <div>
                    <label htmlFor="proof-upload" className="block text-sm font-bold text-text-primary dark:text-neutral-300 mb-2">{t('uploadProof')}</label>
                    <input
                        id="proof-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-gray-500 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-500/20 file:text-primary dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-500/30"
                    />
                </div>

                {proofImagePreview && (
                    <div className="mt-4">
                        <img src={proofImagePreview} alt="Proof preview" className="w-full h-40 object-contain rounded-lg bg-gray-100 dark:bg-neutral-800" />
                    </div>
                )}

                <p className="text-center text-xs text-text-secondary dark:text-neutral-500 mt-4">{t('afterPaymentInfo')}</p>
                
                 <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-border-color dark:border-neutral-800">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-bold text-text-secondary dark:text-neutral-300">
                        {t('cancel')}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={!proofImageFile}
                        className="px-8 py-2 rounded-lg bg-primary hover:bg-primary-600 transition-colors text-white font-bold shadow-md hover:shadow-lg disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
                    >
                        {t('submit')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoostHabitModal;