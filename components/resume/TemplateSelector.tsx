import React, { useState } from 'react';
import { getTemplates } from '../../services/templateService';
import { Template } from '../../types';
import { useResume } from '../../hooks/useResume';
import TemplateCarousel from './TemplateCarousel'; // Import the new carousel component
import TemplateThumbnail from './TemplateThumbnail'; // Import TemplateThumbnail from its own file

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

interface TemplateSelectorProps {
    setHoveredTemplateId: (id: string | null) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ setHoveredTemplateId }) => {
    const templates: Template[] = getTemplates();
    const { selectedTemplate, setSelectedTemplate } = useResume();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Use a curated list for better UX (controlled order and wording)
    const curatedCategories = ['All', 'Single-Column', 'Two-Column', 'Modern', 'Classic', 'Professional', 'Creative', 'Tech', 'Photo', 'Dark'];

    const filteredTemplates = templates.filter(template => {
        const lowerCaseCategory = activeCategory.toLowerCase();
        const matchesCategory = lowerCaseCategory === 'all' || template.categories.includes(lowerCaseCategory);
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || template.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            <h3 className="text-lg font-semibold text-text-main font-heading mb-4">Select Your Template</h3>

            <div className="mb-4">
                <p className="text-sm font-medium text-text-muted mb-2">Filter by style</p>
                <div className="flex flex-wrap gap-2">
                    {curatedCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors border ${
                                activeCategory === category
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-text-main placeholder:text-text-muted"
                />
            </div>

            {filteredTemplates.length > 0 ? (
                <TemplateCarousel
                    templates={filteredTemplates}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    setHoveredTemplateId={setHoveredTemplateId}
                />
            ) : (
                <div className="text-center py-8 text-text-muted">
                    <p>No templates found for "{searchTerm}" in the "{activeCategory}" category.</p>
                </div>
            )}
        </div>
    );
};

export default TemplateSelector;