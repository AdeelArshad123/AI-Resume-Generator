import { Contact, LinkedInImportedProfileData, LinkedInImportedWorkExperience, LinkedInImportedEducation } from '../types';

// This is a mock function. In a real application, this would involve
// an OAuth flow and API calls to the LinkedIn API.
export const importFromLinkedIn = async (): Promise<LinkedInImportedProfileData> => {
    console.log("Simulating LinkedIn login and data fetch...");
    // Simulate network delay and user interaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return mock data as if it were fetched from LinkedIn
    return {
        contact: {
            name: 'Alex Chen',
            email: 'alex.chen@example.com',
            phone: '555-123-9876',
            linkedin: 'https://linkedin.com/in/alexchen-dev',
            github: 'https://github.com/alexchen-dev',
            website: 'https://alexchen.dev',
            photoUrl: `https://i.pravatar.cc/150?u=alexchen`,
        },
        headline: 'Senior Software Engineer | React, Node.js, Cloud Architect | Driving Innovation & Scalability',
        aboutSection: 'Highly skilled Senior Software Engineer with over 10 years of experience in designing, developing, and deploying scalable web applications. Proven expertise in JavaScript, React, Node.js, and cloud-native technologies (AWS, GCP). Passionate about building high-performance teams, fostering a culture of technical excellence, and delivering user-centric products that solve real-world problems. Always eager to learn new technologies and contribute to open-source projects. Let\'s connect and build something amazing!',
        workExperience: [
            {
                jobTitle: 'Senior Software Engineer',
                company: 'InnovateTech Solutions',
                location: 'San Francisco, CA',
                dates: 'Jan 2020 – Present',
                description: 'Led a team of 5 engineers in developing and maintaining critical backend services using Node.js and AWS Lambda. Designed and implemented new features for a customer-facing React application, resulting in a 20% increase in user engagement. Mentored junior developers and conducted code reviews to ensure high-quality, maintainable code.'
            },
            {
                jobTitle: 'Software Developer',
                company: 'WebPulse Inc.',
                location: 'Seattle, WA',
                dates: 'Jul 2015 – Dec 2019',
                description: 'Developed robust web applications using Python/Django and React. Collaborated with product managers and UX/UI designers to translate wireframes into functional features. Optimized database queries and application performance, reducing load times by 30%.'
            }
        ],
        education: [
            {
                degree: 'Master of Science in Computer Science',
                institution: 'University of Washington',
                fieldOfStudy: 'Software Engineering',
                dates: '2018 – 2019'
            },
            {
                degree: 'Bachelor of Science in Computer Science',
                institution: 'University of California, Berkeley',
                fieldOfStudy: 'Computer Science',
                dates: '2011 – 2015'
            }
        ],
        skills: [
            'React', 'Node.js', 'TypeScript', 'AWS', 'GCP', 'JavaScript', 'Python', 'Django', 'REST APIs', 'Microservices', 'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'Agile Methodologies', 'Leadership', 'Mentoring', 'System Design'
        ]
    };
};