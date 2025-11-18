import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '../../hooks/useResume';
import ExportPreviewModal from './ExportPreviewModal';
import Button from '../ui/Button';

const ResumeExport: React.FC = () => {
    const { resumeData } = useResume();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [previewState, setPreviewState] = useState<{
        isOpen: boolean;
        format: 'png' | 'jpeg' | 'txt' | 'md' | null;
        content: string | null;
    }>({ isOpen: false, format: null, content: null });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleExportPdf = () => {
        setIsDropdownOpen(false);
        window.print();
    };

    const handleExportDocx = async () => {
        setIsDropdownOpen(false);

        const resumeElement = document.getElementById('resume-preview');
        if (!resumeElement) {
            alert('Could not find resume content to export.');
            return;
        }

        let styleContent = '';
        try {
            Array.from(document.styleSheets).forEach(sheet => {
                try {
                    if (sheet.cssRules) {
                        Array.from(sheet.cssRules).forEach(rule => {
                            styleContent += rule.cssText;
                        });
                    }
                } catch (e) {
                    console.warn("Can't read stylesheet rules from: ", sheet.href);
                }
            });
        } catch (e) {
            console.error("Could not process stylesheets for DOCX export", e);
        }

        const fontLinks = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'))
          .map(link => link.outerHTML)
          .join('\n');

        const htmlSource = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${resumeData.contact.name} - Resume</title>
                ${fontLinks}
                <style>${styleContent}</style>
            </head>
            <body>
                ${resumeElement.outerHTML}
            </body>
            </html>`;

        // This creates an HTML-based file that Word can open, often in compatibility mode.
        // It's the most reliable method without a dedicated client-side DOCX generation library.
        const blob = new Blob([htmlSource], { type: 'application/msword' });
        const name = resumeData.contact.name.replace(/\s+/g, '_') || 'Resume';
        const fileName = `${name}.docx`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const generateImage = async (format: 'png' | 'jpeg') => {
        const input = document.getElementById('resume-preview');
        if (!input) return null;

        const contentToPrint = input.cloneNode(true) as HTMLElement;
        contentToPrint.style.position = 'absolute';
        contentToPrint.style.left = '-9999px';
        contentToPrint.style.top = '0px';
        document.body.appendChild(contentToPrint);

        try {
            await document.fonts.ready;
            await new Promise(resolve => setTimeout(resolve, 200));

            const { default: html2canvas } = await import('html2canvas');
            const canvas = await html2canvas(contentToPrint, {
                scale: 3,
                useCORS: true,
                letterRendering: true,
            });

            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            return canvas.toDataURL(mimeType, 0.95);
        } catch (e) {
            console.error(`Image generation failed for .${format}:`, e);
            return null;
        } finally {
            document.body.removeChild(contentToPrint);
        }
    }

    const handlePreviewImage = async (format: 'png' | 'jpeg') => {
        setIsDropdownOpen(false);
        setPreviewState({ isOpen: true, format, content: null });

        const dataUrl = await generateImage(format);
        if (dataUrl) {
            setPreviewState({ isOpen: true, format, content: dataUrl });
        } else {
            alert('Could not generate image preview.');
            setPreviewState({ isOpen: false, format: null, content: null });
        }
    };

    const generateMarkdown = () => {
        const { contact, professionalSummary, workExperience, skills, education, awardsAndCertifications } = resumeData;

        const contactParts = [
            contact.email,
            contact.phone,
            contact.linkedin ? `[LinkedIn](${contact.linkedin})` : null,
            contact.github ? `[GitHub](${contact.github})` : null,
            contact.website ? `[Website](${contact.website})` : null,
            contact.twitter ? `[Twitter](${contact.twitter})` : null,
        ].filter(Boolean);

        let markdownContent = `# ${contact.name}\n\n`;
        markdownContent += `${contactParts.join(' | ')}\n\n`;

        if (professionalSummary) {
            markdownContent += `## Professional Summary\n\n`;
            markdownContent += `${professionalSummary}\n\n`;
        }

        if (skills && skills.length > 0) {
            markdownContent += `## Skills\n\n`;
            markdownContent += `- ${skills.join(', ')}\n\n`;
        }

        if (workExperience && workExperience.length > 0) {
            markdownContent += `## Work Experience\n\n`;
            workExperience.forEach(exp => {
                markdownContent += `### ${exp.jobTitle} at ${exp.company}\n`;
                markdownContent += `*${exp.location} | ${exp.dates}*\n`;
                exp.responsibilities.forEach(r => { markdownContent += `- ${r}\n`; });
                markdownContent += '\n';
            });
        }

        if (education && education.length > 0) {
            markdownContent += `## Education\n\n`;
            education.forEach(edu => {
                markdownContent += `### ${edu.degree}\n`;
                markdownContent += `*${edu.institution}, ${edu.location} | ${edu.dates}*\n\n`;
            });
        }

        if (awardsAndCertifications && awardsAndCertifications.length > 0) {
            markdownContent += `## Awards & Certifications\n\n`;
            awardsAndCertifications.forEach(cert => {
                markdownContent += `- **${cert.title}** from ${cert.organization} (${cert.date})\n`;
            });
            markdownContent += '\n';
        }

        return markdownContent;
    };


    const handlePreviewTxt = () => {
        setIsDropdownOpen(false);
        const { contact, professionalSummary, workExperience, skills, education, awardsAndCertifications } = resumeData;

        const contactParts = [
            contact.email,
            contact.phone,
            contact.linkedin,
            contact.twitter,
            contact.github,
            contact.website,
        ].filter(Boolean);

        let textContent = `${contact.name.toUpperCase()}\n${contactParts.join(' • ')}\n\nPROFESSIONAL SUMMARY\n---------------------\n${professionalSummary}\n\nSKILLS\n---------------------\n${skills.join(' • ')}\n\nWORK EXPERIENCE\n---------------------\n`;
        workExperience.forEach(exp => { textContent += `${exp.jobTitle.toUpperCase()} | ${exp.company}\n${exp.location} | ${exp.dates}\n${exp.responsibilities.map(r => `  - ${r}`).join('\n')}\n\n`; });
        textContent += 'EDUCATION\n---------------------\n';
        education.forEach(edu => { textContent += `${edu.degree}, ${edu.institution}\n${edu.location} | ${edu.dates}\n\n`; });
        if (awardsAndCertifications && awardsAndCertifications.length > 0) {
            textContent += 'AWARDS & CERTIFICATIONS\n---------------------\n';
            awardsAndCertifications.forEach(cert => { textContent += `${cert.title}, ${cert.organization}\n${cert.date}\n\n`; });
        }
        setPreviewState({ isOpen: true, format: 'txt', content: textContent });
    };
    
    const handlePreviewMarkdown = () => {
        setIsDropdownOpen(false);
        const markdownContent = generateMarkdown();
        setPreviewState({ isOpen: true, format: 'md', content: markdownContent });
    };


    const handleDownloadFromPreview = () => {
        const { format, content } = previewState;
        if (!format || !content) return;

        const name = resumeData.contact.name.replace(/\s+/g, '_') || 'Resume';
    const fileName = `${name}.${format}`;

    try {
        const link = document.createElement('a');
        let objectUrl: string | null = null;

        if (format === 'txt' || format === 'md') {
            const mimeType = format === 'txt' ? 'text/plain;charset=utf-8;' : 'text/markdown;charset=utf-8;';
            const blob = new Blob([content], { type: mimeType });
            objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
        } else { // png or jpeg
            link.href = content;
        }

        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        setPreviewState({ isOpen: false, format: null, content: null });
    } catch (error) {
        console.error("Download failed:", error);
        alert("Sorry, the download could not be completed. Please try again.");
    }
    };

    const getPreviewTitle = () => {
        if (!previewState.format) return 'Preview';
        const name = resumeData.contact.name.replace(/\s+/g, '_') || 'Resume';
        return `Preview: ${name}.${previewState.format}`;
    };

    return (
         <>
            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-light transition-colors text-sm flex items-center shadow-sm" aria-haspopup="true" aria-expanded={isDropdownOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    <span>Export</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-slate-200">
                        <div className="py-1">
                            <button onClick={handleExportPdf} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center" role="menuitem">
                                <span className="mr-3 text-lg" aria-hidden="true">📄</span> Export as PDF
                            </button>
                            <button onClick={handleExportDocx} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center" role="menuitem">
                                <span className="mr-3 text-lg" aria-hidden="true">📘</span> Export as DOCX
                            </button>
                            <button onClick={() => handlePreviewImage('png')} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center" role="menuitem">
                                <span className="mr-3 text-lg" aria-hidden="true">🖼️</span> Export as PNG
                            </button>
                            <button onClick={() => handlePreviewImage('jpeg')} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center" role="menuitem">
                                <span className="mr-3 text-lg" aria-hidden="true">🖼️</span> Export as JPEG
                            </button>
                            <button onClick={handlePreviewTxt} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center" role="menuitem">
                                <span className="mr-3 text-lg" aria-hidden="true">📝</span> Export as TXT
                            </button>
                            <button onClick={handlePreviewMarkdown} className="text-left w-full px-4 py-2 text-sm text-text-main hover:bg-slate-100 flex items-center" role="menuitem">
                                <span className="mr-3 text-lg" aria-hidden="true">📜</span> Export as Markdown
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ExportPreviewModal
                isOpen={previewState.isOpen}
                onClose={() => setPreviewState({ isOpen: false, format: null, content: null })}
                format={previewState.format!}
                content={previewState.content}
                onDownload={handleDownloadFromPreview}
                title={getPreviewTitle()}
            />
        </>
    );
};

export default ResumeExport;