import React, { useState } from 'react';
import { useResume } from '../../hooks/useResume';
import { WorkExperience, Education, AwardOrCertification, ResumeData } from '../../types';
import { getSuggestionsForText } from '../../services/geminiService';
import Input from '../ui/Input'; // Import new Input component
import Textarea from '../ui/Textarea'; // Import new Textarea component

// --- ICONS (as seen in other files, for consistency) ---
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.684-2.684l-1.938-.648 1.938-.648a3.375 3.375 0 002.684-2.684l.648-1.938.648 1.938a3.375 3.375 0 002.684 2.684l1.938.648-1.938.648a3.375 3.375 0 00-2.684 2.684z" /></svg>;
const MicIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 1.5a6 6 0 01-6-6V6.75m6 11.25v3.004a2.25 2.25 0 002.25 2.25h.75a2.25 2.25 0 002.25-2.25V12.75m-8.625 0A6.001 6.001 0 0012 4.5v3.004a2.25 2.25 0 01-2.25 2.25h-.75a2.25 2.25 0 01-2.25-2.25V6.75m8.625 0a6.001 6.001 0 01-12 0v-1.5m6 1.5a6 6 0 00-6 6v1.5m-1.5-1.5h1.5M12 12V6.75" /></svg>;
const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;


// --- FORM UI COMPONENTS ---
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} className="block text-sm font-medium text-text-muted" />;
const ActionButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-50 transition-colors">{children}</button>;
const AddButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className="w-full mt-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20"><PlusIcon className="h-4 w-4 mr-2" />{children}</button>;

const SuggestionButton: React.FC<{ onClick: () => void; isLoading: boolean }> = ({ onClick, isLoading }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="absolute top-0 right-0 mt-1 mr-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 font-semibold py-1 px-2 rounded-md flex items-center transition-opacity disabled:opacity-50"
        title="Get AI Suggestions"
    >
        <SparklesIcon className="h-3 w-3 mr-1" />
        {isLoading ? 'Thinking...' : 'Improve'}
    </button>
);

const VoiceInputButton: React.FC<{ onClick: () => void; isLoading: boolean }> = ({ onClick, isLoading }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="absolute top-0 left-0 mt-1 ml-1 text-xs bg-accent/10 text-accent hover:bg-accent/20 font-semibold py-1 px-2 rounded-md flex items-center transition-opacity disabled:opacity-50"
        title="Voice Input"
    >
        {isLoading ? <SpinnerIcon className="h-3 w-3 mr-1" /> : <MicIcon className="h-3 w-3 mr-1" />}
        {isLoading ? 'Listening...' : 'Voice Input'}
    </button>
);


const AccordionSection: React.FC<{ title: string; children: React.ReactNode, initiallyOpen?: boolean }> = ({ title, children, initiallyOpen = true }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
            <button
                type="button"
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-text-main hover:bg-slate-50/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                {isOpen ? <ChevronUpIcon className="h-5 w-5 text-slate-500" /> : <ChevronDownIcon className="h-5 w-5 text-slate-500" />}
            </button>
            {isOpen && <div className="p-4 border-t border-slate-200">{children}</div>}
        </div>
    );
};

// --- VALIDATION LOGIC ---
type FormErrors = { [key: string]: string | undefined };

const validateRequired = (value: string | string[], fieldName: string): string | undefined => {
    if (Array.isArray(value)) {
        return value.length > 0 && value.every(item => item.trim().length > 0) ? undefined : `${fieldName} is required.`;
    }
    return value.trim() === '' ? `${fieldName} is required.` : undefined;
};

const validateMinLength = (value: string, min: number, fieldName: string): string | undefined => {
    return value.trim().length < min ? `${fieldName} must be at least ${min} characters.` : undefined;
};

const validateMaxLength = (value: string, max: number, fieldName: string): string | undefined => {
    return value.trim().length > max ? `${fieldName} must be at most ${max} characters.` : undefined;
};

const validateEmail = (value: string): string | undefined => {
    if (value.trim() === '') return undefined; // Email is optional, or requiredness checked by validateRequired
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Invalid email format.' : undefined;
};

const validateUrl = (value: string): string | undefined => {
    if (value.trim() === '') return undefined; // URL is optional
    try {
        new URL(value);
        return undefined;
    } catch (_) {
        return 'Invalid URL format.';
    }
};


