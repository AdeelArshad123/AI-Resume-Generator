import { useResume } from './useResume';
import React from 'react';
import { templateLook } from '../styles/templates'; // Import templateLook to check font families

// Define the shape of the style object
interface DynamicStyleSet {
    container: React.CSSProperties;
    name: React.CSSProperties;
    contact: React.CSSProperties;
    h2: React.CSSProperties;
    jobTitle: React.CSSProperties;
    jobMeta: React.CSSProperties;
    accentElement: React.CSSProperties;
}

export const useDynamicStyles = (templateId: string): DynamicStyleSet => {
    const { resumeData } = useResume();
    const { theme } = resumeData;

    const emptyStyles: DynamicStyleSet = { container: {}, name: {}, contact: {}, h2: {}, jobTitle: {}, accentElement: {}, jobMeta: {} };

    if (!theme) {
        return emptyStyles;
    }

    const { fontFamily, primaryColor, fontSize, fontWeight } = theme;

    const fontSizes = {
        sm: '11px',
        md: '12.5px', // Base size for A4/Letter paper
        lg: '14px'
    };

    const baseWeight = fontWeight === 'regular' ? 400 : 600;
    const headingWeight = fontWeight === 'regular' ? 700 : 800;
    
    // Default font families from templates.ts if needed for specific logic
    const templateStyle = templateLook[templateId as keyof typeof templateLook];
    const isSerif = templateStyle?.container?.includes('font-serif');

    // Use a specified font from theme, or inherit from template if not specified
    const selectedFont = fontFamily === 'Merriweather' || fontFamily === 'Poppins' ? fontFamily :
        (isSerif && fontFamily !== 'Inter' && fontFamily !== 'Lato') ? 'Merriweather' : 'Inter'; // Smart default
    
    const styles: DynamicStyleSet = {
        container: {
            fontFamily: `'${fontFamily}', ${isSerif ? 'serif' : 'sans-serif'}`,
            fontSize: fontSizes[fontSize],
            fontWeight: baseWeight,
        },
        name: {
            fontWeight: headingWeight,
        },
        contact: {},
        h2: {
            fontWeight: headingWeight,
        },
        jobTitle: {
            fontWeight: headingWeight,
        },
        jobMeta: {},
        accentElement: {},
    };
    
    // For templates with monospace fonts, let's apply them dynamically
    if (templateId === 'tech' || templateId === 'matrix') {
        const monoFont = "'Courier Prime', monospace";
        if (templateId === 'tech') {
            styles.name.fontFamily = monoFont;
            styles.contact.fontFamily = monoFont;
            styles.h2.fontFamily = monoFont;
        }
        styles.jobTitle.fontWeight = 700; // Tech roles often use bolder titles
    }


    // Template-specific color application logic
    switch (templateId) {
        case 'modern':
            styles.accentElement.borderColor = primaryColor;
            styles.h2.color = primaryColor;
            break;
        case 'minimalist':
            styles.jobTitle.color = primaryColor;
            break;
        case 'creative':
            styles.accentElement.backgroundColor = primaryColor;
            styles.name.color = 'white';
            styles.contact.color = 'rgba(255, 255, 255, 0.8)';
            styles.h2.borderColor = primaryColor;
            break;
        case 'onyx':
            styles.name.color = primaryColor;
            styles.h2.color = primaryColor;
            styles.h2.borderBottomColor = primaryColor;
            break;
        case 'galaxy':
            styles.name.color = primaryColor;
            styles.h2.color = primaryColor;
            break;
        case 'corporate':
            styles.name.color = primaryColor;
            styles.accentElement.backgroundColor = '#f8fafc'; // a light slate color always
            break;
        case 'tech':
            styles.name.color = primaryColor;
            styles.accentElement.borderColor = primaryColor; // This will color the header border
            styles.h2.borderBottomColor = primaryColor; // And section borders
            break;
        case 'infographic':
             styles.accentElement.backgroundColor = primaryColor; // Sidebar and skill bars
             styles.name.color = 'white'; // Name is on the colored sidebar
             styles.h2.color = primaryColor; // Section headers in the main content
            break;
        case 'executive':
            styles.accentElement.borderColor = primaryColor; // The sidebar right border
            styles.name.color = primaryColor;
            break;
        case 'cosmo':
            styles.name.color = primaryColor;
            styles.h2.borderColor = primaryColor;
            break;
        case 'vanguard':
            styles.accentElement.backgroundColor = primaryColor;
            styles.h2.color = primaryColor;
            break;
        case 'spearmint':
            // Use the primary color to generate a light background and border for the sidebar
            styles.accentElement.backgroundColor = `${primaryColor}1A`; // Add 10% opacity
            styles.accentElement.borderColor = `${primaryColor}4D`; // Add 30% opacity
            styles.name.color = primaryColor;
            break;
        case 'journal':
            styles.accentElement.borderColor = primaryColor;
            styles.name.color = primaryColor;
            break;
        case 'matrix':
            styles.container.backgroundColor = '#1e293b'; // slate-800
            styles.container.color = '#cbd5e1'; // slate-300
            styles.name.color = primaryColor;
            styles.contact.color = primaryColor;
            styles.h2.color = primaryColor;
            styles.jobTitle.color = '#f1f5f9'; // slate-100
            styles.jobMeta.color = primaryColor;
            break;
        case 'plum':
            styles.name.color = primaryColor;
            styles.h2.borderColor = primaryColor;
            styles.h2.color = primaryColor;
            break;
        case 'blueprint':
            styles.name.borderColor = primaryColor;
            styles.h2.color = primaryColor;
            break;
        case 'classic':
        case 'professional':
        case 'academic':
            styles.name.color = primaryColor;
            break;
        default:
            styles.h2.color = primaryColor;
            break;
    }
    
    return styles;
};