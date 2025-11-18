import { Template } from '../types';

// In a real app, these thumbnails would be image URLs
const templates: Template[] = [
    {
        id: 'classic',
        name: 'Classic',
        thumbnail: '/templates/classic.png', // Placeholder path
        description: 'A timeless, professional layout.',
        categories: ['single-column', 'classic', 'professional']
    },
    {
        id: 'modern',
        name: 'Modern',
        thumbnail: '/templates/modern.png', // Placeholder path
        description: 'Bold headings and a clean structure.',
        categories: ['single-column', 'modern']
    },
     {
        id: 'corporate',
        name: 'Corporate',
        thumbnail: '/templates/corporate.png',
        description: 'A clean two-column look for business roles.',
        categories: ['two-column', 'corporate', 'professional']
    },
    {
        id: 'professional',
        name: 'Professional',
        thumbnail: '/templates/professional.png',
        description: 'A formal, serif-based design ideal for corporate roles.',
        categories: ['single-column', 'professional', 'classic']
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        thumbnail: '/templates/minimalist.png', // Placeholder path
        description: 'Elegant and focused on content.',
        categories: ['single-column', 'minimalist', 'modern']
    },
    {
        id: 'tech',
        name: 'Tech',
        thumbnail: '/templates/tech.png',
        description: 'A sharp, modern look for technical roles.',
        categories: ['single-column', 'tech', 'modern']
    },
    {
        id: 'creative',
        name: 'Creative',
        thumbnail: '/templates/creative.png', // Placeholder path
        description: 'A stylish two-column design.',
        categories: ['two-column', 'creative', 'modern']
    },
    {
        id: 'onyx',
        name: 'Onyx',
        thumbnail: '/templates/onyx.png',
        description: 'A premium two-column design with a dark sidebar.',
        categories: ['two-column', 'dark', 'modern']
    },
    {
        id: 'executive',
        name: 'Executive',
        thumbnail: '/templates/executive.png',
        description: 'A sophisticated two-column layout for senior roles.',
        categories: ['two-column', 'professional', 'corporate']
    },
    {
        id: 'cosmo',
        name: 'Cosmo',
        thumbnail: '/templates/cosmo.png',
        description: 'A stylish single-column design with a profile photo.',
        categories: ['single-column', 'photo', 'modern']
    },
    {
        id: 'galaxy',
        name: 'Galaxy',
        thumbnail: '/templates/galaxy.png',
        description: 'A bright, modern two-column design.',
        categories: ['two-column', 'modern', 'creative']
    },
    {
        id: 'academic',
        name: 'Academic',
        thumbnail: '/templates/academic.png',
        description: 'A traditional, clean layout for CVs and academia.',
        categories: ['single-column', 'academic', 'classic']
    },
    {
        id: 'infographic',
        name: 'Infographic',
        thumbnail: '/templates/infographic.png',
        description: 'Visually striking with a colored sidebar and skill bars.',
        categories: ['two-column', 'creative', 'modern']
    },
    {
        id: 'vanguard',
        name: 'Vanguard',
        thumbnail: '/templates/vanguard.png',
        description: 'A bold, impactful design with strong typography.',
        categories: ['single-column', 'bold', 'modern']
    },
    {
        id: 'spearmint',
        name: 'Spearmint',
        thumbnail: '/templates/spearmint.png',
        description: 'A fresh, clean two-column design with a light accent sidebar.',
        categories: ['two-column', 'creative', 'modern']
    },
    {
        id: 'journal',
        name: 'Journal',
        thumbnail: '/templates/journal.png',
        description: 'A classic, serif-based design for academic or literary fields.',
        categories: ['single-column', 'classic', 'academic']
    },
    {
        id: 'matrix',
        name: 'Matrix',
        thumbnail: '/templates/matrix.png',
        description: 'A dark-themed, monospace design for tech and developer roles.',
        categories: ['single-column', 'dark', 'tech']
    },
    {
        id: 'plum',
        name: 'Plum',
        thumbnail: '/templates/plum.png',
        description: 'A sophisticated and elegant single-column design.',
        categories: ['single-column', 'modern', 'elegant']
    },
    {
        id: 'blueprint',
        name: 'Blueprint',
        thumbnail: '/templates/blueprint.png',
        description: 'A structured two-column layout ideal for technical fields.',
        categories: ['two-column', 'tech', 'professional']
    }
];

export const getTemplates = (): Template[] => {
    return templates;
};