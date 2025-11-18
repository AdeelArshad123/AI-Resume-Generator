import React, { useState, useEffect } from 'react';
import { LinkedInImportedProfileData, WorkExperience, Education } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';

interface LinkedInImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (data: Partial<LinkedInImportedProfileData>) => void; // Now returns partial imported data
    initialData: LinkedInImportedProfileData | null;
}

type EditableData = {
    contact: { [key: string]: string | undefined };
    professionalSummary: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: string;
};

type SelectedFields = {
    contact: { [key: string]: boolean };
    professionalSummary: boolean;
    workExperience: { [id: string]: boolean };
    education: { [id: string]: boolean };
    skills: boolean;
};

const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({ isOpen, onClose, onApply, initialData }) => {
    const [editableData, setEditableData] = useState<EditableData>({
        contact: {},
        professionalSummary: '',
        workExperience: [],
        education: [],
        skills: '',
    });
    const [selectedFields, setSelectedFields] = useState<SelectedFields>({
        contact: {},
        professionalSummary: false,
        workExperience: {},
        education: {},
        skills: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            const initialContact = initialData.contact || {};
            const initialProfessionalSummary = initialData.aboutSection || initialData.headline || '';
            // FIX: Map description to responsibilities (array of strings) and ensure 'location' is present for WorkExperience.
            const initialWorkExperience: WorkExperience[] = (initialData.workExperience || []).map(exp => ({
                id: `li-we-${Date.now()}-${Math.random()}`,
                jobTitle: exp.jobTitle,
                company: exp.company,
                location: exp.location, // LinkedIn data usually provides this
                dates: exp.dates,
                responsibilities: exp.description ? exp.description.split('\n').map(s => s.trim()).filter(s => s) : [],
            }));
            // FIX: Ensure 'location' is present for Education, adding a placeholder if not available from LinkedIn.
            const initialEducation: Education[] = (initialData.education || []).map(edu => ({
                id: `li-edu-${Date.now()}-${Math.random()}`,
                degree: edu.degree + (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''), // Merge fieldOfStudy into degree
                institution: edu.institution,
                location: 'N/A', // LinkedIn often doesn't give precise location, requires user input
                dates: edu.dates,
            }));
            const initialSkills = (initialData.skills || []).join(', ');

            setEditableData({
                contact: { ...initialContact },
                professionalSummary: initialProfessionalSummary,
                workExperience: initialWorkExperience,
                education: initialEducation,
                skills: initialSkills,
            });

            const initialSelectedContact = Object.keys(initialContact).reduce((acc, key) => {
                acc[key] = true; // Select all contact fields by default
                return acc;
            }, {} as { [key: string]: boolean });

            const initialSelectedWorkExperience = initialWorkExperience.reduce((acc, exp) => {
                acc[exp.id] = true; // Select all work experiences by default
                return acc;
            }, {} as { [id: string]: boolean });

            const initialSelectedEducation = initialEducation.reduce((acc, edu) => {
                acc[edu.id] = true; // Select all education entries by default
                return acc;
            }, {} as { [id: string]: boolean });


            setSelectedFields({
                contact: initialSelectedContact,
                professionalSummary: !!initialProfessionalSummary,
                workExperience: initialSelectedWorkExperience,
                education: initialSelectedEducation,
                skills: !!initialSkills,
            });
        }
    }, [initialData]);

    if (!isOpen || !initialData) return null;

    const handleContactChange = (field: string, value: string) => {
        setEditableData(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value },
        }));
    };

    const handleSummaryChange = (value: string) => {
        setEditableData(prev => ({ ...prev, professionalSummary: value }));
    };

    const handleWorkExperienceChange = (id: string, field: keyof WorkExperience, value: string | string[]) => {
        setEditableData(prev => ({
            ...prev,
            workExperience: prev.workExperience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            ),
        }));
    };

    const handleEducationChange = (id: string, field: keyof Education, value: string) => {
        setEditableData(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const handleSkillsChange = (value: string) => {
        setEditableData(prev => ({ ...prev, skills: value }));
    };


    const handleCheckboxChange = (section: keyof SelectedFields, fieldOrId: string | undefined, isParentToggle: boolean = false) => {
        setSelectedFields(prev => {
            const newSelection = { ...prev };

            if (section === 'professionalSummary' || section === 'skills') {
                newSelection[section] = !newSelection[section];
            } else if (fieldOrId && (section === 'contact' || section === 'workExperience' || section === 'education')) {
                // If it's a sub-item, toggle just that item
                if (!isParentToggle) {
                    newSelection[section][fieldOrId] = !newSelection[section][fieldOrId];
                } else {
                    // If it's a parent toggle for a list, toggle all sub-items
                    const allSelected = Object.values(newSelection[section]).every(Boolean);
                    for (const id in newSelection[section]) {
                        newSelection[section][id] = !allSelected;
                    }
                }
            }
            return newSelection;
        });
    };

    const handleApply = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const dataToApply: Partial<LinkedInImportedProfileData> = {};

        // 1. Determine the name for contact, ensuring it's never an empty string if contact is to be included.
        const effectiveName = (editableData.contact.name || initialData.contact?.name || '').trim();

        // 2. Collect other selected contact fields
        const selectedContactFields: Omit<LinkedInImportedProfileData['contact'], 'name'> = {};
        let anyOtherContactFieldSelected = false;
        for (const key in selectedFields.contact) {
            if (key !== 'name' && selectedFields.contact[key] && editableData.contact[key] !== undefined) {
                (selectedContactFields as any)[key] = editableData.contact[key];
                anyOtherContactFieldSelected = true;
            }
        }

        // 3. Decide whether to include the 'contact' object in dataToApply
        if (effectiveName !== '' || anyOtherContactFieldSelected) {
            dataToApply.contact = { name: effectiveName === '' ? 'Placeholder Name' : effectiveName, ...selectedContactFields } as LinkedInImportedProfileData['contact'];
        }
        // If effectiveName is empty and no other contact fields are selected, dataToApply.contact remains undefined, which is fine for Partial.


        // Apply Professional Summary
        if (selectedFields.professionalSummary) {
            dataToApply.aboutSection = editableData.professionalSummary;
        }

        // Apply Work Experience
        dataToApply.workExperience = editableData.workExperience.filter(exp => selectedFields.workExperience[exp.id])
            .map(exp => ({
                jobTitle: exp.jobTitle,
                company: exp.company,
                location: exp.location,
                dates: exp.dates,
                description: Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : exp.responsibilities,
            }));

        // Apply Education
        dataToApply.education = editableData.education.filter(edu => selectedFields.education[edu.id])
            .map(edu => ({
                degree: edu.degree,
                institution: edu.institution,
                dates: edu.dates,
            }));

        // Apply Skills
        if (selectedFields.skills) {
            dataToApply.skills = editableData.skills.split(',').map(s => s.trim()).filter(s => s);
        }

        onApply(dataToApply);
        setLoading(false);
    };

    const contactFieldLabels: { [key: string]: string } = {
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        linkedin: 'LinkedIn Profile URL',
        twitter: 'Twitter/X Profile URL',
        github: 'GitHub Profile URL',
        website: 'Personal Website URL',
        photoUrl: 'Profile Photo URL'
    };


    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <Card className="w-full max-w-2xl animate-preview-enter flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold font-heading text-text-main">Import from LinkedIn</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>
                <p className="text-text-muted mb-6 flex-shrink-0">Review, edit, and select the information you'd like to add to your resume.</p>

                <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-text-main mb-2">Contact Information</h3>
                        <div className="space-y-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                            {/* FIX: Ensure name is always editable and selectable if available */}
                            {editableData.contact.name !== undefined && (
                                <div className="flex items-start space-x-4">
                                    <input
                                        type="checkbox"
                                        id="import-contact-name"
                                        checked={!!selectedFields.contact.name}
                                        onChange={() => handleCheckboxChange('contact', 'name')}
                                        className="mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-grow">
                                        <label htmlFor="edit-contact-name" className="block text-sm font-medium text-text-muted">Full Name</label>
                                        <input
                                            type="text"
                                            id="edit-contact-name"
                                            value={editableData.contact.name || ''}
                                            onChange={(e) => handleContactChange('name', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {Object.entries(editableData.contact).map(([key, value]) => (key !== 'name' && value !== undefined) && (
                                <div key={key} className="flex items-start space-x-4">
                                    <input
                                        type="checkbox"
                                        id={`import-contact-${key}`}
                                        checked={!!selectedFields.contact[key]}
                                        onChange={() => handleCheckboxChange('contact', key)}
                                        className="mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-grow">
                                        <label htmlFor={`edit-contact-${key}`} className="block text-sm font-medium text-text-muted">{contactFieldLabels[key] || key}</label>
                                        <input
                                            type="text"
                                            id={`edit-contact-${key}`}
                                            value={value}
                                            onChange={(e) => handleContactChange(key, e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Professional Summary */}
                    {(initialData.aboutSection || initialData.headline) && (
                        <div>
                            <h3 className="font-semibold text-text-main mb-2">Professional Summary (About Section / Headline)</h3>
                            <div className="flex items-start space-x-4 p-3 bg-slate-50 rounded-md border border-slate-200">
                                <input
                                    type="checkbox"
                                    id="import-summary"
                                    checked={selectedFields.professionalSummary}
                                    onChange={() => handleCheckboxChange('professionalSummary', undefined)}
                                    className="mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="flex-grow">
                                    <label htmlFor="edit-summary" className="block text-sm font-medium text-text-muted">Professional Summary</label>
                                    <textarea
                                        id="edit-summary"
                                        value={editableData.professionalSummary}
                                        onChange={(e) => handleSummaryChange(e.target.value)}
                                        rows={5}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm resize-y"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Work Experience */}
                    {initialData.workExperience && initialData.workExperience.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-text-main mb-2">Work Experience</h3>
                            <div className="space-y-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                                {editableData.workExperience.map((exp) => (
                                    <div key={exp.id} className="flex items-start space-x-4">
                                        <input
                                            type="checkbox"
                                            id={`import-work-${exp.id}`}
                                            checked={!!selectedFields.workExperience[exp.id]}
                                            onChange={() => handleCheckboxChange('workExperience', exp.id)}
                                            className="mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex-grow p-2 border border-slate-200 rounded-md bg-white">
                                            <label htmlFor={`edit-jobTitle-${exp.id}`} className="block text-sm font-medium text-text-muted">Job Title</label>
                                            <input type="text" id={`edit-jobTitle-${exp.id}`} value={exp.jobTitle} onChange={e => handleWorkExperienceChange(exp.id, 'jobTitle', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm sm:text-sm" />

                                            <label htmlFor={`edit-company-${exp.id}`} className="block text-sm font-medium text-text-muted mt-2">Company</label>
                                            <input type="text" id={`edit-company-${exp.id}`} value={exp.company} onChange={e => handleWorkExperienceChange(exp.id, 'company', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm sm:text-sm" />

                                            <label htmlFor={`edit-dates-${exp.id}`} className="block text-sm font-medium text-text-muted mt-2">Dates</label>
                                            <input type="text" id={`edit-dates-${exp.id}`} value={exp.dates} onChange={e => handleWorkExperienceChange(exp.id, 'dates', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm sm:text-sm" />

                                            <label htmlFor={`edit-responsibilities-${exp.id}`} className="block text-sm font-medium text-text-muted mt-2">Description</label>
                                            <textarea id={`edit-responsibilities-${exp.id}`} value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : exp.responsibilities} onChange={e => handleWorkExperienceChange(exp.id, 'responsibilities', e.target.value.split('\n'))} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm sm:text-sm resize-y" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {initialData.education && initialData.education.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-text-main mb-2">Education</h3>
                            <div className="space-y-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                                {editableData.education.map((edu) => (
                                    <div key={edu.id} className="flex items-start space-x-4">
                                        <input
                                            type="checkbox"
                                            id={`import-edu-${edu.id}`}
                                            checked={!!selectedFields.education[edu.id]}
                                            onChange={() => handleCheckboxChange('education', edu.id)}
                                            className="mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex-grow p-2 border border-slate-200 rounded-md bg-white">
                                            <label htmlFor={`edit-degree-${edu.id}`} className="block text-sm font-medium text-text-muted">Degree</label>
                                            <input type="text" id={`edit-degree-${edu.id}`} value={edu.degree} onChange={e => handleEducationChange(edu.id, 'degree', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm sm:text-sm" />

                                            <label htmlFor={`edit-institution-${edu.id}`} className="block text-sm font-medium text-text-muted mt-2">Institution</label>
                                            <input type="text" id={`edit-institution-${edu.id}`} value={edu.institution} onChange={e => handleEducationChange(edu.id, 'institution', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm sm:text-sm" />

                                            <label htmlFor={`edit-dates-${edu.id}`} className="block text-sm font-medium text-text-muted mt-2">Dates</label>
                                            <input type="text" id={`edit-dates-${edu.id}`} value={edu.dates} onChange={e => handleEducationChange(edu.id, 'dates', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {initialData.skills && initialData.skills.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-text-main mb-2">Skills</h3>
                            <div className="flex items-start space-x-4 p-3 bg-slate-50 rounded-md border border-slate-200">
                                <input
                                    type="checkbox"
                                    id="import-skills"
                                    checked={selectedFields.skills}
                                    onChange={() => handleCheckboxChange('skills', undefined)}
                                    className="mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="flex-grow">
                                    <label htmlFor="edit-skills" className="block text-sm font-medium text-text-muted">Skills (comma-separated)</label>
                                    <textarea
                                        id="edit-skills"
                                        value={editableData.skills}
                                        onChange={(e) => handleSkillsChange(e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm resize-y"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center mt-8 space-x-4 flex-shrink-0">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button variant="primary" onClick={handleApply} disabled={loading}>
                        {loading && <Spinner size="sm" color="white" />}
                        <span className={loading ? 'ml-2' : ''}>Apply to Resume</span>
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default LinkedInImportModal;