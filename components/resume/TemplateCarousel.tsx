import React, { useState, useEffect, useRef } from 'react';
import { Template } from '../../types';
import { useResume } from '../../hooks/useResume';
import TemplateThumbnail from './TemplateThumbnail'; // Import TemplateThumbnail from its own file

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

interface TemplateCarouselProps {
    templates: Template[];
    selectedTemplate: string;
    setSelectedTemplate: (id: string) => void;
    setHoveredTemplateId: (id: string | null) => void;
}

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({
    templates,
    selectedTemplate,
    setSelectedTemplate,
    setHoveredTemplateId,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleTemplatesCount, setVisibleTemplatesCount] = useState(2); // Default for smaller panels
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current) {
                const carouselWidth = carouselRef.current.offsetWidth;
                // Adjust number of visible templates based on available width
                if (carouselWidth < 200) { // Very small screens (e.g., narrow mobile portrait)
                    setVisibleTemplatesCount(1);
                } else if (carouselWidth < 400) { // Standard sidebar width on small/medium screens
                    setVisibleTemplatesCount(2);
                } else if (carouselWidth < 600) { // Wider tablet in landscape or larger panel
                    setVisibleTemplatesCount(3);
                } else { // Large desktop, wider panel
                    setVisibleTemplatesCount(4);
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = () => {
        setCurrentIndex(prevIndex => Math.min(prevIndex + 1, templates.length - visibleTemplatesCount));
    };

    const handlePrev = () => {
        setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const currentTemplates = templates.slice(currentIndex, currentIndex + visibleTemplatesCount);
    const gapSize = 0.5; // Corresponds to gap-x-2 (0.5rem)

    return (
        <div className="relative" ref={carouselRef}>
            <div className="flex overflow-hidden relative">
                {/* Left Arrow */}
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-slate-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Previous template"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {/* Templates */}
                <div className="flex w-full justify-start items-stretch py-2 gap-x-2">
                    {currentTemplates.length > 0 ? (
                        currentTemplates.map(template => (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                onMouseEnter={() => setHoveredTemplateId(template.id)}
                                onMouseLeave={() => setHoveredTemplateId(null)}
                                className="cursor-pointer group flex-shrink-0 relative"
                                style={{
                                    flexBasis: `calc(${100 / visibleTemplatesCount}% - ${
                                        visibleTemplatesCount > 1 ? ((visibleTemplatesCount - 1) * gapSize) / visibleTemplatesCount : 0
                                    }rem)`,
                                    maxWidth: `calc(${100 / visibleTemplatesCount}% - ${
                                        visibleTemplatesCount > 1 ? ((visibleTemplatesCount - 1) * gapSize) / visibleTemplatesCount : 0
                                    }rem)`,
                                }}
                            >
                                <div className="relative">
                                    <div className={`w-full bg-white rounded-md border-2 overflow-hidden ${selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/30' : 'border-slate-200 group-hover:border-primary/50'} transition-all duration-200 ease-in-out shadow-inner group-hover:scale-[1.02] group-hover:shadow-lg aspect-[8.5/11]`}>
                                        <TemplateThumbnail templateId={template.id} />
                                    </div>
                                    {selectedTemplate === template.id && (
                                        <div className="absolute top-2 right-2 flex items-center justify-center bg-primary text-white rounded-full h-5 w-5 shadow animate-fade-in">
                                            <CheckIcon className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center mt-2 h-16">
                                    <p className={`text-sm font-medium ${selectedTemplate === template.id ? 'text-primary' : 'text-text-muted'}`}>{template.name}</p>
                                    <p className="text-xs text-slate-500 mt-1 px-1 line-clamp-2">{template.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-8 text-text-muted">
                            <p>No templates to display in this view.</p>
                        </div>
                    )}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    disabled={currentIndex >= templates.length - visibleTemplatesCount}
                    className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-slate-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Next template"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
            {/* Scroll indicator (optional, could be dots or a scrollbar) */}
            <div className="flex justify-center mt-4 space-x-1">
                {templates.map((_, idx) => (
                    <span
                        key={idx}
                        className={`block w-2 h-2 rounded-full ${idx >= currentIndex && idx < currentIndex + visibleTemplatesCount ? 'bg-primary' : 'bg-slate-300'}`}
                        title={`Template group ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TemplateCarousel;