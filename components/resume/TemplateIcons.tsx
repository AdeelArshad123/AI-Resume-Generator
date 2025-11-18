import React from 'react';

const iconProps = {
    className: "w-5 h-5 mr-3 inline-block text-primary",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5
};

// Fix: Define props for icon components to allow passing the style prop from React.cloneElement.
export interface IconComponentProps {
    style?: React.CSSProperties;
}

export const UserIcon: React.FC<IconComponentProps> = (props) => (
    <svg {...iconProps} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
);

export const SparklesIcon: React.FC<IconComponentProps> = (props) => (
    <svg {...iconProps} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.684-2.684l-1.938-.648 1.938-.648a3.375 3.375 0 002.684-2.684l.648-1.938.648 1.938a3.375 3.375 0 002.684 2.684l1.938.648-1.938.648a3.375 3.375 0 00-2.684 2.684z" /></svg>
);

export const BriefcaseIcon: React.FC<IconComponentProps> = (props) => (
    <svg {...iconProps} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.05a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.85a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25v.75M2.25 9l8.25-3 8.25 3" /></svg>
);

export const GraduationCapIcon: React.FC<IconComponentProps> = (props) => (
    <svg {...iconProps} {...props}><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A48.627 48.627 0 0112 10.904a48.627 48.627 0 018.232 4.41l-2.072 1.036m-15.482 0l-2.072 1.036A48.627 48.627 0 0112 10.904a48.627 48.627 0 018.232 4.41l2.072-1.036" /></svg>
);

export const AwardIcon: React.FC<IconComponentProps> = (props) => (
    <svg {...iconProps} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0zM16.5 18.75a9 9 0 00-9 0m9 0a9 9 0 01-9 0m9 0v-4.5m-4.5 4.5v-4.5m-4.5 0v4.5m0 0v-4.5m4.5 0v-4.5m9 4.5v-4.5m-9 0h9" /></svg>
);