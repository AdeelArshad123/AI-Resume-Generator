// Refactor: Use a `layout` property as a discriminated union for improved type safety and rendering logic.
interface BaseStyle {
    container: string;
    name: string;
    contact: string;
    main: string;
    h2: string;
    section: string;
    jobTitle: string;
    jobMeta: string;
    jobOrg: string;
    list: string;
    // Optional styles for specific templates like 'infographic'
    skillItem?: string;
    skillBar?: string;
    skillBarProgress?: string;
}

export interface SingleColumnStyle extends BaseStyle {
    layout: 'single';
    hasPhoto?: boolean;
    header: string;
}

export interface TwoColumnStyle extends BaseStyle {
    layout: 'two';
    sidebar: string;
    sidebarContent: string;
    sidebarSections: string[];
}

export type TemplateStyle = SingleColumnStyle | TwoColumnStyle;

export const templateLook: { [key: string]: TemplateStyle } = {
    classic: {
        layout: 'single',
        container: 'font-merriweather text-slate-800 p-8',
        header: 'text-center mb-8 border-b-2 border-slate-800 pb-4',
        name: 'text-4xl font-bold tracking-wider',
        contact: 'text-sm mt-2',
        main: 'space-y-6 text-sm',
        h2: 'text-lg font-bold text-slate-900 tracking-widest border-b border-slate-300 pb-1 mb-2',
        section: 'space-y-4',
        jobTitle: 'font-bold',
        jobMeta: 'font-semibold text-slate-600',
        jobOrg: 'text-slate-700 italic',
        list: 'list-disc list-inside mt-2 space-y-1 text-slate-800'
    },
    modern: {
        layout: 'single',
        container: 'font-lato text-slate-800 p-8',
        header: 'text-left mb-6 pb-2 border-b-2', // Removed border-primary
        name: 'text-4xl font-bold text-slate-900',
        contact: 'text-sm mt-1 text-slate-600',
        main: 'space-y-6 text-sm',
        h2: 'text-sm font-bold uppercase tracking-wider mb-3', // Removed text-primary
        section: 'space-y-4',
        jobTitle: 'font-bold text-lg',
        jobMeta: 'text-sm text-slate-500',
        jobOrg: 'text-slate-700',
        list: 'list-disc list-inside mt-2 space-y-1 text-slate-800 text-sm'
    },
    minimalist: {
        layout: 'single',
        container: 'font-inter text-slate-800 p-10',
        header: 'text-left mb-10',
        name: 'text-5xl font-extrabold text-slate-800',
        contact: 'text-xs mt-3 text-slate-500 tracking-wider',
        main: 'space-y-8',
        h2: 'text-xl font-bold text-slate-800 flex items-center mb-4',
        section: 'pb-4 border-l-2 border-slate-200 pl-6 relative before:content-[\'\'] before:w-3 before:h-3 before:bg-white before:border-2 before:border-slate-300 before:rounded-full before:absolute before:-left-[7px] before:top-1.5',
        jobTitle: 'font-semibold text-base', // Removed text-primary
        jobMeta: 'text-xs font-medium text-slate-400',
        jobOrg: 'text-sm text-slate-600',
        list: 'mt-2 space-y-1.5 text-sm text-slate-700'
    },
    professional: {
        layout: 'single',
        container: 'font-serif text-slate-900 p-8',
        header: 'text-center mb-6',
        name: 'text-4xl font-semibold tracking-widest',
        contact: 'text-xs mt-2 text-slate-600 tracking-wider',
        main: 'space-y-5 text-sm',
        h2: 'text-sm font-bold text-slate-800 tracking-widest uppercase border-y-2 border-slate-800 py-2 my-4 text-center',
        section: 'space-y-3',
        jobTitle: 'font-bold text-base',
        jobMeta: 'font-normal text-slate-600 italic',
        jobOrg: 'text-slate-700',
        list: 'list-none mt-2 space-y-1 text-slate-800'
    },
    creative: {
        layout: 'two',
        container: 'font-sans p-0',
        sidebar: 'w-1/3 bg-slate-800 text-white p-8',
        sidebarContent: 'text-left space-y-6',
        main: 'w-2/3 p-8 space-y-6 text-sm bg-white text-slate-700',
        name: 'text-4xl font-bold',
        contact: 'text-sm mt-2 text-slate-300 break-words',
        h2: 'text-lg font-bold text-slate-800 border-l-4 pl-3',
        section: 'space-y-4',
        jobTitle: 'font-bold',
        jobMeta: 'font-semibold text-slate-500',
        jobOrg: 'text-slate-600',
        list: 'list-disc list-inside mt-2 space-y-1 text-slate-700',
        sidebarSections: ['contact']
    },
    onyx: {
        layout: 'two',
        container: 'font-lato text-slate-700',
        sidebar: 'w-1/3 bg-slate-800 text-white p-6 text-center',
        sidebarContent: 'mt-6 text-left space-y-6',
        main: 'w-2/3 p-8 space-y-6',
        name: 'text-3xl font-bold tracking-wider',
        contact: 'text-xs mt-2 break-words',
        h2: 'text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1',
        section: 'space-y-4',
        jobTitle: 'font-bold text-lg text-slate-800',
        jobMeta: 'text-sm text-slate-500',
        jobOrg: 'text-slate-700 font-semibold',
        list: 'list-disc list-inside mt-2 space-y-1 text-slate-700 text-sm',
        sidebarSections: ['contact', 'skills']
    },
    galaxy: {
        layout: 'two',
        container: 'font-sans text-slate-800',
        sidebar: 'w-1/3 bg-slate-50 p-6 text-left border-r border-slate-200',
        sidebarContent: 'mt-6 space-y-6',
        main: 'w-2/3 p-8 space-y-6',
        name: 'text-4xl font-extrabold',
        contact: 'text-xs mt-2 text-slate-500 break-words',
        h2: 'text-base font-bold mb-3',
        section: 'space-y-4 text-sm',
        jobTitle: 'font-bold text-base text-slate-800',
        jobMeta: 'text-xs text-slate-400',
        jobOrg: 'text-slate-600 font-semibold',
        list: 'list-disc list-inside mt-2 space-y-1',
        sidebarSections: ['contact', 'skills']
    },
    academic: {
        layout: 'single',
        container: 'font-serif text-slate-800 p-8',
        header: 'text-center mb-6',
        name: 'text-4xl font-bold',
        contact: 'text-sm mt-2 text-slate-600',
        main: 'space-y-5 text-sm',
        h2: 'text-base font-semibold text-slate-900 border-b border-slate-300 pb-1 mb-3',
        section: 'space-y-3',
        jobTitle: 'font-bold',
        jobMeta: 'text-sm text-slate-600',
        jobOrg: 'italic text-slate-700',
        list: 'list-disc list-inside mt-2 space-y-1 text-slate-800'
    },
    corporate: {
        layout: 'two',
        container: 'font-serif text-slate-800',
        sidebar: 'w-1/3 bg-slate-50 p-6 text-left border-r border-slate-200',
        sidebarContent: 'mt-6 space-y-6 text-sm',
        main: 'w-2/3 p-8 space-y-6 text-sm',
        name: 'text-3xl font-bold tracking-tight',
        contact: 'text-xs mt-2 break-words',
        h2: 'text-base font-semibold text-slate-800 tracking-wider border-b border-slate-300 pb-1 mb-3',
        section: 'space-y-4',
        jobTitle: 'font-bold text-base',
        jobMeta: 'text-xs text-slate-500',
        jobOrg: 'text-slate-700',
        list: 'list-disc list-inside mt-2 space-y-1',
        sidebarSections: ['contact', 'skills', 'education']
    },
    tech: {
        layout: 'single',
        container: 'font-sans text-slate-700 p-8',
        header: 'mb-6 pb-3 border-b-2 border-slate-200',
        name: 'text-4xl font-bold font-mono tracking-tighter',
        contact: 'text-sm mt-2 font-mono',
        main: 'space-y-6 text-sm',
        h2: 'text-base font-semibold font-mono tracking-wide border-b border-slate-200 pb-2 mb-3',
        section: 'space-y-4',
        jobTitle: 'font-bold text-base',
        jobMeta: 'text-xs text-slate-500 font-mono',
        jobOrg: 'text-slate-600',
        list: 'list-disc list-inside mt-2 space-y-1'
    },
    infographic: {
        layout: 'two',
        container: 'font-sans text-slate-800',
        sidebar: 'w-1/3 text-white p-6 text-left', // Background color from dynamic styles
        sidebarContent: 'mt-6 space-y-6 text-sm',
        main: 'w-2/3 p-8 space-y-8',
        name: 'text-4xl font-extrabold tracking-tight',
        contact: 'text-xs mt-2 break-words',
        h2: 'text-lg font-bold uppercase tracking-wider mb-4',
        section: 'space-y-4 text-sm',
        jobTitle: 'font-bold text-base',
        jobMeta: 'text-xs text-slate-500',
        jobOrg: 'font-semibold text-slate-600',
        list: 'list-disc list-inside mt-2 space-y-1',
        sidebarSections: ['contact', 'skills', 'education'],
        skillItem: 'mb-3',
        skillBar: 'w-full bg-white/30 rounded-full h-2 mt-1',
        skillBarProgress: 'h-2 rounded-full bg-white'
    },
    executive: {
        layout: 'two',
        container: 'font-lato text-slate-800',
        sidebar: 'w-1/3 bg-white p-8 text-left border-r-2 border-slate-800',
        sidebarContent: 'mt-8 space-y-8',
        main: 'w-2/3 p-8 space-y-6',
        name: 'text-5xl font-extrabold tracking-tighter',
        contact: 'text-sm mt-4 text-slate-600',
        h2: 'text-sm font-bold uppercase tracking-widest text-slate-500 mb-3',
        section: 'space-y-4 text-sm',
        jobTitle: 'text-lg font-bold',
        jobMeta: 'text-xs text-slate-500',
        jobOrg: 'font-semibold text-slate-700',
        list: 'list-disc list-inside mt-2 space-y-1',
        sidebarSections: ['contact', 'skills']
    },
    cosmo: {
        layout: 'single',
        hasPhoto: true,
        container: 'font-inter text-slate-700 p-8',
        header: 'text-center mb-8 flex flex-col items-center',
        name: 'text-4xl font-bold mt-4',
        contact: 'text-sm mt-2 text-slate-500',
        main: 'space-y-6 text-sm',
        h2: 'text-base font-semibold text-slate-800 tracking-wider border-b-2 pb-2 mb-3',
        section: 'space-y-4',
        jobTitle: 'font-bold',
        jobMeta: 'text-xs text-slate-500',
        jobOrg: 'font-semibold text-slate-600',
        list: 'list-disc list-inside mt-2 space-y-1'
    },
    vanguard: {
        layout: 'single',
        container: 'font-poppins text-slate-800 p-8',
        header: 'text-center mb-6 p-6 rounded-lg', // BG color from dynamic
        name: 'text-4xl font-extrabold text-white',
        contact: 'text-sm mt-2 text-white/80',
        main: 'space-y-6 text-sm',
        h2: 'text-xl font-bold mb-3',
        section: 'space-y-4',
        jobTitle: 'font-bold text-lg',
        jobMeta: 'text-xs text-slate-400',
        jobOrg: 'font-semibold',
        list: 'list-disc list-inside mt-2 space-y-1'
    },
    spearmint: {
        layout: 'two',
        container: 'font-sans text-slate-800',
        sidebar: 'w-1/3 bg-emerald-50 p-6 text-left border-r border-emerald-200',
        sidebarContent: 'mt-6 space-y-6 text-sm',
        main: 'w-2/3 p-8 space-y-6 text-sm',
        name: 'text-3xl font-bold tracking-tight',
        contact: 'text-xs mt-2 break-words',
        h2: 'text-base font-semibold text-slate-800 tracking-wider border-b border-slate-300 pb-1 mb-3',
        section: 'space-y-4',
        jobTitle: 'font-bold text-base',
        jobMeta: 'text-xs text-slate-500',
        jobOrg: 'text-slate-700',
        list: 'list-disc list-inside mt-2 space-y-1',
        sidebarSections: ['contact', 'skills', 'education']
    },
    journal: {
        layout: 'single',
        container: 'font-merriweather text-slate-900 p-10 border-4 border-slate-900',
        header: 'text-center mb-6 pb-2 border-b-2 border-slate-300',
        name: 'text-4xl font-bold',
        contact: 'text-sm mt-2 text-slate-600',
        main: 'space-y-6 text-sm',
        h2: 'text-lg font-semibold text-center tracking-widest my-3',
        section: 'space-y-4',
        jobTitle: 'font-bold',
        jobMeta: 'italic text-slate-600',
        jobOrg: 'text-slate-700',
        list: 'list-disc list-inside mt-2 space-y-1'
    },
    matrix: {
        layout: 'single',
        container: 'font-mono bg-slate-900 text-slate-300 p-8',
        header: 'mb-6',
        name: 'text-4xl font-bold',
        contact: 'text-sm mt-2',
        main: 'space-y-6 text-sm',
        h2: 'text-base font-semibold tracking-wide mb-3',
        section: 'space-y-4 border-l border-green-500/50 pl-4',
        jobTitle: 'font-bold text-base text-slate-100',
        jobMeta: 'text-xs text-green-400',
        jobOrg: 'text-slate-300',
        list: 'list-disc list-inside mt-2 space-y-1'
    },
    plum: {
        layout: 'single',
        container: 'font-lato text-slate-800 p-8',
        header: 'text-left mb-8',
        name: 'text-5xl font-bold',
        contact: 'text-sm mt-2 text-slate-500',
        main: 'space-y-6 text-sm',
        h2: 'text-xl font-semibold border-b-2 pb-2 mb-4',
        section: 'space-y-4',
        jobTitle: 'font-bold text-lg',
        jobMeta: 'text-sm text-slate-500',
        jobOrg: 'text-slate-700',
        list: 'list-disc list-inside mt-2 space-y-1 text-sm'
    },
    blueprint: {
        layout: 'two',
        container: 'font-sans text-slate-700 p-0',
        sidebar: 'w-1/3 bg-white p-6 border-r-2 border-slate-200',
        sidebarContent: 'space-y-6',
        main: 'w-2/3 bg-slate-50/50 p-8 space-y-6',
        name: 'text-3xl font-bold border-b-4 pb-2',
        contact: 'text-xs mt-4 space-y-1',
        h2: 'text-sm font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-300 pb-1',
        section: 'space-y-4 text-sm',
        jobTitle: 'font-bold text-base',
        jobMeta: 'text-xs text-slate-400',
        jobOrg: 'font-semibold',
        list: 'list-disc list-inside mt-2 space-y-1',
        sidebarSections: ['contact', 'skills']
    }
};