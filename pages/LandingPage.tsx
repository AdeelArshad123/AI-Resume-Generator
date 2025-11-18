import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import { generateResumeFromPrompt, extractResumeFromDocument } from '../services/geminiService';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';

const FileUploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);


const LandingPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { setResumeData, setIsLoading, isLoading } = useResume();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateResume = async () => {
        if (!prompt.trim()) {
            setError('Please describe your role or experience.');
            return;
        }

        if (!isAuthenticated) {
            sessionStorage.setItem('initialPrompt', prompt);
            navigate('/signup');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const resumeData = await generateResumeFromPrompt(prompt);
            setResumeData(resumeData);
            navigate('/builder');
        } catch (err) {
            setError('Failed to generate resume. Please try a different prompt.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Unsupported file type. Please upload PDF, DOCX, PNG, or JPEG.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
        }
    };

    const handleUploadResume = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        if (!isAuthenticated) {
            sessionStorage.setItem('initialFileMimeType', file.type);
            sessionStorage.setItem('initialFileBase64', await readFileAsBase64(file)); // Store file content
            navigate('/signup');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const resumeData = await extractResumeFromDocument(file, file.type);
            setResumeData(resumeData);
            navigate('/builder');
        } catch (err) {
            setError('Failed to process resume file. Please ensure it\'s a clear document and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setFile(null); // Clear file input after processing
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String.split(',')[1]); // Only the base64 data part
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };


    const handleSamplePrompt = (samplePrompt: string) => {
        setPrompt(samplePrompt);
    };

    const samplePrompts = [
        {
            title: "Senior Software Engineer",
            prompt: "A senior software engineer with 8 years of experience in frontend development, specializing in React, TypeScript, and cloud infrastructure."
        },
        {
            title: "Marketing Graduate",
            prompt: "A recent marketing graduate with internship experience in social media management and content creation for a B2B SaaS company."
        },
        {
            title: "Project Manager",
            prompt: "An experienced project manager with a PMP certification and a background in overseeing large-scale construction projects from start to finish."
        },
    ];

    return (
        <div className="text-center py-12 md:py-20">
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-main font-heading leading-tight">
                Craft Your Perfect Resume with <span className="text-gradient">AI</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-text-muted max-w-3xl mx-auto">
                Just describe your experience, and our AI will generate a professional, ATS-friendly resume in seconds. Your dream job is just a click away.
            </p>

            <div className="mt-12 max-w-4xl mx-auto">
                <Card className="!p-4 md:!p-8 text-left shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Input */}
                        <div>
                            <h2 className="text-xl font-bold font-heading mb-4 text-text-main">
                                1. Describe your experience
                            </h2>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., 'A senior full-stack developer with 10 years of experience in Python, Django, and React...'"
                                className="w-full h-48 p-4 text-base bg-slate-50 border border-slate-300 rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                disabled={isLoading}
                            />
                            <div className="mt-4">
                                <Button
                                    onClick={handleGenerateResume}
                                    disabled={isLoading || !prompt.trim()}
                                    className="w-full md:w-auto text-lg"
                                >
                                    {isLoading && prompt.trim() ? (
                                        <>
                                            <Spinner size="sm" color="white" />
                                            <span className="ml-3">Building Your Resume...</span>
                                        </>
                                    ) : (
                                        'Generate My Resume'
                                    )}
                                </Button>
                            </div>
                            {error && !file && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                        </div>

                        {/* Right Column: Examples and Upload */}
                        <div>
                            <h2 className="text-xl font-bold font-heading mb-4 text-text-main">
                                2. Or start with an example
                            </h2>
                            <div className="space-y-3 mb-6">
                                {samplePrompts.map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSamplePrompt(p.prompt)}
                                        disabled={isLoading}
                                        className="w-full p-4 text-left bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
                                    >
                                        <p className="font-semibold text-primary">{p.title}</p>
                                        <p className="text-sm text-text-muted mt-1">{p.prompt.substring(0, 90)}...</p>
                                    </button>
                                ))}
                            </div>
                            <h2 className="text-xl font-bold font-heading mb-4 text-text-main">
                                3. Or Upload Your Existing Resume
                            </h2>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUploadIcon className="w-8 h-8 mb-2 text-slate-400" />
                                        <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-slate-500">PDF, DOCX, PNG, JPG (Max 5MB)</p>
                                        {file && <p className="text-xs text-primary mt-1">Selected: {file.name}</p>}
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.docx,.png,.jpeg,.jpg"
                                        onChange={handleFileChange}
                                        disabled={isLoading}
                                        ref={fileInputRef}
                                    />
                                </label>
                            </div>
                             <div className="mt-4">
                                <Button
                                    onClick={handleUploadResume}
                                    disabled={isLoading || !file}
                                    className="w-full md:w-auto text-lg"
                                >
                                    {isLoading && file ? (
                                        <>
                                            <Spinner size="sm" color="white" />
                                            <span className="ml-3">Processing File...</span>
                                        </>
                                    ) : (
                                        'Upload & Build Resume'
                                    )}
                                </Button>
                            </div>
                            {error && file && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LandingPage;