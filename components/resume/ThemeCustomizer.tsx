import React, { useRef } from 'react';
import { useResume } from '../../hooks/useResume';
import { ThemeCustomization } from '../../types';

const fonts = [
    { name: 'Inter', family: 'Inter, sans-serif' },
    { name: 'Poppins', family: 'Poppins, sans-serif' },
    { name: 'Lato', family: 'Lato, sans-serif' },
    { name: 'Merriweather', family: 'Merriweather, serif' },
];

const colors = [
    '#0ea5e9', // sky-500
    '#818cf8', // indigo-400
    '#10b981', // emerald-500
    '#f97316', // orange-500
    '#64748b', // slate-500
    '#1e293b', // slate-800
];

const fontSizes: { id: ThemeCustomization['fontSize']; label: string }[] = [
    { id: 'sm', label: 'S' },
    { id: 'md', label: 'M' },
    { id: 'lg', label: 'L' },
];

const fontWeights: { id: ThemeCustomization['fontWeight']; label: string }[] = [
    { id: 'regular', label: 'Regular' },
    { id: 'semibold', label: 'Semibold' },
];

const themePresets: { [key: string]: Partial<ThemeCustomization> } = {
    Clean: {
        fontFamily: 'Inter',
        primaryColor: '#3b82f6', // blue-500
        fontSize: 'sm',
        fontWeight: 'regular',
    },
    Modern: {
        fontFamily: 'Poppins',
        primaryColor: '#1e293b', // slate-800
        fontSize: 'md',
        fontWeight: 'semibold',
    },
    Elegant: {
        fontFamily: 'Merriweather',
        primaryColor: '#6d28d9', // violet-700
        fontSize: 'md',
        fontWeight: 'regular',
    }
};

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-sm font-medium text-text-muted mb-2">{children}</label>
);

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const UploadIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const ThemeCustomizer: React.FC = () => {
    const { resumeData, updateTheme } = useResume();
    const { theme } = resumeData;
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!theme) return null;

    const handleApplyPreset = (preset: Partial<ThemeCustomization>) => {
        updateTheme(preset);
    };

    const handleExportTheme = () => {
        const themeJson = JSON.stringify(theme, null, 2);
        const blob = new Blob([themeJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resumecraft-theme.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Invalid file content");
                
                const importedTheme = JSON.parse(text);

                // Basic validation
                if (
                    'fontFamily' in importedTheme &&
                    'primaryColor' in importedTheme &&
                    'fontSize' in importedTheme &&
                    'fontWeight' in importedTheme
                ) {
                    updateTheme(importedTheme);
                } else {
                    alert('Invalid theme file format.');
                }
            } catch (error) {
                console.error("Failed to import theme:", error);
                alert('Could not read the theme file. Please ensure it is a valid JSON file.');
            }
        };
        reader.onerror = () => {
             alert('Error reading file.');
        };
        reader.readAsText(file);

        // Reset file input value to allow re-uploading the same file
        event.target.value = '';
    };

    return (
        <div className="space-y-6">
            <div>
                 <h3 className="text-lg font-semibold text-text-main font-heading mb-4">Theme Style</h3>
                 <p className="text-sm text-text-muted mb-4">Apply a preset style for a quick, professional look.</p>
                 <div className="space-y-3">
                    {Object.entries(themePresets).map(([name, preset]) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className="w-full text-left p-3 border rounded-md transition-all bg-white border-slate-300 hover:border-primary/50"
                        >
                            <p className="font-semibold text-text-main">{name}</p>
                        </button>
                    ))}
                 </div>
            </div>
            
            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-text-main font-heading mb-4">Customize Manually</h3>
                <div className="space-y-6">
                    {/* Font Family */}
                    <div>
                        <FieldLabel>Font Family</FieldLabel>
                        <select
                            value={theme.fontFamily}
                            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                            {fonts.map(font => (
                                <option key={font.name} value={font.name} style={{ fontFamily: font.family }}>{font.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Primary Color */}
                    <div>
                        <FieldLabel>Primary Color</FieldLabel>
                        <div className="flex items-center space-x-2">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => updateTheme({ primaryColor: color })}
                                    className={`w-7 h-7 rounded-full border-2 transition-transform transform hover:scale-110 ${theme.primaryColor.toLowerCase() === color.toLowerCase() ? 'border-primary ring-2 ring-primary/30' : 'border-white'}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                            <div className="relative w-7 h-7" title="Custom Color">
                                <input
                                    type="color"
                                    value={theme.primaryColor}
                                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="custom-color-picker"
                                />
                                <label
                                    htmlFor="custom-color-picker"
                                    className="w-full h-full block rounded-full border-2 border-white cursor-pointer transition-transform transform hover:scale-110"
                                    style={{ background: 'conic-gradient(from 180deg at 50% 50%, #EF4444 0deg, #F59E0B 60deg, #84CC16 120deg, #3B82F6 180deg, #8B5CF6 240deg, #EC4899 300deg, #EF4444 360deg)' }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Font Size */}
                    <div>
                        <FieldLabel>Font Size</FieldLabel>
                        <div className="grid grid-cols-3 gap-2">
                            {fontSizes.map(({ id, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => updateTheme({ fontSize: id })}
                                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors border ${
                                        theme.fontSize === id
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Weight */}
                    <div>
                        <FieldLabel>Font Weight</FieldLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {fontWeights.map(({ id, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => updateTheme({ fontWeight: id })}
                                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors border ${
                                        theme.fontWeight === id
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
                 <h3 className="text-lg font-semibold text-text-main font-heading mb-4">Manage Theme</h3>
                 <p className="text-sm text-text-muted mb-4">Save your current customization as a shareable file, or load a previously saved theme.</p>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={handleExportTheme}
                        className="w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center text-slate-700 bg-white hover:bg-slate-50 border border-slate-300">
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Export Theme
                    </button>
                    <button 
                        onClick={handleImportClick}
                        className="w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center text-slate-700 bg-white hover:bg-slate-50 border border-slate-300">
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Import Theme
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json"
                    />
                 </div>
            </div>
        </div>
    );
};

export default ThemeCustomizer;