// --- MAIN FORM COMPONENT ---
const ResumeForm: React.FC = () => {
    const {
        resumeData,
        setResumeData,
        isContextualLoading,
        setContextualSuggestions,
        setSuggestionTarget,
        suggestionTarget
    } = useResume();
    const [isVoiceInputLoading, setIsVoiceInputLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const runValidation = (fieldId: string, value: any): string | undefined => {
        const [section, indexOrField, fieldName] = fieldId.split('.');
        const fieldDisplayName = fieldName || indexOrField; // For top-level fields like 'professionalSummary'

        let error: string | undefined;

        // General Requiredness
        const requiredFields = {
            'contact.name': 'Full Name', 'contact.email': 'Email',
            'professionalSummary': 'Professional Summary',
            'workExperience.*.jobTitle': 'Job Title', 'workExperience.*.company': 'Company', 'workExperience.*.location': 'Location', 'workExperience.*.dates': 'Dates', 'workExperience.*.responsibilities': 'Responsibilities',
            'education.*.degree': 'Degree', 'education.*.institution': 'Institution', 'education.*.location': 'Location', 'education.*.dates': 'Dates',
            'skills': 'Skills',
            'awardsAndCertifications.*.title': 'Title', 'awardsAndCertifications.*.organization': 'Organization', 'awardsAndCertifications.*.date': 'Date',
        };

        if (Object.keys(requiredFields).some(key => {
            const regexKey = key.replace(/\./g, '\\.').replace(/\*/g, '\\d+');
            return new RegExp(`^${regexKey}$`).test(fieldId);
        })) {
             error = validateRequired(value, requiredFields[fieldId.replace(/\.\d+\./, '.*.') as keyof typeof requiredFields] || fieldDisplayName);
            if (error) return error;
        }

        // Specific Validations
        switch (fieldId) {
            case 'contact.email':
                error = validateEmail(value as string);
                break;
            case 'contact.linkedin':
            case 'contact.github':
            case 'contact.website':
                error = validateUrl(value as string);
                break;
            case 'professionalSummary':
                error = validateMinLength(value as string, 50, 'Professional Summary');
                if (error) return error;
                error = validateMaxLength(value as string, 500, 'Professional Summary');
                break;
            case 'skills':
                const skillsArray = (value as string).split(',').map(s => s.trim()).filter(s => s);
                error = skillsArray.length === 0 ? 'At least one skill is required.' : undefined;
                break;
            default:
                if (fieldId.includes('responsibilities')) {
                    const responsibilitiesArray = Array.isArray(value) ? value : (value as string).split('\n');
                    error = validateRequired(responsibilitiesArray, 'Responsibilities');
                    if (error) return error;
                    if (!responsibilitiesArray.every(r => r.trim().length >= 10)) {
                        error = 'Each responsibility should be at least 10 characters long.';
                    }
                } else if (fieldId.includes('jobTitle') || fieldId.includes('company') || fieldId.includes('location') || fieldId.includes('degree') || fieldId.includes('institution') || fieldId.includes('title') || fieldId.includes('organization')) {
                    error = validateMinLength(value as string, 2, fieldDisplayName);
                }
                break;
        }
        return error;
    };

    const handleChange = (section: keyof ResumeData, field: string, value: any, index?: number) => {
        setResumeData(prev => {
            const newData = { ...prev };
            if (index !== undefined && Array.isArray(newData[section])) {
                const newArray = [...(newData[section] as any[])];
                newArray[index] = { ...newArray[index], [field]: value };
                return { ...newData, [section]: newArray };
            } else if (typeof newData[section] === 'object' && newData[section] !== null && !Array.isArray(newData[section])) {
                 return { ...newData, [section]: { ...(newData[section] as object), [field]: value } };
            }
            // Direct field update for top-level fields like professionalSummary
            return { ...newData, [field]: value };
        });

        const fieldId = index !== undefined ? `${section}.${index}.${field}` : `${section}.${field}`;
        const errorMessage = runValidation(fieldId, value);
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldId]: errorMessage }));
    };

    const handleBlur = (section: keyof ResumeData, field: string, value: any, index?: number) => {
        const fieldId = index !== undefined ? `${section}.${index}.${field}` : `${section}.${field}`;
        const errorMessage = runValidation(fieldId, value);
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldId]: errorMessage }));
    };

    const handleListChange = <T extends {id: string}>(section: keyof ResumeData, action: 'add' | 'remove' | 'move', index: number, payload?: any) => {
        setResumeData(prev => {
            const list = [...(prev[section] as unknown as T[])];
            if (action === 'add') {
                const newItem = { ...payload, id: `${section.substring(0,2)}-${Date.now()}-${list.length}` };
                list.push(newItem);
                // After adding, immediately validate required fields for the new item
                const newErrors: FormErrors = {};
                for (const key of Object.keys(newItem)) {
                    const fieldId = `${section}.${list.length - 1}.${key}`;
                    const errorMessage = runValidation(fieldId, newItem[key as keyof T]);
                    if (errorMessage) {
                        newErrors[fieldId] = errorMessage;
                    }
                }
                setFormErrors(prevErrors => ({ ...prevErrors, ...newErrors }));

            } else if (action === 'remove') {
                const removedId = list[index].id;
                list.splice(index, 1);
                // Clear errors for the removed item
                setFormErrors(prevErrors => {
                    const updatedErrors = { ...prevErrors };
                    for (const key in updatedErrors) {
                        if (key.startsWith(`${section}.${index}.`) || key.includes(removedId)) { // Adjusting for actual index and direct ID match
                            delete updatedErrors[key];
                        }
                    }
                    // Re-index remaining errors if necessary (complex, simpler to re-validate on blur for others)
                    return updatedErrors;
                });
            } else if (action === 'move') {
                const direction = payload as 'up' | 'down';
                const newIndex = direction === 'up' ? index - 1 : index + 1;
                if (newIndex >= 0 && newIndex < list.length) {
                    [list[index], list[newIndex]] = [list[newIndex], list[index]];
                }
            }
            return { ...prev, [section]: list };
        });
    };

    const handleGetSuggestions = (context: string, text: string, field: string, index?: number) => {
        // This function now only sets the target for the AiOptimizationHub to pick up.
        // The actual API call with tone selection happens in the hub.
        setSuggestionTarget({ section: context === 'Professional Summary' ? 'summary' : 'workExperience', field, index });
        setContextualSuggestions([]); // Clear previous suggestions to trigger the tone selection UI
    };
    
    const handleVoiceInput = async (index: number) => {
        setIsVoiceInputLoading(true);
        // Simulate a voice-to-text API call and AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newBullet = "Streamlined project workflows, reducing delivery time by 15% and enhancing team productivity.";
        
        setResumeData(prev => {
            const newWorkExperience = [...prev.workExperience];
            if (newWorkExperience[index]) {
                newWorkExperience[index].responsibilities = [...newWorkExperience[index].responsibilities, newBullet];
            }
            return { ...prev, workExperience: newWorkExperience };
        });

        setIsVoiceInputLoading(false);
    };


    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <AccordionSection title="Contact Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contact.name">Full Name</Label>
                        <Input
                            id="contact.name" name="name" value={resumeData.contact.name}
                            onChange={e => handleChange('contact', 'name', e.target.value)}
                            onBlur={e => handleBlur('contact', 'name', e.target.value)}
                            error={!!formErrors['contact.name']} errorMessage={formErrors['contact.name']}
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact.email">Email</Label>
                        <Input
                            id="contact.email" name="email" type="email" value={resumeData.contact.email}
                            onChange={e => handleChange('contact', 'email', e.target.value)}
                            onBlur={e => handleBlur('contact', 'email', e.target.value)}
                            error={!!formErrors['contact.email']} errorMessage={formErrors['contact.email']}
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact.phone">Phone</Label>
                        <Input
                            id="contact.phone" name="phone" value={resumeData.contact.phone}
                            onChange={e => handleChange('contact', 'phone', e.target.value)}
                            onBlur={e => handleBlur('contact', 'phone', e.target.value)}
                            error={!!formErrors['contact.phone']} errorMessage={formErrors['contact.phone']}
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact.linkedin">LinkedIn</Label>
                        <Input
                            id="contact.linkedin" name="linkedin" value={resumeData.contact.linkedin}
                            onChange={e => handleChange('contact', 'linkedin', e.target.value)}
                            onBlur={e => handleBlur('contact', 'linkedin', e.target.value)}
                            error={!!formErrors['contact.linkedin']} errorMessage={formErrors['contact.linkedin']}
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact.github">GitHub</Label>
                        <Input
                            id="contact.github" name="github" value={resumeData.contact.github}
                            onChange={e => handleChange('contact', 'github', e.target.value)}
                            onBlur={e => handleBlur('contact', 'github', e.target.value)}
                            error={!!formErrors['contact.github']} errorMessage={formErrors['contact.github']}
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact.website">Website</Label>
                        <Input
                            id="contact.website" name="website" value={resumeData.contact.website}
                            onChange={e => handleChange('contact', 'website', e.target.value)}
                            onBlur={e => handleBlur('contact', 'website', e.target.value)}
                            error={!!formErrors['contact.website']} errorMessage={formErrors['contact.website']}
                        />
                    </div>
                </div>
            </AccordionSection>

            <AccordionSection title="Professional Summary">
                <div className="relative">
                    <Label htmlFor="professionalSummary">Summary</Label>
                    <Textarea
                        id="professionalSummary" name="professionalSummary"
                        rows={4}
                        value={resumeData.professionalSummary}
                        onChange={e => handleChange('professionalSummary', 'professionalSummary', e.target.value)}
                        onBlur={e => handleBlur('professionalSummary', 'professionalSummary', e.target.value)}
                        onFocus={() => setSuggestionTarget({section: 'summary', field: 'Professional Summary'})}
                        error={!!formErrors['professionalSummary']} errorMessage={formErrors['professionalSummary']}
                    />
                    <SuggestionButton
                        onClick={() => handleGetSuggestions('Professional Summary', resumeData.professionalSummary, 'Professional Summary')}
                        isLoading={isContextualLoading && suggestionTarget?.field === 'Professional Summary'}
                    />
                </div>
            </AccordionSection>

            <AccordionSection title="Work Experience" initiallyOpen={false}>
                <div className="space-y-4">
                    {resumeData.workExperience.map((exp, index) => (
                        <div key={exp.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-4">
                             <div className="flex justify-between items-start">
                                <p className="font-semibold text-text-main">{exp.jobTitle || 'New Position'}</p>
                                <div className="flex items-center">
                                    <ActionButton onClick={() => handleListChange<WorkExperience>('workExperience', 'move', index, 'up')} disabled={index === 0} title="Move up"><ChevronUpIcon className="h-5 w-5" /></ActionButton>
                                    <ActionButton onClick={() => handleListChange<WorkExperience>('workExperience', 'move', index, 'down')} disabled={index === resumeData.workExperience.length - 1} title="Move down"><ChevronDownIcon className="h-5 w-5" /></ActionButton>
                                    <ActionButton onClick={() => handleListChange<WorkExperience>('workExperience', 'remove', index)} title="Delete"><TrashIcon className="h-5 w-5 text-red-500/80 hover:text-red-600" /></ActionButton>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`workExperience.${index}.jobTitle`}>Job Title</Label>
                                    <Input
                                        id={`workExperience.${index}.jobTitle`} name={`workExperience.${index}.jobTitle`}
                                        value={exp.jobTitle}
                                        onChange={e => handleChange('workExperience', 'jobTitle', e.target.value, index)}
                                        onBlur={e => handleBlur('workExperience', 'jobTitle', e.target.value, index)}
                                        error={!!formErrors[`workExperience.${index}.jobTitle`]} errorMessage={formErrors[`workExperience.${index}.jobTitle`]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`workExperience.${index}.company`}>Company</Label>
                                    <Input
                                        id={`workExperience.${index}.company`} name={`workExperience.${index}.company`}
                                        value={exp.company}
                                        onChange={e => handleChange('workExperience', 'company', e.target.value, index)}
                                        onBlur={e => handleBlur('workExperience', 'company', e.target.value, index)}
                                        error={!!formErrors[`workExperience.${index}.company`]} errorMessage={formErrors[`workExperience.${index}.company`]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`workExperience.${index}.location`}>Location</Label>
                                    <Input
                                        id={`workExperience.${index}.location`} name={`workExperience.${index}.location`}
                                        value={exp.location}
                                        onChange={e => handleChange('workExperience', 'location', e.target.value, index)}
                                        onBlur={e => handleBlur('workExperience', 'location', e.target.value, index)}
                                        error={!!formErrors[`workExperience.${index}.location`]} errorMessage={formErrors[`workExperience.${index}.location`]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`workExperience.${index}.dates`}>Dates</Label>
                                    <Input
                                        id={`workExperience.${index}.dates`} name={`workExperience.${index}.dates`}
                                        value={exp.dates}
                                        onChange={e => handleChange('workExperience', 'dates', e.target.value, index)}
                                        onBlur={e => handleBlur('workExperience', 'dates', e.target.value, index)}
                                        error={!!formErrors[`workExperience.${index}.dates`]} errorMessage={formErrors[`workExperience.${index}.dates`]}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <Label htmlFor={`workExperience.${index}.responsibilities`}>Responsibilities / Achievements</Label>
                                <Textarea
                                    id={`workExperience.${index}.responsibilities`} name={`workExperience.${index}.responsibilities`}
                                    rows={5}
                                    value={exp.responsibilities.join('\n')}
                                    onChange={e => handleChange('workExperience', 'responsibilities', e.target.value.split('\n'), index)}
                                    onBlur={e => handleBlur('workExperience', 'responsibilities', e.target.value.split('\n'), index)}
                                    placeholder="Enter each responsibility on a new line."
                                    onFocus={() => setSuggestionTarget({section: 'workExperience', field: 'Responsibilities', index})}
                                    error={!!formErrors[`workExperience.${index}.responsibilities`]} errorMessage={formErrors[`workExperience.${index}.responsibilities`]}
                                />
                                <SuggestionButton
                                    onClick={() => handleGetSuggestions(`Responsibilities for ${exp.jobTitle}`, exp.responsibilities.join('\n'), 'Responsibilities', index)}
                                    isLoading={isContextualLoading && suggestionTarget?.index === index}
                                />
                                <VoiceInputButton
                                    onClick={() => handleVoiceInput(index)}
                                    isLoading={isVoiceInputLoading}
                                />
                            </div>
                        </div>
                    ))}
                    <AddButton onClick={() => handleListChange<WorkExperience>('workExperience', 'add', 0, { jobTitle: '', company: '', location: '', dates: '', responsibilities: [] })}>
                        Add Work Experience
                    </AddButton>
                </div>
            </AccordionSection>

            <AccordionSection title="Education" initiallyOpen={false}>
                <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                         <div key={edu.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-4">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-text-main">{edu.degree || 'New Degree'}</p>
                                <div className="flex items-center">
                                    <ActionButton onClick={() => handleListChange<Education>('education', 'move', index, 'up')} disabled={index === 0} title="Move up"><ChevronUpIcon className="h-5 w-5" /></ActionButton>
                                    <ActionButton onClick={() => handleListChange<Education>('education', 'move', index, 'down')} disabled={index === resumeData.education.length - 1} title="Move down"><ChevronDownIcon className="h-5 w-5" /></ActionButton>
                                    <ActionButton onClick={() => handleListChange<Education>('education', 'remove', index)} title="Delete"><TrashIcon className="h-5 w-5 text-red-500/80 hover:text-red-600" /></ActionButton>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`education.${index}.degree`}>Degree</Label>
                                    <Input
                                        id={`education.${index}.degree`} name={`education.${index}.degree`}
                                        value={edu.degree}
                                        onChange={e => handleChange('education', 'degree', e.target.value, index)}
                                        onBlur={e => handleBlur('education', 'degree', e.target.value, index)}
                                        error={!!formErrors[`education.${index}.degree`]} errorMessage={formErrors[`education.${index}.degree`]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`education.${index}.institution`}>Institution</Label>
                                    <Input
                                        id={`education.${index}.institution`} name={`education.${index}.institution`}
                                        value={edu.institution}
                                        onChange={e => handleChange('education', 'institution', e.target.value, index)}
                                        onBlur={e => handleBlur('education', 'institution', e.target.value, index)}
                                        error={!!formErrors[`education.${index}.institution`]} errorMessage={formErrors[`education.${index}.institution`]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`education.${index}.location`}>Location</Label>
                                    <Input
                                        id={`education.${index}.location`} name={`education.${index}.location`}
                                        value={edu.location}
                                        onChange={e => handleChange('education', 'location', e.target.value, index)}
                                        onBlur={e => handleBlur('education', 'location', e.target.value, index)}
                                        error={!!formErrors[`education.${index}.location`]} errorMessage={formErrors[`education.${index}.location`]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`education.${index}.dates`}>Dates</Label>
                                    <Input
                                        id={`education.${index}.dates`} name={`education.${index}.dates`}
                                        value={edu.dates}
                                        onChange={e => handleChange('education', 'dates', e.target.value, index)}
                                        onBlur={e => handleBlur('education', 'dates', e.target.value, index)}
                                        error={!!formErrors[`education.${index}.dates`]} errorMessage={formErrors[`education.${index}.dates`]}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                     <AddButton onClick={() => handleListChange<Education>('education', 'add', 0, { degree: '', institution: '', location: '', dates: '' })}>
                        Add Education
                    </AddButton>
                </div>
            </AccordionSection>

            <AccordionSection title="Skills" initiallyOpen={false}>
                <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                        id="skills" name="skills"
                        rows={4}
                        value={resumeData.skills.join(', ')}
                        onChange={e => handleChange('skills', 'skills', e.target.value)}
                        onBlur={e => handleBlur('skills', 'skills', e.target.value)}
                        placeholder="e.g., React, TypeScript, Project Management"
                        error={!!formErrors['skills']} errorMessage={formErrors['skills']}
                    />
                    <p className="text-xs text-slate-500 mt-1">Separate skills with a comma.</p>
                </div>
            </AccordionSection>

            <AccordionSection title="Awards & Certifications" initiallyOpen={false}>
                 <div className="space-y-4">
                    {resumeData.awardsAndCertifications.map((cert, index) => (
                         <div key={cert.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-4">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-text-main">{cert.title || 'New Award'}</p>
                                <div className="flex items-center">
                                    <ActionButton onClick={() => handleListChange<AwardOrCertification>('awardsAndCertifications', 'move', index, 'up')} disabled={index === 0} title="Move up"><ChevronUpIcon className="h-5 w-5" /></ActionButton>
                                    <ActionButton onClick={() => handleListChange<AwardOrCertification>('awardsAndCertifications', 'move', index, 'down')} disabled={index === resumeData.awardsAndCertifications.length - 1} title="Move down"><ChevronDownIcon className="h-5 w-5" /></ActionButton>
                                    <ActionButton onClick={() => handleListChange<AwardOrCertification>('awardsAndCertifications', 'remove', index)} title="Delete"><TrashIcon className="h-5 w-5 text-red-500/80 hover:text-red-600" /></ActionButton>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`awardsAndCertifications.${index}.title`}>Title</Label>
                                    <Input
                                        id={`awardsAndCertifications.${index}.title`} name={`awardsAndCertifications.${index}.title`}
                                        value={cert.title}
                                        onChange={e => handleChange('awardsAndCertifications', 'title', e.target.value, index)}
                                        onBlur={e => handleBlur('awardsAndCertifications', 'title', e.target.value, index)}
                                        error={!!formErrors[`awardsAndCertifications.${index}.title`]} errorMessage={formErrors[`awardsAndCertifications.${index}.title`]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`awardsAndCertifications.${index}.organization`}>Organization</Label>
                                    <Input
                                        id={`awardsAndCertifications.${index}.organization`} name={`awardsAndCertifications.${index}.organization`}
                                        value={cert.organization}
                                        onChange={e => handleChange('awardsAndCertifications', 'organization', e.target.value, index)}
                                        onBlur={e => handleBlur('awardsAndCertifications', 'organization', e.target.value, index)}
                                        error={!!formErrors[`awardsAndCertifications.${index}.organization`]} errorMessage={formErrors[`awardsAndCertifications.${index}.organization`]}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor={`awardsAndCertifications.${index}.date`}>Date</Label>
                                    <Input
                                        id={`awardsAndCertifications.${index}.date`} name={`awardsAndCertifications.${index}.date`}
                                        value={cert.date}
                                        onChange={e => handleChange('awardsAndCertifications', 'date', e.target.value, index)}
                                        onBlur={e => handleBlur('awardsAndCertifications', 'date', e.target.value, index)}
                                        error={!!formErrors[`awardsAndCertifications.${index}.date`]} errorMessage={formErrors[`awardsAndCertifications.${index}.date`]}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <AddButton onClick={() => handleListChange<AwardOrCertification>('awardsAndCertifications', 'add', 0, { title: '', organization: '', date: '' })}>
                        Add Award / Certification
                    </AddButton>
                </div>
            </AccordionSection>

        </form>
    );
};

export default ResumeForm;