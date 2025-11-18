import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const teamMembers = [
    {
        name: 'Dr. Evelyn Reed',
        role: 'Founder & CEO',
        bio: 'With a Ph.D. in Human-Computer Interaction and a passion for ethical AI, Evelyn founded ResumeCraft to democratize access to professional career tools.',
        imageUrl: `https://i.pravatar.cc/150?u=evelyn`,
    },
    {
        name: 'Marcus Vance',
        role: 'Lead AI Engineer',
        bio: 'Marcus is the architect behind our intelligent resume analysis engine. He believes in creating AI that augments human potential, not replaces it.',
        imageUrl: `https://i.pravatar.cc/150?u=marcus`,
    },
    {
        name: 'Priya Singh',
        role: 'Head of Product & Design',
        bio: 'Priya obsesses over creating a seamless and empowering user experience. Her background in UX research ensures our platform is intuitive and effective.',
        imageUrl: `https://i.pravatar.cc/150?u=priya`,
    },
    {
        name: 'David Chen',
        role: 'Career Services Lead',
        bio: 'A former recruiter, David provides invaluable industry insight, ensuring our AI suggestions and templates meet the real-world demands of hiring managers.',
        imageUrl: `https://i.pravatar.cc/150?u=david`,
    },
];

const AboutPage: React.FC = () => {
    return (
        <div className="py-12 md:py-20 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-main font-heading">
                    Empowering Careers, One <span className="text-gradient">Resume</span> at a Time
                </h1>
                <p className="mt-4 text-lg text-text-muted">
                    We believe that a great resume is more than just a document; it's a key that unlocks opportunity. Our mission is to bridge the gap between talented individuals and their dream jobs using the power of intelligent technology.
                </p>
            </div>

            {/* Our Mission Section */}
            <Card className="max-w-5xl mx-auto mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-primary to-accent text-white">
                <div className="p-4">
                    <h2 className="text-3xl font-bold font-heading mb-4">Our Mission</h2>
                    <p className="text-white/90">
                        The job market is more competitive than ever. Applicant Tracking Systems (ATS) and overwhelming application volumes mean that great candidates are often overlooked.
                        <br/><br/>
                        ResumeCraft AI was born from a simple idea: to level the playing field. We leverage cutting-edge artificial intelligence to provide everyone—from recent graduates to seasoned executives—with the tools to build a compelling, professional, and ATS-optimized resume that truly reflects their skills and potential.
                    </p>
                </div>
                <div className="p-4">
                     <h2 className="text-3xl font-bold font-heading mb-4">Our Vision</h2>
                    <p className="text-white/90">
                        We envision a world where hiring is more efficient, equitable, and human. By helping candidates present their best selves, we empower them to confidently navigate their career paths. We're committed to building a platform that is not just a tool, but a trusted partner in your professional journey.
                    </p>
                </div>
            </Card>

            {/* Meet the Team Section */}
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-main font-heading">
                    Meet the Innovators Behind <span className="text-gradient">ResumeCraft</span>
                </h2>
                <p className="mt-4 text-lg text-text-muted">
                    We're a diverse team of technologists, designers, and career experts united by a single goal.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {teamMembers.map((member) => (
                    <Card key={member.name} className="text-center flex flex-col items-center">
                        <img
                            src={member.imageUrl}
                            alt={`Portrait of ${member.name}`}
                            className="w-32 h-32 rounded-full mb-4 object-cover ring-4 ring-primary/20"
                        />
                        <h3 className="text-xl font-bold text-text-main font-heading">{member.name}</h3>
                        <p className="text-primary font-semibold text-sm mb-2">{member.role}</p>
                        <p className="text-text-muted text-sm flex-grow">{member.bio}</p>
                    </Card>
                ))}
            </div>

            {/* CTA Section */}
             <div className="text-center mt-20 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-main font-heading">
                    Ready to Build Your Future?
                </h2>
                <p className="mt-4 text-lg text-text-muted">
                    Join thousands of successful professionals who have landed their dream jobs with a resume crafted by AI.
                </p>
                <div className="mt-8">
                     <Link to="/">
                        <Button variant="primary" className="text-lg">
                            Create Your Resume Now
                        </Button>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default AboutPage;
