import React from 'react';
import Card from '../components/ui/Card';

const CheckIcon: React.FC = () => (
    <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const AiIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const DesignIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
);

const OptimizeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


interface Feature {
    title: string;
    description: string;
}

interface FeatureCategory {
    icon: React.ReactNode;
    categoryTitle: string;
    features: Feature[];
}

const featureCategories: FeatureCategory[] = [
    {
        icon: <AiIcon className="h-8 w-8 text-white" />,
        categoryTitle: 'Smart AI Writing Assistant',
        features: [
            { title: 'AI Resume Generation', description: 'Describe your experience and our AI crafts a professional resume from scratch.' },
            { title: 'Contextual Suggestions', description: 'Get real-time, actionable advice to improve every section.' },
            { title: 'Cover Letter Generator', description: 'Instantly create tailored cover letters that match the job description.' },
            { title: 'Job Match Analysis', description: 'Paste any job description to see your match score and get optimization tips.' },
        ],
    },
    {
        icon: <DesignIcon className="h-8 w-8 text-white" />,
        categoryTitle: 'Professional Design & Templates',
        features: [
            { title: 'Recruiter-Approved Templates', description: 'Choose from a library of stunning, ATS-friendly designs for any industry.' },
            { title: 'Full Customization', description: 'Easily adjust colors, fonts, and layouts to create a unique look.' },
            { title: 'One-Click Redesign', description: 'Preview your content in any template instantly without losing your work.' },
            { title: 'Multi-Format Export', description: 'Download your resume as a pixel-perfect PDF, DOCX, or TXT file.' },
        ],
    },
    {
        icon: <OptimizeIcon className="h-8 w-8 text-white" />,
        categoryTitle: 'Advanced Optimization Tools',
        features: [
            { title: 'Live ATS Scoring', description: 'Watch your Applicant Tracking System (ATS) score update in real-time as you write.' },
            { title: 'Keyword Optimization', description: 'Our AI identifies and suggests critical keywords missing from your resume.' },
            { title: 'LinkedIn Import', description: 'Kickstart your resume by importing your profile data with a single click.' },
            { title: 'Drag & Drop Editor', description: 'Effortlessly rearrange sections to highlight your strongest qualifications.' },
        ],
    },
];

const FeaturesPage: React.FC = () => {
    return (
        <div className="py-12 md:py-20">
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-main font-heading">
                    Features That Help You <span className="text-gradient">Stand Out</span>
                </h1>
                <p className="mt-4 text-lg text-text-muted">
                    From AI-powered writing to professional designs, ResumeCraft AI gives you the tools to land your dream job.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {featureCategories.map((category) => (
                    <Card key={category.categoryTitle} className="flex flex-col border border-slate-200/80 !p-0 overflow-hidden">
                        <div className="p-6 bg-gradient-to-br from-primary to-accent">
                             <div className="flex items-center space-x-4">
                                <div className="bg-white/20 p-3 rounded-lg">
                                    {category.icon}
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-white">{category.categoryTitle}</h3>
                            </div>
                        </div>
                        <ul className="p-6 space-y-4 flex-grow">
                            {category.features.map((feature) => (
                                <li key={feature.title} className="flex items-start space-x-3">
                                    <CheckIcon />
                                    <div>
                                        <h4 className="font-semibold text-text-main">{feature.title}</h4>
                                        <p className="text-sm text-text-muted">{feature.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FeaturesPage;
