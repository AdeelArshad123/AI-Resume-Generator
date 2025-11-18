import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '../hooks/useResume';
import { generateCoverLetter } from '../services/geminiService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const templates = [
    { id: 'professional', name: 'Professional', description: 'A formal, classic tone suitable for corporate roles.' },
    { id: 'modern', name: 'Modern', description: 'A direct, concise, and slightly less formal approach.' },
    { id: 'enthusiastic', name: 'Enthusiastic', description: 'An energetic tone that shows passion for the role and company.' },
    { id: 'creative', name: 'Creative', description: 'A storyteller\'s tone, using vivid language to create a narrative.' },
    { id: 'direct', name: 'Direct', description: 'A bold, straight-to-the-point style that highlights results.' },
];

const CopyIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const DownloadIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const CheckIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;

const CoverLetterPage: React.FC = () => {
    const { resumeData } = useResume();
    const [jobDescription, setJobDescription] = useState('');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('professional');
    const [copyButtonText, setCopyButtonText] = useState('Copy');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);
    
    const hasResumeData = resumeData && resumeData.contact.name;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setIsDownloadOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            setError("Please paste a job description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedLetter('');
        try {
            const letter = await generateCoverLetter(resumeData, jobDescription, selectedTemplate);
            setGeneratedLetter(letter);
        } catch (err) {
            setError("Sorry, there was an issue generating your cover letter. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy'), 2000);
        });
    };

    const handleDownload = (format: 'pdf' | 'doc' | 'txt') => {
        setIsDownloadOpen(false);
        const name = resumeData.contact.name.replace(/\s+/g, '_') || 'Cover_Letter';

        if (format === 'txt') {
            const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${name}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
        } else if (format === 'doc') {
            const content = generatedLetter.replace(/\n/g, '<br />');
            const source = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${content}</body></html>`;
            const blob = new Blob([source], { type: 'application/msword' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${name}.doc`;
            link.click();
            URL.revokeObjectURL(link.href);
        } else if (format === 'pdf') {
            const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'letter' });
            const margin = 40;
            const usableWidth = doc.internal.pageSize.getWidth() - margin * 2;
            doc.setFont('times', 'normal');
            doc.setFontSize(12);

            const lines = doc.splitTextToSize(generatedLetter, usableWidth);
            let cursorY = margin;
            const lineHeight = doc.getLineHeight();

            for (let i = 0; i < lines.length; i++) {
                if (cursorY + lineHeight > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    cursorY = margin;
                }
                doc.text(lines[i], margin, cursorY);
                cursorY += lineHeight;
            }
            doc.save(`${name}.pdf`);
        }
    };
    
    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-text-main font-heading">AI Cover Letter <span className="text-gradient">Generator</span></h1>
                <p className="mt-4 text-lg text-text-muted max-w-3xl mx-auto">
                    {hasResumeData 
                        ? "Combine your resume with a job description to create a perfectly tailored cover letter in seconds."
                        : "Create a resume first to unlock the AI Cover Letter Generator."
                    }
                </p>
            </div>
            
            {!hasResumeData ? (
                <Card className="max-w-2xl mx-auto text-center animate-fade-in">
                    <h2 className="text-2xl font-bold font-heading text-text-main">Your Resume is a Blank Canvas</h2>
                    <p className="mt-4 text-text-muted">
                        The AI Cover Letter generator uses your resume data to highlight your skills and experience.
                        Start by creating a resume, and then come back to craft the perfect cover letter.
                    </p>
                    <div className="mt-6">
                        <Link to="/">
                            <Button>Create a New Resume</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto animate-fade-in">
                    {/* Left Column: Inputs */}
                    <div className="space-y-6">
                        <Card>
                            <h3 className="text-xl font-bold font-heading text-text-main mb-2">1. Your Resume</h3>
                            <div className="bg-slate-100 p-4 rounded-md border border-slate-200">
                                <p className="font-semibold">{resumeData.contact.name}</p>
                                <p className="text-sm text-text-muted">Your resume data is ready to be used.</p>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-xl font-bold font-heading text-text-main mb-2">2. Select a Tone</h3>
                            <p className="text-sm text-text-muted mb-4">Choose the style and tone for your cover letter.</p>
                            <div className="space-y-3">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`w-full text-left p-3 border rounded-md transition-all ${
                                            selectedTemplate === template.id
                                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                : 'border-slate-300 hover:border-primary/50 bg-white'
                                        }`}
                                        disabled={isLoading}
                                    >
                                        <p className="font-semibold text-text-main">{template.name}</p>
                                        <p className="text-xs text-text-muted">{template.description}</p>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-xl font-bold font-heading text-text-main mb-2">3. Job Description</h3>
                            <p className="text-sm text-text-muted mb-4">Paste the full job description below.</p>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full h-64 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition resize-y bg-white text-text-main placeholder:text-text-muted"
                                placeholder="Paste job description here..."
                                disabled={isLoading}
                            />
                        </Card>
                        <Button onClick={handleGenerate} className="w-full text-lg" disabled={isLoading}>
                            {isLoading && <Spinner size="sm" color="white" />}
                            <span className={isLoading ? 'ml-3' : ''}>
                                {isLoading ? 'Generating...' : 'Generate Cover Letter'}
                            </span>
                        </Button>
                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    </div>
                    
                    {/* Right Column: Output */}
                    <Card className="flex flex-col">
                        <div className="flex flex-wrap gap-y-4 gap-x-2 justify-center sm:justify-between items-center mb-4">
                             <h3 className="text-xl font-bold font-heading text-text-main">4. Your Cover Letter</h3>
                             {generatedLetter && !isLoading && (
                                 <div className="flex items-center flex-wrap gap-2">
                                     <button onClick={handleCopy} className="text-sm bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold px-3 py-1.5 rounded-md flex items-center transition-colors">
                                        {copyButtonText === 'Copy' ? <CopyIcon className="h-4 w-4 mr-1.5" /> : <CheckIcon className="h-4 w-4 mr-1.5 text-emerald-500" />}
                                        {copyButtonText}
                                     </button>
                                     <div ref={downloadRef} className="relative">
                                         <button onClick={() => setIsDownloadOpen(prev => !prev)} className="bg-primary text-white hover:opacity-90 font-semibold px-3 py-1.5 rounded-md flex items-center transition-opacity">
                                            <DownloadIcon className="h-4 w-4 mr-1.5" />
                                            Download
                                         </button>
                                         {isDownloadOpen && (
                                             <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                 <div className="py-1">
                                                     <button onClick={() => handleDownload('pdf')} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center">📄 PDF Document</button>
                                                     <button onClick={() => handleDownload('doc')} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center">📘 Word Document</button>
                                                     <button onClick={() => handleDownload('txt')} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center">📝 Plain Text</button>
                                                 </div>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             )}
                        </div>
                         {isLoading ? (
                             <div className="flex-grow flex flex-col items-center justify-center text-text-muted">
                                <Spinner size="lg" color="primary" />
                                <p className="mt-4">AI is writing your letter...</p>
                             </div>
                         ) : (
                            <textarea
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                                className="w-full flex-grow p-4 border border-slate-200 rounded-md bg-slate-50 resize-y text-text-muted whitespace-pre-wrap"
                                placeholder="Your cover letter will appear here..."
                                readOnly={!generatedLetter}
                            />
                         )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CoverLetterPage;