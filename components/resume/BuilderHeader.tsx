import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UndoRedoControls from './UndoRedoControls';
import ResumeExport from './ResumeExport';
import { useResume } from '../../hooks/useResume';
import { ResumeData } from '../../types';

// Icon components for clarity and reusability within this file
const SaveIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CloudDownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
);


const BuilderHeader: React.FC = () => {
    const { resumeData, setResumeData } = useResume();
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [hasSavedResume, setHasSavedResume] = useState(false);
    const [loadFeedback, setLoadFeedback] = useState<string | null>(null);

    useEffect(() => {
        // Check if a resume exists in localStorage on mount
        const savedData = localStorage.getItem('resumeCraftAIData');
        setHasSavedResume(!!savedData);
    }, []);

    const handleSave = () => {
        if (!resumeData || !resumeData.contact.name) {
            // Avoid saving empty/initial resume
            return;
        }
        setSaveState('saving');
        // Simulate network delay
        setTimeout(() => {
            localStorage.setItem('resumeCraftAIData', JSON.stringify(resumeData));
            setHasSavedResume(true); // Update state to enable load button
            setSaveState('saved');
            setTimeout(() => {
                setSaveState('idle');
            }, 2000);
        }, 500);
    };

    const handleLoadLastSaved = () => {
        const savedData = localStorage.getItem('resumeCraftAIData');
        if (savedData) {
            try {
                const parsedData: ResumeData = JSON.parse(savedData);
                setResumeData(parsedData);
                setLoadFeedback('Last saved resume loaded!');
            } catch (error) {
                console.error("Failed to parse saved resume data:", error);
                setLoadFeedback('Failed to load resume: Corrupted data.');
            }
        } else {
            setLoadFeedback('No saved resume found.');
        }
        setTimeout(() => setLoadFeedback(null), 3000); // Clear feedback
    };
    
    const getSaveButtonContent = () => {
        switch (saveState) {
            case 'saving':
                return 'Saving...';
            case 'saved':
                return (
                    <>
                        <CheckIcon className="h-5 w-5 md:mr-2" />
                        <span className="hidden md:inline">Saved</span>
                    </>
                );
            default:
                return (
                    <>
                        <SaveIcon className="h-5 w-5 md:mr-2" />
                        <span className="hidden md:inline">Save</span>
                    </>
                );
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-sm z-30">
            <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-2 text-lg font-bold font-heading text-gradient" title="Back to Dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">ResumeCraft AI</span>
                    </Link>
                </div>
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 justify-end">
                    <UndoRedoControls />
                    <button
                        onClick={handleLoadLastSaved}
                        disabled={!hasSavedResume}
                        className={`bg-white text-slate-700 px-3 md:px-4 py-2 rounded-md font-semibold hover:bg-slate-50 border border-slate-300 transition-all text-sm flex items-center ${!hasSavedResume ? 'opacity-70 cursor-not-allowed' : ''}`}
                        title="Load Last Saved Resume"
                    >
                         <CloudDownloadIcon className="h-5 w-5 md:mr-2" />
                        <span className="hidden md:inline">Load Last Saved</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveState !== 'idle'}
                        className="bg-white text-slate-700 px-3 md:px-4 py-2 rounded-md font-semibold hover:bg-slate-50 border border-slate-300 transition-all text-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        title="Save Progress"
                    >
                        {getSaveButtonContent()}
                    </button>
                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                    <ResumeExport />
                </div>
            </div>
            {loadFeedback && (
                <div className={`absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-md text-sm ${loadFeedback.includes('loaded') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} animate-fade-in`}>
                    {loadFeedback}
                </div>
            )}
        </header>
    );
};

export default BuilderHeader;