import React, { useState, useCallback } from 'react';
import { useResume } from '../../hooks/useResume';
import CircularProgress from '../ui/CircularProgress';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { getSuggestionsForText, generateLinkedInProfileContent } from '../../services/geminiService';
import { LinkedInProfileContent, LinkedInImportedProfileData } from '../../types';
import { importFromLinkedIn } from '../../services/linkedinService';
import LinkedInImportModal from './LinkedInImportModal';

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const KeywordPill: React.FC<{ keyword: string, type: 'match' | 'missing' }> = ({ keyword, type }) => {
    const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full";
    const typeClasses = {
        match: "bg-emerald-100 text-emerald-800",
        missing: "bg-amber-100 text-amber-800",
    };
    return <span className={`${baseClasses} ${typeClasses[type]}`}>{keyword}</span>
};

// Helper Hook for copy-to-clipboard functionality
const useCopyToClipboard = (): [boolean, (text: string) => void] => {
    const [isCopied, setIsCopied] = useState(false);

    const copy = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        });
    }, []);

    return [isCopied, copy];
};

// Reusable Copy Button Component
const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [isCopied, copy] = useCopyToClipboard();
    const CheckIconSmall: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
    const ClipboardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;

    return (
        <button onClick={() => copy(textToCopy)} className="text-xs font-semibold text-primary hover:opacity-80 disabled:opacity-50 flex items-center" disabled={isCopied}>
            {isCopied ? <CheckIconSmall/> : <ClipboardIcon />}
            <span className="ml-1">{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
    );
};

const LinkedInProfileOptimizer: React.FC = () => {
    const { resumeData, setResumeData } = useResume();
    const [content, setContent] = useState<LinkedInProfileContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // LinkedIn Import states
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importedLinkedInData, setImportedLinkedInData] = useState<LinkedInImportedProfileData | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setContent(null);
        try {
            const result = await generateLinkedInProfileContent(resumeData);
            setContent(result);
        } catch (err) {
            setError('Failed to generate content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportLinkedIn = async () => {
        setIsImportLoading(true);
        setImportError(null);
        setImportedLinkedInData(null);
        try {
            const data = await importFromLinkedIn();
            setImportedLinkedInData(data);
            setIsImportModalOpen(true);
        } catch (err) {
            setImportError('Failed to import LinkedIn profile. Please try again. (This feature is a simulation)');
            console.error(err);
        } finally {
            setIsImportLoading(false);
        }
    };

    const handleApplyImportedData = (dataToApply: Partial<LinkedInImportedProfileData>) => {
        setResumeData(prev => {
            const updatedResume = { ...prev };
            // Map imported fields to ResumeData structure
            if (dataToApply.contact) {
                updatedResume.contact = { ...prev.contact, ...dataToApply.contact };
            }
            if (dataToApply.aboutSection) {
                updatedResume.professionalSummary = dataToApply.aboutSection;
            }
            if (dataToApply.workExperience) {
                // Ensure new unique IDs for imported experiences
                const newExperiences = dataToApply.workExperience.map(exp => ({
                    id: `li-we-${Date.now()}-${Math.random()}`,
                    jobTitle: exp.jobTitle,
                    company: exp.company,
                    location: exp.location,
                    dates: exp.dates,
                    responsibilities: exp.description.split('\n').map(s => s.trim()).filter(s => s),
                }));
                updatedResume.workExperience = [...prev.workExperience, ...newExperiences];
            }
            if (dataToApply.education) {
                 const newEducation = dataToApply.education.map(edu => ({
                    id: `li-edu-${Date.now()}-${Math.random()}`,
                    degree: edu.degree + (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''),
                    institution: edu.institution,
                    location: 'N/A', // LinkedIn often doesn't give precise location, requires user input
                    dates: edu.dates,
                 }));
                 updatedResume.education = [...prev.education, ...newEducation];
            }
            if (dataToApply.skills) {
                // Merge new skills, avoiding duplicates
                updatedResume.skills = Array.from(new Set([...prev.skills, ...dataToApply.skills]));
            }
            return updatedResume;
        });
        setIsImportModalOpen(false);
        setImportedLinkedInData(null); // Clear imported data after applying
    };

    return (
        <Card className="border border-indigo-200">
            <h3 className="text-lg font-semibold font-heading text-text-main mb-2">LinkedIn Profile Suite</h3>
            <p className="text-sm text-text-muted mb-4">Generate optimized LinkedIn content or import your existing profile data.</p>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Button onClick={handleImportLinkedIn} disabled={isImportLoading} variant="secondary" className="flex-grow">
                    {isImportLoading ? <Spinner size="sm" /> : null}
                    <span className={isImportLoading ? 'ml-2' : ''}>
                        {isImportLoading ? 'Importing...' : 'Import from LinkedIn'}
                    </span>
                </Button>
                <Button onClick={handleGenerate} disabled={isLoading} className="flex-grow">
                    {isLoading ? <Spinner size="sm" color="white" /> : null}
                    <span className={isLoading ? 'ml-2' : ''}>
                        {isLoading ? 'Generating...' : 'Generate Profile Content'}
                    </span>
                </Button>
            </div>
            {importError && <p className="text-sm text-red-500 text-center mt-2">{importError}</p>}
            {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}

            {content && !isLoading && (
                <div className="mt-4 space-y-4 animate-fade-in">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-text-main text-sm">Headline</h4>
                            <CopyButton textToCopy={content.headline} />
                        </div>
                        <p className="bg-slate-100 p-3 rounded-md text-sm text-text-muted">{content.headline}</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-text-main text-sm">About Section</h4>
                            <CopyButton textToCopy={content.aboutSection} />
                        </div>
                        <div className="bg-slate-100 p-3 rounded-md text-sm text-text-muted whitespace-pre-line h-48 overflow-y-auto">
                            {content.aboutSection}
                        </div>
                    </div>
                     <Button onClick={handleGenerate} disabled={isLoading} variant="secondary" className="w-full mt-2 text-sm">
                        {isLoading ? <Spinner size="sm" /> : null}
                        <span className={isLoading ? 'ml-2' : ''}>Regenerate</span>
                    </Button>
                </div>
            )}

            {importedLinkedInData && (
                <LinkedInImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onApply={handleApplyImportedData}
                    initialData={importedLinkedInData}
                />
            )}
        </Card>
    );
};

