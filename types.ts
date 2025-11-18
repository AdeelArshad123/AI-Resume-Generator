import React from 'react';

export interface Contact {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    twitter?: string;
    github?: string;
    website?: string;
    photoUrl?: string;
}

export interface WorkExperience {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    dates: string;
    responsibilities: string[];
}

export interface Education {
    id:string;
    degree: string;
    institution: string;
    location: string;
    dates: string;
}

export interface AwardOrCertification {
    id: string;
    title: string;
    organization: string;
    date: string;
}

export interface ThemeCustomization {
    fontFamily: string;
    primaryColor: string;
    fontSize: 'sm' | 'md' | 'lg';
    fontWeight: 'regular' | 'semibold';
}

export interface ResumeData {
    contact: Contact;
    professionalSummary: string;
    workExperience: WorkExperience[];
    skills: string[];
    education: Education[];
    awardsAndCertifications: AwardOrCertification[];
    sectionOrder: string[];
    theme: ThemeCustomization;
    selectedTemplate: string;
}

export interface Suggestion {
    id: string;
    text: string;
}

export interface AtsCheck {
    id: string;
    text: string;
    passed: boolean;
}

export interface Template {
    id: string;
    name: string;
    thumbnail: string;
    description: string;
    categories: string[];
}

export interface JobMatchAnalysisResult {
    matchScore: number;
    suggestions: Suggestion[];
    missingKeywords: string[];
    matchingKeywords: string[];
}

export interface LinkedInProfileContent {
    headline: string;
    aboutSection: string;
}

// New interfaces for LinkedIn Import feature
export interface LinkedInImportedWorkExperience {
    jobTitle: string;
    company: string;
    location: string;
    dates: string;
    description: string;
}

export interface LinkedInImportedEducation {
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    dates: string;
}

export interface LinkedInImportedProfileData {
    contact: {
        name: string;
        email?: string;
        phone?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        photoUrl?: string;
    };
    headline?: string;
    aboutSection?: string;
    workExperience?: LinkedInImportedWorkExperience[];
    education?: LinkedInImportedEducation[];
    skills?: string[];
}