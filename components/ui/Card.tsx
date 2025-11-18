import React from 'react';

// FIX: Extend from React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
    return (
        // FIX: Spread the rest of the props onto the div element.
        <div className={`bg-surface p-6 rounded-lg shadow-lg transition-shadow duration-300 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
