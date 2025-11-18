import React from 'react';
import { BuilderPanelType } from '../../pages/ResumeBuilderPage';
import ResumeForm from './ResumeForm';
import TemplateSelector from './TemplateSelector';
import AiOptimizationHub from './AiOptimizationHub';
import ThemeCustomizer from './ThemeCustomizer';

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


interface BuilderPanelProps {
    activePanel: BuilderPanelType | null;
    closePanel: () => void;
    setHoveredTemplateId: (id: string | null) => void;
}

const BuilderPanel: React.FC<BuilderPanelProps> = ({ activePanel, closePanel, setHoveredTemplateId }) => {

    const panelConfig = {
        content: { title: 'Edit Content', component: <ResumeForm /> },
        design: { 
            title: 'Select & Customize Design', 
            component: (
                <div className="space-y-6">
                    <TemplateSelector setHoveredTemplateId={setHoveredTemplateId} />
                    <div className="border-t border-slate-200 pt-6">
                        <ThemeCustomizer />
                    </div>
                </div>
            )
        },
        assist: { title: 'AI Optimization', component: <AiOptimizationHub /> },
    };


    const currentPanel = activePanel ? panelConfig[activePanel] : null;

    return (
        <div 
             className={`
             absolute top-0 h-full bg-white transition-transform duration-300 ease-in-out transform border-r border-slate-200 flex flex-col flex-shrink-0 z-30
             
             // Mobile (default): Panel covers full width, slides from left, visually covering the narrow sidebar
             w-full left-0 
             // Tablet (sm): Panel takes 80 width, starts after 16px sidebar, slides from left
             sm:w-80 sm:left-16 
             // Desktop (lg): Panel takes 400px, is relative (not absolute), and either visible or slides out of *its own* area
             lg:w-[400px] lg:relative lg:left-0

             ${activePanel 
                ? 'translate-x-0 shadow-2xl lg:shadow-none' 
                : 'lg:-translate-x-full -translate-x-full' // Mobile/Tablet: slide completely off-screen. Desktop: slide off relative area.
             }`}
        >
            {currentPanel && (
                <>
                    <div className="p-4 sm:p-6 h-16 flex items-center justify-between border-b border-slate-200 flex-shrink-0">
                        <h2 className="text-lg font-bold font-heading text-text-main">{currentPanel.title}</h2>
                        <button onClick={closePanel} className="sm:hidden text-slate-400 hover:text-slate-600 p-1" aria-label="Close panel">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                        {currentPanel.component}
                    </div>
                </>
            )}
        </div>
    );
};

export default BuilderPanel;