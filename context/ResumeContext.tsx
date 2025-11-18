import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ResumeData, Suggestion, AtsCheck, JobMatchAnalysisResult, ThemeCustomization } from '../types';
import { getAtsSuggestions, analyzeResumeAgainstJobDescription } from '../services/geminiService';
import { debounce } from 'lodash';
import { useHistoryState } from '../hooks/useHistoryState';
import { useAuth } from './AuthContext';

// Initial state for a new resume
const initialResumeData: ResumeData = {
    contact: {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
        photoUrl: '',
    },
    professionalSummary: '',
    workExperience: [],
    skills: [],
    education: [],
    awardsAndCertifications: [],
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'awards'],
    theme: {
        fontFamily: 'Inter',
        primaryColor: '#0ea5e9', // Default: sky-500
        fontSize: 'md',
        fontWeight: 'regular',
    },
    selectedTemplate: 'classic',
};

const getInitialState = (): ResumeData => {
    try {
        const savedThemeJSON = localStorage.getItem('resumeCraftAITheme');
        if (savedThemeJSON) {
            const savedTheme = JSON.parse(savedThemeJSON);
            if (savedTheme && typeof savedTheme === 'object') {
                return {
                    ...initialResumeData,
                    theme: { ...initialResumeData.theme, ...savedTheme }
                };
            }
        }
    } catch (error) {
        console.error("Failed to load theme from localStorage:", error);
    }
    return initialResumeData;
};


interface SuggestionTarget {
    section: 'summary' | 'workExperience';
    field: string;
    index?: number;
}

interface ResumeContextType {
    resumeData: ResumeData;
    setResumeData: (newState: ResumeData | ((prevState: ResumeData) => ResumeData)) => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    atsScore: number;
    setAtsScore: React.Dispatch<React.SetStateAction<number>>;
    suggestions: Suggestion[];
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
    atsChecks: AtsCheck[];
    contextualSuggestions: Suggestion[];
    setContextualSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
    suggestionTarget: SuggestionTarget | null;
    setSuggestionTarget: React.Dispatch<React.SetStateAction<SuggestionTarget | null>>;
    isContextualLoading: boolean;
    setIsContextualLoading: React.Dispatch<React.SetStateAction<boolean>>;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    selectedTemplate: string;
    setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
    jobMatchAnalysisResult: JobMatchAnalysisResult | null;
    isJobMatchLoading: boolean;
    analyzeJobMatch: (jobDescription: string) => Promise<void>;
    updateTheme: (updates: Partial<ThemeCustomization>) => void;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

interface ResumeProviderProps {
    children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
    const { 
        state: resumeData, 
        setState: setResumeData,
        undo,
        redo,
        canUndo,
        canRedo,
        reset: resetHistory
    } = useHistoryState<ResumeData>(getInitialState());

    const [isLoading, setIsLoading] = useState(false);
    const [atsScore, setAtsScore] = useState(0);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [atsChecks, setAtsChecks] = useState<AtsCheck[]>([]);

    // State for contextual (inline) suggestions
    const [contextualSuggestions, setContextualSuggestions] = useState<Suggestion[]>([]);
    const [suggestionTarget, setSuggestionTarget] = useState<SuggestionTarget | null>(null);
    const [isContextualLoading, setIsContextualLoading] = useState(false);

    // State for Job Match Analysis
    const [jobMatchAnalysisResult, setJobMatchAnalysisResult] = useState<JobMatchAnalysisResult | null>(null);
    const [isJobMatchLoading, setIsJobMatchLoading] = useState(false);
    
    const { isAuthenticated } = useAuth();

    const resetResumeData = useCallback(() => {
        // When resetting, we go back to the default state, not the localStorage one.
        // FIX: The `resetHistory` function from `useHistoryState` does not take any arguments; it resets to its initial state.
        resetHistory();
        setAtsScore(0);
        setSuggestions([]);
        setAtsChecks([]);
        setContextualSuggestions([]);
        setSuggestionTarget(null);
        setJobMatchAnalysisResult(null);
    }, [resetHistory]);