const PortfolioGeneratorPlaceholder: React.FC = () => (
    <Card className="border border-purple-200">
        <h3 className="text-lg font-semibold font-heading text-text-main mb-2">AI Portfolio Builder</h3>
        <p className="text-sm text-text-muted mb-4">
            Coming soon: Generate a professional portfolio website directly from your resume content with customizable themes.
            Showcase your projects and achievements to potential employers effortlessly.
        </p>
        <Button variant="secondary" disabled className="w-full">
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-1-3m-6.75-7.75h10.5m-10.5 0a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-10.5 0L6 14m0 2H4.5A2.5 2.5 0 012 13.5v-2.5a2.5 2.5 0 012.5-2.5H6m4.5 9h-4.5m4.5 0a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zm-10.5 0L6 14m0 2H4.5A2.5 2.5 0 012 13.5v-2.5a2.5 2.5 0 012.5-2.5H6"/></svg>
                Generate Portfolio (Coming Soon)
            </span>
        </Button>
    </Card>
);

const JobMatchAnalyzer: React.FC = () => {
    const { analyzeJobMatch, jobMatchAnalysisResult, isJobMatchLoading, setResumeData, resumeData } = useResume();
    const [jobDescription, setJobDescription] = useState('');
    const [error, setError] = useState('');
    const [applyFeedback, setApplyFeedback] = useState<string | null>(null);

    const handleAnalyze = () => {
        if (!jobDescription.trim()) {
            setError('Please paste a job description first.');
            return;
        }
        setError('');
        setApplyFeedback(null);
        analyzeJobMatch(jobDescription);
    };

    const handleApplyTopSuggestion = () => {
        if (jobMatchAnalysisResult && jobMatchAnalysisResult.suggestions.length > 0) {
            const firstSuggestion = jobMatchAnalysisResult.suggestions[0].text;
            // A very simplified heuristic: if the suggestion is about the summary, apply it.
            if (firstSuggestion.toLowerCase().includes('summary') || firstSuggestion.toLowerCase().includes('professional statement')) {
                setResumeData(prev => ({ ...prev, professionalSummary: firstSuggestion }));
                setApplyFeedback('Top suggestion applied to Professional Summary!');
            } else {
                setApplyFeedback('Suggestion is too specific for automatic application. Please apply manually.');
            }
        } else {
            setApplyFeedback('No suggestions available to apply.');
        }
        setTimeout(() => setApplyFeedback(null), 3000); // Clear feedback after 3 seconds
    };


    return (
        <Card className="border border-primary/20">
            <h3 className="text-lg font-semibold font-heading text-text-main mb-2">Job Match Analysis</h3>
            <p className="text-sm text-text-muted mb-4">Paste a job description to see how well your resume matches and get tailored suggestions.</p>

            <div className="space-y-4">
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full h-40 p-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm resize-y"
                    placeholder="Paste the full job description here..."
                    disabled={isJobMatchLoading}
                />
                <Button onClick={handleAnalyze} disabled={isJobMatchLoading} className="w-full">
                    {isJobMatchLoading ? <Spinner size="sm" color="white" /> : null}
                    <span className={isJobMatchLoading ? 'ml-3' : ''}>
                        {isJobMatchLoading ? 'Analyzing...' : 'Analyze Match'}
                    </span>
                </Button>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </div>

            {isJobMatchLoading && (
                <div className="text-center py-8">
                    <Spinner />
                    <p className="mt-2 text-sm text-text-muted">Comparing your resume to the job description...</p>
                </div>
            )}

            {jobMatchAnalysisResult && !isJobMatchLoading && (
                <div className="mt-6 space-y-6 animate-fade-in">
                    <div className="flex justify-center">
                        <CircularProgress score={jobMatchAnalysisResult.matchScore} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-main mb-2">Tailored Suggestions</h4>
                        <ul className="space-y-2">
                            {jobMatchAnalysisResult.suggestions.map(suggestion => (
                                <li key={suggestion.id} className="bg-slate-100 p-3 rounded-md text-sm text-text-muted">
                                    {suggestion.text}
                                </li>
                            ))}
                        </ul>
                        {jobMatchAnalysisResult.suggestions.length > 0 && (
                            <div className="mt-4">
                                <Button onClick={handleApplyTopSuggestion} variant="secondary" className="w-full text-sm">
                                    Apply Top Suggestion (to Summary)
                                </Button>
                                {applyFeedback && (
                                    <p className={`mt-2 text-center text-sm ${applyFeedback.includes('Applied') ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {applyFeedback}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-main mb-2">Keyword Analysis</h4>
                        <div className="space-y-3">
                            <div>
                                <h5 className="text-sm text-emerald-600 mb-2 font-medium">Matching Keywords</h5>
                                <div className="flex flex-wrap gap-2">
                                    {jobMatchAnalysisResult.matchingKeywords.length > 0 ? jobMatchAnalysisResult.matchingKeywords.map(k => <KeywordPill key={k} keyword={k} type="match" />) : <p className="text-xs text-text-muted">No matching keywords found.</p>}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm text-amber-600 mb-2 font-medium">Missing Keywords</h5>
                                <div className="flex flex-wrap gap-2">
                                    {jobMatchAnalysisResult.missingKeywords.length > 0 ? jobMatchAnalysisResult.missingKeywords.map(k => <KeywordPill key={k} keyword={k} type="missing" />) : <p className="text-xs text-text-muted">Great job! No critical keywords seem to be missing.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}


const AiOptimizationHub: React.FC = () => {
    const {
        atsScore,
        atsChecks,
        suggestions,
        contextualSuggestions,
        setContextualSuggestions,
        suggestionTarget,
        setSuggestionTarget,
        setResumeData,
        isContextualLoading,
        setIsContextualLoading,
        resumeData
    } = useResume();
    const [selectedTone, setSelectedTone] = useState<string | null>(null);

     const handleFetchTonedSuggestions = async (tone: string) => {
        if (!suggestionTarget) return;

        setSelectedTone(tone);
        setIsContextualLoading(true);
        setContextualSuggestions([]); // Clear previous suggestions

        try {
            let textToImprove = '';
            let context = '';
            if (suggestionTarget.section === 'summary') {
                textToImprove = resumeData.professionalSummary;
                context = 'Professional Summary';
            } else if (suggestionTarget.section === 'workExperience' && suggestionTarget.index !== undefined) {
                textToImprove = resumeData.workExperience[suggestionTarget.index].responsibilities.join('\n');
                context = `Responsibilities for ${resumeData.workExperience[suggestionTarget.index].jobTitle}`;
            }

            if (textToImprove) {
                const suggestions = await getSuggestionsForText(textToImprove, context, tone);
                setContextualSuggestions(suggestions);
            }
        } catch (error) {
            console.error("Failed to get suggestions:", error);
            setContextualSuggestions([{ id: 'err-1', text: 'Could not load suggestions.' }]);
        } finally {
            setIsContextualLoading(false);
        }
    };

    const handleApplyContextualSuggestion = (suggestionText: string) => {
        if (!suggestionTarget) return;

        setResumeData(prev => {
            // Use a deep copy to avoid mutation issues
            const newData = JSON.parse(JSON.stringify(prev));

            if (suggestionTarget.section === 'summary') {
                newData.professionalSummary = suggestionText;
            } else if (suggestionTarget.section === 'workExperience' && suggestionTarget.index !== undefined) {
                newData.workExperience[suggestionTarget.index].responsibilities = suggestionText.split('\n').map(s => s.trim()).filter(s => s);
            }

            return newData;
        });

        // Clear contextual suggestions after applying
        setContextualSuggestions([]);
        setSuggestionTarget(null);
        setSelectedTone(null);
    };

    const handleDismissContextual = () => {
        setContextualSuggestions([]);
        setSuggestionTarget(null);
        setSelectedTone(null);
    };

    const tones = ['Impactful', 'Concise', 'Formal', 'Creative'];

    return (
        <div className="space-y-6">
            <LinkedInProfileOptimizer />

            <PortfolioGeneratorPlaceholder />

            <JobMatchAnalyzer />

            {/* MODIFIED Contextual Suggestions Card */}
            {suggestionTarget && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold font-heading text-text-main truncate pr-2">
                             {isContextualLoading ? "Generating..." :
                              selectedTone ? `${selectedTone} Suggestions for ${suggestionTarget.field}` :
                              `Improve ${suggestionTarget.field}`
                             }
                        </h3>
                        <button onClick={handleDismissContextual} className="text-slate-400 hover:text-slate-600 text-2xl" aria-label="Close suggestions">&times;</button>
                    </div>

                    {isContextualLoading ? (
                         <div className="flex flex-col items-center justify-center text-center text-sm text-text-muted py-4">
                            <Spinner />
                            <p className="mt-3">AI is crafting suggestions...</p>
                        </div>
                    ) : contextualSuggestions.length > 0 ? (
                        <ul className="space-y-4">
                            {contextualSuggestions.map(suggestion => (
                                <li key={suggestion.id} className="bg-slate-100 p-3 rounded-md">
                                    <p className="text-sm text-text-muted mb-2 whitespace-pre-line">{suggestion.text}</p>
                                    <button
                                        onClick={() => handleApplyContextualSuggestion(suggestion.text)}
                                        className="text-xs font-semibold text-primary hover:opacity-80"
                                    >
                                        Apply this Suggestion
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // TONE SELECTOR UI
                        <div className="animate-fade-in">
                            <p className="text-sm text-text-muted mb-3">How would you like to improve this section?</p>
                            <div className="grid grid-cols-2 gap-2">
                                {tones.map(tone => (
                                    <button
                                        key={tone}
                                        onClick={() => handleFetchTonedSuggestions(tone)}
                                        className="px-3 py-2 text-sm font-semibold rounded-md transition-colors border bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
                                    >
                                        {tone}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}

            <div>
                <h3 className="text-lg font-semibold font-heading text-text-main mb-4">Overall ATS Health Check</h3>
                <div className="flex justify-center mb-4">
                    <CircularProgress score={atsScore} />
                </div>
                <ul className="space-y-2 max-w-sm mx-auto">
                    {atsChecks.map(item => (
                        <li key={item.id} className="flex items-center text-sm p-2 bg-slate-100 rounded-md">
                            {item.passed ? <CheckIcon /> : <XIcon />}
                            <span className="ml-2 text-text-muted">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-semibold font-heading text-text-main mb-4">General AI Suggestions</h3>
                {suggestions.length > 0 ? (
                    <ul className="space-y-3">
                        {suggestions.map(suggestion => (
                            <li key={suggestion.id} className="bg-white border border-slate-200 p-3 rounded-md">
                                <p className="text-sm text-text-muted mb-2">{suggestion.text}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-text-muted text-center py-4">No suggestions at the moment. Your resume looks great!</p>
                )}
            </div>
        </div>
    );
};

export default AiOptimizationHub;