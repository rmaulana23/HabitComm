
import React from 'react';

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a.75.75 0 010-1.113zM12.001 18C7.899 18 4.109 15.425 2.68 12c1.43-3.425 5.22-6 9.322-6s7.892 2.575 9.322 6c-1.429 3.425-5.22 6-9.322 6z" clipRule="evenodd" />
  </svg>
);
  
export const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
    <path d="M15.75 12c0 .18-.013.357-.037.53l-1.5-1.5A3.75 3.75 0 0012 8.25c-1.05 0-1.973.44-2.633 1.148l-1.521-1.521A11.222 11.222 0 0112 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113a11.248 11.248 0 01-2.63 4.31zM4.717 14.555A11.22 11.22 0 011.323 12.447a.75.75 0 010-1.113C2.811 6.976 7.028 3.75 12.001 3.75a11.248 11.248 0 014.242.827l-1.522 1.522a3.75 3.75 0 00-4.241 4.241L4.717 14.555z" />
  </svg>
);

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({ icon, ...props }) => (
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

export const AuthButton: React.FC<AuthButtonProps> = ({ loading, children, ...props }) => (
    <button 
        {...props}
        disabled={loading || props.disabled}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 dark:disabled:bg-primary-700/50 flex items-center justify-center"
    >
        {loading ? <SpinnerIcon className="h-5 w-5" /> : children}
    </button>
);
