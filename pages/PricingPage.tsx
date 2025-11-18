import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CheckMark: React.FC = () => (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const PricingPage: React.FC = () => {
    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-text-main font-heading">Choose Your <span className="text-gradient">Plan</span></h1>
                <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
                    Start for free, and upgrade when you're ready to unlock your full potential.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Free Tier */}
                <Card className="flex flex-col border border-slate-200">
                    <h3 className="text-2xl font-bold font-heading text-text-main">Free</h3>
                    <p className="text-text-muted mt-2">Perfect for getting started.</p>
                    <p className="text-5xl font-extrabold my-6 text-slate-800">$0 <span className="text-lg font-medium text-text-muted">/ month</span></p>
                    <ul className="space-y-4 text-text-muted flex-grow">
                        <li className="flex items-center"><CheckMark /><span className="ml-2">3 AI Resume Generations</span></li>
                        <li className="flex items-center"><CheckMark /><span className="ml-2">Basic ATS Checks</span></li>
                        <li className="flex items-center"><CheckMark /><span className="ml-2">PDF Export</span></li>
                    </ul>
                    <Button variant="secondary" className="w-full mt-8">Get Started</Button>
                </Card>

                {/* Pro Tier */}
                <div className="rounded-lg p-1 bg-gradient-to-r from-primary to-accent relative shadow-2xl">
                    <Card className="flex flex-col h-full">
                        <div className="absolute top-0 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 text-sm font-semibold rounded-full shadow-lg shadow-primary/30">MOST POPULAR</div>
                        <h3 className="text-2xl font-bold font-heading text-text-main">Pro</h3>
                        <p className="text-text-muted mt-2">For the serious job seeker.</p>
                        <p className="text-5xl font-extrabold my-6 text-slate-800">$19 <span className="text-lg font-medium text-text-muted">/ month</span></p>
                        <ul className="space-y-4 text-text-muted flex-grow">
                            <li className="flex items-center"><CheckMark /><span className="ml-2">Unlimited AI Generations</span></li>
                            <li className="flex items-center"><CheckMark /><span className="ml-2">Full ATS Analysis & Suggestions</span></li>
                            <li className="flex items-center"><CheckMark /><span className="ml-2">Unlimited AI Content Enhancements</span></li>
                            <li className="flex items-center"><CheckMark /><span className="ml-2">PDF & DOCX Export</span></li>
                            <li className="flex items-center"><CheckMark /><span className="ml-2">Priority Support</span></li>
                        </ul>
                        <Button variant="primary" className="w-full mt-8">Go Pro</Button>
                    </Card>
                </div>

                {/* Enterprise Tier */}
                <Card className="flex flex-col border border-slate-200">
                    <h3 className="text-2xl font-bold font-heading text-text-main">Enterprise</h3>
                    <p className="text-text-muted mt-2">For teams and organizations.</p>
                    <p className="text-5xl font-extrabold my-6 text-slate-800">Custom</p>
                     <ul className="space-y-4 text-text-muted flex-grow">
                        <li className="flex items-center"><CheckMark /><span className="ml-2">Everything in Pro, plus:</span></li>
                        <li className="flex items-center"><CheckMark /><span className="ml-2">Team Management & Billing</span></li>
                        <li className="flex items-center"><CheckMark /><span className="ml-2">Custom Templates</span></li>
                        <li className="flex items-center"><CheckMark /><span className="ml-2">Dedicated Account Manager</span></li>
                    </ul>
                    <Button variant="secondary" className="w-full mt-8">Contact Us</Button>
                </Card>
            </div>
        </div>
    );
};

export default PricingPage;