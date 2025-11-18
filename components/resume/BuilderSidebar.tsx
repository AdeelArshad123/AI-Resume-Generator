import React from 'react';
import { BuilderPanelType } from '../../pages/ResumeBuilderPage';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const DesignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;
const AssistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

const navItems: { id: BuilderPanelType; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: 'Content', icon: <EditIcon /> },
    { id: 'design', label: 'Design', icon: <DesignIcon /> },
    { id: 'assist', label: 'AI Assist', icon: <AssistIcon /> },
];

interface BuilderSidebarProps {
    activePanel: BuilderPanelType | null;
    setActivePanel: (panel: BuilderPanelType | null) => void;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({ activePanel, setActivePanel }) => {
    
    const handlePanelToggle = (panelId: BuilderPanelType) => {
        // If the clicked panel is already active, close it. Otherwise, open it.
        setActivePanel(activePanel === panelId ? null : panelId);
    };

    return (
        <aside className="w-14 sm:w-16 lg:w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 space-y-6 z-40 flex-shrink-0">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => handlePanelToggle(item.id)}
                    className={`p-3 rounded-lg transition-colors duration-200 relative ${activePanel === item.id ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-primary'}`}
                    aria-label={item.label}
                    title={item.label}
                    aria-pressed={activePanel === item.id}
                >
                    {item.icon}
                </button>
            ))}
        </aside>
    );
};

export default BuilderSidebar;