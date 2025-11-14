
import React, { useState, useEffect } from 'react';
import { Logo } from './Icons';
import { Language } from '../types';

interface LandingPageProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    t: (key: string) => string;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick, language, onLanguageChange, t }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title1: language === 'id' ? 'Sulit Konsisten?' : 'Struggle with Consistency?',
            title2: language === 'id' ? 'Kamu Tidak Sendiri.' : "You're Not Alone.",
            desc: language === 'id' 
                ? 'HabitComm membantu kamu membangun kebiasaan positif dengan kekuatan komunitas.'
                : 'HabitComm helps you build positive habits through the power of community.'
        },
        {
            title1: language === 'id' ? 'HabitComm Hadir' : 'HabitComm is Here',
            title2: language === 'id' ? 'Teman Perjalananmu.' : "Your Journey Partner.",
            desc: language === 'id'
                ? 'Platform sosial berbasis tugas untuk akuntabilitas bersama dan dukungan kolektif.'
                : 'A task-based social platform for shared accountability and collective support.'
        },
        {
            title1: language === 'id' ? 'Mulai Kecil,' : 'Start Small,',
            title2: language === 'id' ? 'Hasil Luar Biasa.' : "Win Big Results.",
            desc: language === 'id'
                ? 'Satu kebiasaan baik hari ini adalah fondasi kesuksesan besar di masa depan.'
                : 'One good habit today is the foundation for massive success in the future.'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        // Enforce fixed height on all screens to prevent scroll
        <div className="h-[100dvh] w-full bg-gradient-to-br from-[#ef4444] via-[#dc2626] to-[#7f1d1d] text-white flex flex-col font-sans selection:bg-white selection:text-[#ef4444] relative overflow-hidden">
           
           {/* Decorative Background Blobs */}
           <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4 mix-blend-overlay"></div>
           <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-black/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

           {/* Nav - Compact height */}
           <nav className="flex-shrink-0 flex items-center justify-between px-6 py-3 lg:py-5 max-w-7xl mx-auto w-full z-20">
                <div className="flex items-center gap-3">
                    <Logo className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg shadow-sm" />
                    <span className="text-lg lg:text-xl font-bold tracking-tight text-white drop-shadow-md">HabitComm</span>
                </div>
                 <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                        onClick={() => onLanguageChange(language === 'id' ? 'en' : 'id')} 
                        className="text-[10px] lg:text-xs font-bold text-red-100 hover:text-white transition-colors uppercase tracking-wider bg-white/10 px-2 py-1 lg:px-3 lg:py-1.5 rounded-md"
                    >
                        {language === 'id' ? 'EN' : 'ID'}
                    </button>
                 </div>
           </nav>

           {/* Main Content */}
           <main className="flex-1 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-2 lg:gap-4 px-6 pb-16 lg:pb-0 items-center relative z-10 h-full content-center">

                {/* Left Column: Copy & CTA */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-3 lg:space-y-6 lg:pr-4 order-2 lg:order-1 text-center lg:text-left relative z-30 mt-8 sm:mt-0">
                    <div className="space-y-2 lg:space-y-5 flex flex-col items-center lg:items-start">
                        
                        {/* Static Badge */}
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 lg:px-3 lg:py-1 rounded-full bg-white/20 border border-white/20 text-[9px] sm:text-xs font-bold text-white w-fit shadow-sm backdrop-blur-md mb-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            {language === 'id' ? 'Komunitas #1 Untuk Produktivitas' : '#1 Community for Productivity'}
                        </div>

                        {/* Dynamic Slider Content */}
                        <div className="min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] flex flex-col justify-center">
                            {slides.map((slide, index) => (
                                index === currentSlide && (
                                    <div key={index} className="animate-fade-in">
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight drop-shadow-sm">
                                            {slide.title1} <br className="hidden lg:block"/> 
                                            <span className="text-red-100 block lg:inline"> {slide.title2}</span>
                                        </h1>
                                        <p className="text-red-50 text-xs sm:text-base lg:text-lg leading-relaxed max-w-xs sm:max-w-md font-medium opacity-95 mx-auto lg:mx-0 mt-3 lg:mt-4">
                                            {slide.desc}
                                        </p>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Slider Dots */}
                        <div className="flex items-center gap-2 pb-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        currentSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        {/* Compact Pain Points Row - HIDDEN ON MOBILE */}
                        <div className="hidden sm:flex flex-wrap gap-2 pt-1">
                            {[
                                { icon: '😔', label: language === 'id' ? 'Kurang Motivasi' : 'Lack Motivation', color: 'bg-orange-500/20 text-orange-100' },
                                { icon: '📅', label: language === 'id' ? 'Sering Berhenti' : 'Falling Off', color: 'bg-red-500/20 text-red-100' },
                                { icon: '❓', label: language === 'id' ? 'Butuh Teman' : 'Need Tribe', color: 'bg-blue-500/20 text-blue-100' },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-sm transition-colors ${item.color}`}>
                                    <span className="text-base drop-shadow-md">{item.icon}</span>
                                    <span className="text-[11px] font-bold">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2 lg:pt-4 w-full sm:w-auto mb-6 lg:mb-0">
                            {/* Masuk Button */}
                            <button 
                                onClick={onLoginClick} 
                                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base flex items-center justify-center backdrop-blur-sm"
                            >
                                {language === 'id' ? 'Masuk' : 'Log In'}
                            </button>

                            {/* Daftar Gratis Button */}
                            <button 
                                onClick={onRegisterClick} 
                                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#dc2626] px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-black/20 transition-all transform hover:-translate-y-1 text-sm sm:text-base flex items-center justify-center gap-2"
                            >
                                <span>{language === 'id' ? 'Daftar Gratis' : 'Sign Up Free'}</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="pt-4 lg:pt-8 border-t border-white/10 hidden lg:flex flex-wrap items-center gap-6 text-xs sm:text-sm text-red-200/80 font-medium">
                        <span>© 2025 HabitComm</span>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>

                {/* Right Column: Visual Composition */}
                <div className="lg:col-span-7 relative w-full h-auto flex items-center justify-center lg:justify-end order-1 lg:order-2 -mt-6 lg:mt-0">
                    
                    {/* Image Container - Significantly smaller on mobile */}
                    <div className="relative w-full max-w-[240px] sm:max-w-[350px] lg:max-w-[580px] xl:max-w-[650px] aspect-video lg:aspect-[16/10] xl:aspect-video">
                        
                        {/* Glass/Border Frame */}
                        <div className="absolute inset-0 bg-white/10 rounded-[1.5rem] lg:rounded-[2rem] transform rotate-2 scale-[1.02]"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-[1.3rem] lg:rounded-[1.8rem] border border-white/20 shadow-2xl overflow-hidden p-1.5 lg:p-2">
                             
                             {/* Inner Image Container */}
                             <div className="w-full h-full rounded-[1rem] lg:rounded-[1.4rem] overflow-hidden relative bg-neutral-800 group">
                                 <img src="https://imgur.com/CRKlyet.jpg" className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700" alt="Community" />
                                 
                                 {/* Overlay Gradient */}
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#7f1d1d] via-transparent to-transparent opacity-90"></div>
                                 
                                 {/* Content on Image */}
                                 <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
                                    <div className="transform translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-2 lg:gap-4">
                                             <div className="flex -space-x-2 lg:-space-x-3">
                                                <img src="https://i.pravatar.cc/100?u=5" className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-[#7f1d1d]" alt="User" />
                                                <img src="https://i.pravatar.cc/100?u=8" className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-[#7f1d1d]" alt="User" />
                                                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-[#7f1d1d] bg-white/90 text-[#7f1d1d] flex items-center justify-center text-[9px] lg:text-[10px] font-bold shadow-sm">+2k</div>
                                             </div>
                                             <div className="flex flex-col">
                                                <span className="text-[10px] lg:text-xs text-white font-bold">Joined recently</span>
                                                <span className="text-[9px] lg:text-[10px] text-white/70 hidden sm:inline">Start your journey</span>
                                             </div>
                                        </div>
                                    </div>
                                 </div>
                             </div>
                        </div>

                        {/* Floating Widget: Daily Habit (Top Left) - Scaled Down on Mobile */}
                        <div className="absolute -top-6 lg:-top-8 -left-2 sm:-left-8 lg:-left-10 bg-white text-gray-900 p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-40 lg:w-44 transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-20 animate-fade-in origin-bottom-right scale-[0.7] sm:scale-100" style={{animationDelay: '0.2s'}}>
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-[9px] lg:text-[10px] font-bold uppercase text-gray-400 tracking-wider">DAILY HABIT</span>
                                 <div className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"></div>
                             </div>
                             <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                                 <span className="text-lg lg:text-2xl">🏃‍♂️</span>
                                 <span className="font-bold text-xs lg:text-sm text-gray-800">Running 5K</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                 <div className="bg-[#ef4444] h-full rounded-full w-[75%]"></div>
                             </div>
                        </div>

                        {/* Floating Widget: Event (Bottom Right) - Scaled Down on Mobile */}
                        <div className="absolute -bottom-6 lg:-bottom-10 -right-2 sm:-right-6 lg:-right-10 bg-white text-gray-900 p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-48 lg:w-52 transform rotate-3 hover:rotate-0 transition-transform duration-300 z-20 animate-fade-in origin-top-left scale-[0.7] sm:scale-100" style={{animationDelay: '0.4s'}}>
                             <div className="flex gap-2 lg:gap-3 items-center border-b border-gray-100 pb-2 lg:pb-3 mb-2 lg:mb-3">
                                <div className="bg-orange-50 text-orange-600 rounded-xl px-2 lg:px-3 py-1 lg:py-1.5 text-center min-w-[40px] lg:min-w-[48px]">
                                    <span className="block text-[8px] lg:text-[9px] font-bold opacity-80">AUG</span>
                                    <span className="block text-base lg:text-lg font-extrabold leading-none">24</span>
                                </div>
                                <div>
                                    <p className="text-xs lg:text-sm font-extrabold leading-tight text-gray-800">Morning Run JKT</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-gray-400 text-[10px] lg:text-xs">📍</span>
                                        <p className="text-[10px] lg:text-[11px] text-gray-500 font-medium">GBK Senayan</p>
                                    </div>
                                </div>
                             </div>
                             <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 text-[10px] lg:text-xs font-bold py-1.5 lg:py-2 rounded-lg transition-colors">
                                 Join Event
                             </button>
                        </div>

                    </div>
                </div>
           </main>
        </div>
    );
};

export default LandingPage;
