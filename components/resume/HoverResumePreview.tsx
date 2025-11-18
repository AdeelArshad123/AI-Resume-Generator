import React from 'react';
import { useResume } from '../../hooks/useResume';
import { UserIcon, SparklesIcon, BriefcaseIcon, GraduationCapIcon, AwardIcon, IconComponentProps } from './TemplateIcons';
import { templateLook, SingleColumnStyle, TwoColumnStyle } from '../../styles/templates';
import { useDynamicStyles } from '../../hooks/useDynamicStyles';

interface HoverResumePreviewProps {
    templateId: string;
}

const PhotoPlaceholder: React.FC<{ style?: React.CSSProperties; className?: string }> = ({ style, className = '' }) => (
    <div className={`w-full h-full bg-slate-200 flex items-center justify-center rounded-full ${className}`}>
        <svg style={style} className="w-1/2 h-1/2 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
    </div>
);


const HoverResumePreview: React.FC<HoverResumePreviewProps> = ({ templateId }) => {
    const { resumeData } = useResume();
    
    const styles = templateLook[templateId as keyof typeof templateLook] || templateLook.classic;
    const dynamicStyles = useDynamicStyles(templateId);

    if (!resumeData) return null;
    const { contact, professionalSummary, workExperience, skills, education, awardsAndCertifications, sectionOrder } = resumeData;

    const renderSectionHeader = (title: string) => {
        const icons: { [key: string]: React.ReactElement<IconComponentProps> } = {
            'PROFESSIONAL SUMMARY': <UserIcon />,
            'SKILLS': <SparklesIcon />,
            'WORK EXPERIENCE': <BriefcaseIcon />,
            'EDUCATION': <GraduationCapIcon />,
            'AWARDS & CERTIFICATIONS': <AwardIcon />,
        };
        const iconElement = (templateId === 'minimalist' || styles.layout === 'two') ? React.cloneElement(icons[title], { style: { color: dynamicStyles.h2.color }}) : null;

        return (
            <h2 className={styles.h2} style={dynamicStyles.h2}>
                {iconElement}
                {title}
            </h2>
        );
    };

    const sections: { [key: string]: React.ReactNode } = {
        summary: (
            <section key="summary" className={styles.section}>
                {renderSectionHeader('PROFESSIONAL SUMMARY')}
                <p>{professionalSummary}</p>
            </section>
        ),
        skills: (
            <section key="skills" className={styles.section}>
                {renderSectionHeader('SKILLS')}
                {templateId === 'infographic' && styles.skillBar ? (
                    <div className="space-y-3">
                        {skills.map((skill, i) => (
                             <div key={i} className={styles.skillItem}>
                                <p>{skill}</p>
                                <div className={styles.skillBar}>
                                    {/* Use a pseudo-random but consistent width for visual effect */}
                                    <div className={styles.skillBarProgress} style={{ width: `${(80 + (skill.length % 15))}px`, ...dynamicStyles.accentElement }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{skills.join(' • ')}</p>
                )}
            </section>
        ),
        experience: (
            <section key="experience" className={styles.section}>
                {renderSectionHeader('WORK EXPERIENCE')}
                <div className="space-y-4">
                    {workExperience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className={styles.jobTitle} style={dynamicStyles.jobTitle}>{exp.jobTitle}</h3>
                                <p className={styles.jobMeta}>{exp.dates}</p>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className={styles.jobOrg}>{exp.company}</p>
                                <p className={styles.jobMeta}>{exp.location}</p>
                            </div>
                            <ul className={styles.list}>
                                {exp.responsibilities.map((resp, i) => (<li key={i}>{resp}</li>))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        ),
        education: (
            <section key="education" className={styles.section}>
                {renderSectionHeader('EDUCATION')}
                {education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                            <h3 className={styles.jobTitle} style={dynamicStyles.jobTitle}>{edu.degree}</h3>
                            <p className={styles.jobOrg}>{edu.institution}, {edu.location}</p>
                        </div>
                        <p className={styles.jobMeta}>{edu.dates}</p>
                    </div>
                ))}
            </section>
        ),
        awards: (
            awardsAndCertifications && awardsAndCertifications.length > 0 && (
                <section key="awards" className={styles.section}>
                    {renderSectionHeader('AWARDS & CERTIFICATIONS')}
                    {awardsAndCertifications.map(cert => (
                        <div key={cert.id} className="flex justify-between items-baseline">
                            <div>
                                <h3 className={styles.jobTitle} style={dynamicStyles.jobTitle}>{cert.title}</h3>
                                <p className={styles.jobOrg}>{cert.organization}</p>
                            </div>
                            <p className={styles.jobMeta}>{cert.date}</p>
                        </div>
                    ))}
                </section>
            )
        )
    };
    
    const orderedSections = sectionOrder ? sectionOrder.map(key => sections[key]) : Object.values(sections);

    const contactParts = [
        contact.email,
        contact.phone,
        contact.linkedin,
        contact.twitter,
        contact.github,
        contact.website,
    ].filter(Boolean);

    const renderSingleColumnLayout = (styles: SingleColumnStyle) => (
        <>
            <header className={styles.header} style={dynamicStyles.accentElement}>
                {styles.hasPhoto && (
                     <div className="w-28 h-28 mb-4 mx-auto">
                        {contact.photoUrl ? (
                            <img src={contact.photoUrl} alt={contact.name} className="rounded-full object-cover w-full h-full" />
                        ) : (
                            <PhotoPlaceholder />
                        )}
                    </div>
                )}
                <h1 className={styles.name} style={dynamicStyles.name}>{contact.name ? contact.name.toUpperCase() : 'YOUR NAME'}</h1>
                <p className={styles.contact} style={dynamicStyles.contact}>
                    {contactParts.join(' • ') || 'your.email@example.com • 555-555-5555'}
                </p>
            </header>
            <main className={styles.main}>
                {orderedSections}
            </main>
        </>
    );

    const renderTwoColumnLayout = (styles: TwoColumnStyle) => {
        const sidebarContent: { [key: string]: React.ReactNode } = {
            contact: (
                <section className={styles.section}>
                    <h2 className={styles.h2} style={dynamicStyles.h2}>CONTACT</h2>
                    <p className={styles.contact} style={dynamicStyles.contact}>
                        {contactParts.length > 0 ? contactParts.map((part, index) => (
                            <React.Fragment key={index}>
                                {part}
                                {index < contactParts.length - 1 && <br/>}
                            </React.Fragment>
                        )) : 'your.email@example.com'}
                    </p>
                </section>
            ),
            skills: sections.skills,
            education: sections.education,
        };

        return (
            <div className="flex h-full">
                <aside className={styles.sidebar} style={dynamicStyles.accentElement}>
                     {templateId !== 'creative' && templateId !== 'executive' && (
                        <div className="w-32 h-32 mx-auto mb-6">
                            {contact.photoUrl ? (
                                <img src={contact.photoUrl} alt={contact.name} className="rounded-full object-cover w-full h-full" />
                            ) : (
                                <PhotoPlaceholder style={{ color: dynamicStyles.name.color }} />
                            )}
                        </div>
                     )}
                    {templateId !== 'creative' && <h1 className={styles.name} style={dynamicStyles.name}>{contact.name ? contact.name.toUpperCase() : 'YOUR NAME'}</h1>}
                    
                    <div className={styles.sidebarContent}>
                         {templateId === 'creative' && <h1 className={styles.name} style={dynamicStyles.name}>{contact.name ? contact.name.toUpperCase() : 'YOUR NAME'}</h1>}
                        {styles.sidebarSections.map(key => sidebarContent[key])}
                    </div>
                </aside>
                <main className={styles.main}>
                    {sectionOrder
                        .filter(key => !styles.sidebarSections.includes(key))
                        .map(key => sections[key])
                    }
                </main>
            </div>
        );
    }


    return (
        <div id="resume-hover-preview" className={`bg-white shadow-2xl ${styles.container} w-[8.5in] h-[11in]`} style={dynamicStyles.container}>
            {styles.layout === 'two' ? renderTwoColumnLayout(styles) : renderSingleColumnLayout(styles)}
        </div>
    );
};

export default HoverResumePreview;