    // Effect to reset state on logout
    useEffect(() => {
        if (!isAuthenticated) {
            resetResumeData();
        }
    }, [isAuthenticated, resetResumeData]);

    const setSelectedTemplate = (value: React.SetStateAction<string>) => {
        setResumeData(prev => {
            const newTemplate = typeof value === 'function' ? value(prev.selectedTemplate) : value;
            return {
                ...prev,
                selectedTemplate: newTemplate,
            };
        });
    };
    
    // Debounced function to fetch ATS suggestions
    const debouncedGetAtsSuggestions = React.useCallback(
        debounce(async (data: ResumeData) => {
            // Check if resume has enough data to be analyzed
            if (!data.professionalSummary && data.workExperience.length === 0) {
                setAtsScore(0);
                setSuggestions([]);
                setAtsChecks([]);
                return;
            }
            try {
                const { score, suggestions: newSuggestions } = await getAtsSuggestions(data);
                setAtsScore(score);
                setSuggestions(newSuggestions);
                
                // Simple logic to derive checks from score for UI feedback
                const checks: AtsCheck[] = [
                    { id: 'check-1', text: 'Uses strong action verbs', passed: score > 60 },
                    { id: 'check-2', text: 'Includes quantifiable results', passed: score > 75 },
                    { id: 'check-3', text: 'Summary is concise and impactful', passed: data.professionalSummary.length > 50 && data.professionalSummary.split(' ').length < 100 },
                    { id: 'check-4', text: 'Contains relevant keywords for the role', passed: score > 80 },
                    { id: 'check-5', text: 'Formatted for ATS readability', passed: true }, // Assume true for now
                ];
                setAtsChecks(checks);

            } catch (error) {
                console.error("Failed to fetch ATS suggestions:", error);
                // Set some default state on error
                setAtsScore(0);
                setSuggestions([{ id: 'err-sugg', text: 'Could not fetch AI suggestions.' }]);
                setAtsChecks([]);
            }
        }, 1500), // 1.5 second debounce delay
        []
    );

    useEffect(() => {
        // When the landing page populates the data, it's captured here
        // We use the `present` state from our history hook
        if (resumeData && resumeData.contact.name) {
            debouncedGetAtsSuggestions(resumeData);
        }
    }, [resumeData, debouncedGetAtsSuggestions]);

    const analyzeJobMatch = async (jobDescription: string) => {
        setIsJobMatchLoading(true);
        setJobMatchAnalysisResult(null);
        try {
            const result = await analyzeResumeAgainstJobDescription(resumeData, jobDescription);
            setJobMatchAnalysisResult(result);
        } catch (error) {
            console.error("Job Match Analysis failed:", error);
            // Optionally set an error state to show in the UI
        } finally {
            setIsJobMatchLoading(false);
        }
    };

    const updateTheme = (updates: Partial<ThemeCustomization>) => {
        setResumeData(prev => {
            const newTheme = {
                ...prev.theme,
                ...updates,
            };
            try {
                localStorage.setItem('resumeCraftAITheme', JSON.stringify(newTheme));
            } catch (error) {
                console.error("Failed to save theme to localStorage:", error);
            }
            return {
                ...prev,
                theme: newTheme,
            };
        });
    };


    return (
        <ResumeContext.Provider value={{
            resumeData,
            setResumeData,
            isLoading,
            setIsLoading,
            atsScore,
            setAtsScore,
            suggestions,
            setSuggestions,
            atsChecks,
            contextualSuggestions,
            setContextualSuggestions,
            suggestionTarget,
            setSuggestionTarget,
            isContextualLoading,
            setIsContextualLoading,
            undo,
            redo,
            canUndo,
            canRedo,
            selectedTemplate: resumeData.selectedTemplate,
            setSelectedTemplate,
            jobMatchAnalysisResult,
            isJobMatchLoading,
            analyzeJobMatch,
            updateTheme,
        }}>
            {children}
        </ResumeContext.Provider>
    );
};