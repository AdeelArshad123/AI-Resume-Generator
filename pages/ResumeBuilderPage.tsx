import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../hooks/useResume';
import { useNavigate } from 'react-router-dom';
import BuilderSidebar from '../components/resume/BuilderSidebar';
import ResumePreview from '../components/resume/ResumePreview';
import BuilderHeader from '../components/resume/BuilderHeader';
import BuilderPanel from '../components/resume/BuilderPanel';
import { generateResumeFromPrompt, extractResumeFromDocument } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import { getTemplates } from '../services/templateService';
import { debounce } from 'lodash';
import TemplatePreviewModal from '../components/resume/TemplatePreviewModal';

export type BuilderPanelType = 'content' | 'design' | 'assist';

const ResumeBuilderPage: React.FC = () => {
    // FIX: Destructure setSelectedTemplate from useResume hook
    const { resumeData, setResumeData, setIsLoading, isLoading, setSelectedTemplate } = useResume();
    const navigate = useNavigate();
    // Default activePanel to null on smaller screens, 'content' on larger screens
    const [activePanel, setActivePanel] = useState<BuilderPanelType | null>(() => window.innerWidth >= 1024 ? 'content' : null);
    const [hoveredTemplateId, setHoveredTemplateId] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [scale, setScale] = useState(0.85);

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const templates = getTemplates();
    const hoveredTemplate = hoveredTemplateId ? templates.find(t => t.id === hoveredTemplateId) : null;
    
    const handleApplyTemplate = (templateId: string) => {
        setSelectedTemplate(templateId);
        setHoveredTemplateId(null); // Close the modal after applying
    };

    useEffect(() => {
        const initialize = async () => {
            const initialPrompt = sessionStorage.getItem('initialPrompt');
            const initialFileBase64 = sessionStorage.getItem('initialFileBase64');
            const initialFileMimeType = sessionStorage.getItem('initialFileMimeType');

            if (initialPrompt) {
                sessionStorage.removeItem('initialPrompt');
                setIsLoading(true);
                try {
                    const data = await generateResumeFromPrompt(initialPrompt);
                    setResumeData(data);
                } catch (error) {
                    console.error("Failed to generate resume from stored prompt", error);
                    navigate('/');
                } finally {
                    setIsLoading(false);
                }
            } else if (initialFileBase64 && initialFileMimeType) {
                 sessionStorage.removeItem('initialFileBase64');
                 sessionStorage.removeItem('initialFileMimeType');
                 setIsLoading(true);
                 try {
                     // Convert Base64 back to Blob/File for processing
                     const response = await fetch(`data:${initialFileMimeType};base64,${initialFileBase64}`);
                     const blob = await response.blob();
                     const file = new File([blob], "uploaded_resume", { type: initialFileMimeType });

                     const data = await extractResumeFromDocument(file, file.type);
                     setResumeData(data);
                 } catch (error) {
                     console.error("Failed to extract resume from stored file", error);
                     navigate('/');
                 } finally {
                     setIsLoading(false);
                 }
            } else if (!resumeData || !resumeData.contact.name) {
                navigate('/');
                return;
            }
            setIsInitializing(false);
        };

        initialize();
    }, [navigate, resumeData, setResumeData, setIsLoading]);
    
    useEffect(() => {
        const handleResize = debounce(() => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                const containerHeight = previewContainerRef.current.offsetHeight;
                const resumeWidth = 816; // 8.5in at 96dpi
                const resumeHeight = 1056; // 11in at 96dpi
                
                // Adjust padding based on screen size
                const paddingHorizontal = window.innerWidth < 768 ? 32 : 64; // Corresponds to p-4/p-8
                const paddingVertical = window.innerWidth < 768 ? 32 : 64; // Corresponds to p-4/p-8

                const availableWidth = containerWidth - paddingHorizontal;
                const availableHeight = containerHeight - paddingVertical;

                // Calculate scale to fit both width and height, but don't upscale beyond 1.0
                const scaleX = availableWidth / resumeWidth;
                const scaleY = availableHeight / resumeHeight;
                const calculatedScale = Math.min(scaleX, scaleY, 1.0);

                setScale(calculatedScale);
            }
             // On desktop, if no panel is open, default to opening the content panel
             if (window.innerWidth >= 1024 && !activePanel) {
                setActivePanel('content');
             }

        }, 100);

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activePanel]);


    if (isInitializing || isLoading) {
        return (
            <div className="flex h-screen w-screen bg-slate-100 items-center justify-center">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-text-muted">
                        {isLoading ? 'Building your AI resume...' : 'Loading editor...'}
                    </p>
                </div>
            </div>
        );
    }
    
    if (!resumeData || !resumeData.contact.name) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="flex h-screen w-screen bg-slate-100 overflow-hidden antialiased relative">
            <BuilderSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
           
            <BuilderPanel 
                activePanel={activePanel} 
                closePanel={() => setActivePanel(null)}
                setHoveredTemplateId={setHoveredTemplateId}
            />

            {/* Main Preview Area */}
            <main ref={previewContainerRef} className="flex-1 flex flex-col bg-background relative overflow-hidden">
                <BuilderHeader />
                <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-auto">
                     <div id="resume-preview-wrapper" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }} className="transition-transform duration-300">
                        <ResumePreview />
                    </div>
                </div>

                {/* Hover Preview Modal */}
                {hoveredTemplate && (
                    <TemplatePreviewModal
                        template={hoveredTemplate}
                        onClose={() => setHoveredTemplateId(null)}
                        onApply={handleApplyTemplate}
                        onMouseEnter={() => setHoveredTemplateId(hoveredTemplate.id)}
                        onMouseLeave={() => setHoveredTemplateId(null)}
                    />
                )}
            </main>
        </div>
    );
};

export default ResumeBuilderPage;