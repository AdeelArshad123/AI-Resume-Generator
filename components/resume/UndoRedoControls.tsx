import React from 'react';
import { useResume } from '../../hooks/useResume';

const UndoIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const RedoIcon: React.FC<{className?: string}> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);


const UndoRedoControls: React.FC = () => {
    const { undo, redo, canUndo, canRedo } = useResume();

    const buttonClass = "p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const enabledClass = "bg-white hover:bg-slate-100 text-text-main border border-slate-300";
    const disabledClass = "bg-white/50 text-slate-400 border border-slate-200";

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={undo}
                disabled={!canUndo}
                className={`${buttonClass} ${canUndo ? enabledClass : disabledClass}`}
                aria-label="Undo last change"
                title="Undo"
            >
                <UndoIcon className="h-5 w-5" />
            </button>
            <button
                onClick={redo}
                disabled={!canRedo}
                className={`${buttonClass} ${canRedo ? enabledClass : disabledClass}`}
                aria-label="Redo last change"
                title="Redo"
            >
                <RedoIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default UndoRedoControls;