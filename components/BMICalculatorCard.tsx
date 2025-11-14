
import React, { useState } from 'react';

interface BMICalculatorCardProps {
    t: (key: string) => string;
}

const BMICalculatorCard: React.FC<BMICalculatorCardProps> = ({ t }) => {
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [bmi, setBmi] = useState<number | null>(null);
    const [category, setCategory] = useState<string>('');
    const [idealMin, setIdealMin] = useState<number | null>(null);
    const [idealMax, setIdealMax] = useState<number | null>(null);

    const calculateBMI = () => {
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return;

        const heightInMeters = h / 100;
        const calculatedBMI = w / (heightInMeters * heightInMeters);
        setBmi(parseFloat(calculatedBMI.toFixed(1)));

        let cat = '';
        if (calculatedBMI < 18.5) cat = t('underweight');
        else if (calculatedBMI < 24.9) cat = t('normal');
        else if (calculatedBMI < 29.9) cat = t('overweight');
        else cat = t('obese');
        setCategory(cat);

        // Ideal weight range based on BMI 18.5 - 24.9
        const minWeight = 18.5 * (heightInMeters * heightInMeters);
        const maxWeight = 24.9 * (heightInMeters * heightInMeters);
        setIdealMin(parseFloat(minWeight.toFixed(1)));
        setIdealMax(parseFloat(maxWeight.toFixed(1)));
    };

    const getCategoryColor = () => {
        if (category === t('normal')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-border-color dark:border-neutral-800 p-4">
            <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">⚖️</span>
                <h3 className="text-lg font-bold text-text-primary dark:text-neutral-200">{t('bmiCalculator')}</h3>
            </div>

            <div className="flex space-x-3 mb-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-text-secondary dark:text-neutral-400 mb-1">{t('heightCm')}</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-200 p-2 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-text-secondary dark:text-neutral-400 mb-1">{t('weightKg')}</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-neutral-800 dark:text-neutral-200 p-2 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
            </div>

            <button
                onClick={calculateBMI}
                className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm mb-4"
            >
                {t('calculate')}
            </button>

            {bmi !== null && (
                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-3 space-y-2 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary dark:text-neutral-400">{t('yourBMI')}</span>
                        <span className="text-xl font-bold text-text-primary dark:text-neutral-200">{bmi}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary dark:text-neutral-400">{t('category')}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getCategoryColor()}`}>
                            {category}
                        </span>
                    </div>
                    {idealMin !== null && idealMax !== null && (
                        <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                            <p className="text-xs text-center text-text-secondary dark:text-neutral-400 mb-1">{t('idealWeight')}</p>
                            <p className="text-center font-bold text-primary dark:text-primary-400">
                                {idealMin} - {idealMax} kg
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BMICalculatorCard;
