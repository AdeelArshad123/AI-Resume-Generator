import React, { useState, useEffect, useRef } from 'react';
import { Template } from '../../types';
import HoverResumePreview from './HoverResumePreview';
import Button from '../ui/Button';

interface TemplatePreviewModalProps {
    template: Template;
    onClose: () => void;
    onApply: (templateId: string) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, onClose, onApply, onMouseEnter, onMouseLeave }) => {
    const [previewScale, setPreviewScale] = useState(0.8);
    const previewWrapperRef = useRef<HTMLDivElement>(null);
    
    const handleApply = () => {
        onApply(template.id);
    };

    useEffect(() => {
        const adjustScale = () => {
            if (previewWrapperRef.current) {
                const wrapperWidth = previewWrapperRef.current.offsetWidth;
                const wrapperHeight = previewWrapperRef.current.offsetHeight;
                const resumeWidthInPx = 8.5 * 96; // 8.5 inches to px (assuming 96dpi)
                const resumeHeightInPx = 11 * 96; // 11 inches to px (assuming 96dpi)
                
                const targetWidth = wrapperWidth * 0.9; // Use 90% of available width
                const targetHeight = wrapperHeight * 0.9; // Use 90% of available height

                const scaleX = targetWidth / resumeWidthInPx;
                const scaleY = targetHeight / resumeHeightInPx;

                setPreviewScale(Math.min(scaleX, scaleY, 1.0)); // Don't let it scale beyond 1.0 (original size)
            }
        };

        adjustScale(); // Initial adjustment
        window.addEventListener('resize', adjustScale);
        return () => window.removeEventListener('resize', adjustScale);
    }, []); // Empty dependency array means this runs once on mount, and then for resize events


    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-preview-enter"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
            >
                <div className="p-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold font-heading text-text-main">Preview: {template.name}</h2>
                            <p className="text-sm text-text-muted mt-1">{template.description}</p>
                        </div>
                        <div className="flex items-center space-x-3 flex-shrink-0">
                            <Button variant="secondary" onClick={onClose} className="px-4 py-2 text-sm">Close</Button>
                            <Button variant="primary" onClick={handleApply} className="px-4 py-2 text-sm">Apply Template</Button>
                        </div>
                    </div>
                </div>
                <div ref={previewWrapperRef} className="flex-grow min-h-0 flex items-center justify-center overflow-auto bg-slate-100 p-4">
                     <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'center' }} className="transition-transform duration-300">
                        <HoverResumePreview templateId={template.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreviewModal;