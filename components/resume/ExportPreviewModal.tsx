import React from 'react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface ExportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    format: 'png' | 'jpeg' | 'txt' | 'md'; // Added 'md' format
    content: string | null; // Data URL for images, text for txt/md
    onDownload: () => void;
    title: string;
}

const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({
    isOpen,
    onClose,
    format,
    content,
    onDownload,
    title,
}) => {
    if (!isOpen) return null;

    const renderPreview = () => {
        if (!content) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-text-muted">
                    <Spinner />
                    <p className="mt-4">Generating Preview...</p>
                </div>
            );
        }

        if (format === 'txt' || format === 'md') { // Handle Markdown as preformatted text
            return (
                <pre className="w-full h-full p-4 bg-slate-100 rounded-md text-sm text-slate-700 overflow-auto whitespace-pre-wrap">
                    {content}
                </pre>
            );
        }

        return (
            <div className="flex items-center justify-center h-full overflow-auto p-4 bg-slate-100 rounded-md">
                <img src={content} alt="Resume Preview" className="max-w-full max-h-full object-contain shadow-lg" />
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-6 animate-preview-enter"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold font-heading text-text-main">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none" aria-label="Close preview">&times;</button>
                </div>
                <div className="flex-grow min-h-0">
                    {renderPreview()}
                </div>
                <div className="flex justify-end items-center mt-6 flex-shrink-0 space-x-4">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button variant="primary" onClick={onDownload} disabled={!content}>Download</Button>
                </div>
            </div>
        </div>
    );
};

export default ExportPreviewModal;