import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    errorMessage?: string;
}

const Textarea: React.FC<TextareaProps> = ({ error, errorMessage, className, ...props }) => {
    return (
        <div className="relative">
            <textarea
                {...props}
                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm resize-y transition-all duration-200
                ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-primary focus:border-primary'}
                ${className}`}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${props.id}-error` : undefined}
            />
            {error && errorMessage && (
                <p id={`${props.id}-error`} className="text-xs text-red-500 mt-1" aria-live="polite">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Textarea;