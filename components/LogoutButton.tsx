import React, { useState } from 'react';
import LogoutModal from './LogoutModal';

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onLogout: () => void;
    t: (key: string) => string;
    onActionStart?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, t, onActionStart, children, ...props }) => {
    const [showModal, setShowModal] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (props.onClick) props.onClick(e);
        if (onActionStart) onActionStart();
        setShowModal(true);
    };

    const handleConfirm = () => {
        setShowModal(false);
        onLogout();
    };

    return (
        <>
            <button type="button" {...props} onClick={handleClick}>
                {children}
            </button>
            {showModal && <LogoutModal onClose={() => setShowModal(false)} onConfirm={handleConfirm} t={t} />}
        </>
    );
};

export default LogoutButton;