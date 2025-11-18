import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ResumeData, WorkExperience, Education, Suggestion, AwardOrCertification, JobMatchAnalysisResult, LinkedInProfileContent } from '../types';

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        contact: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Full name, inferred from the prompt or a plausible placeholder like 'John Doe'." },
                email: { type: Type.STRING, description: "A plausible placeholder email like 'john.doe@email.com'." },
                phone: { type: Type.STRING, description: "A plausible placeholder phone number like '555-123-4567'." },
                linkedin: { type: Type.STRING, description: "A plausible placeholder LinkedIn profile URL." },
                twitter: { type: Type.STRING, description: "A plausible placeholder Twitter profile URL, if mentioned." },
                github: { type: Type.STRING, description: "A plausible placeholder GitHub profile URL, if mentioned." },
                website: { type: Type.STRING, description: "A plausible placeholder personal website URL, if mentioned." },
                photoUrl: { type: Type.STRING, description: "A URL for a professional photo, if inferred or applicable." },
            },
            required: ["name", "email", "phone", "linkedin"],
        },
        professionalSummary: {
            type: Type.STRING,
            description: "A 2-4 sentence professional summary highlighting key skills and experience.",
        },
        workExperience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique ID for the experience item" },
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    dates: { type: Type.STRING, description: "e.g., 'June 2020 - Present'" },
                    responsibilities: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Bulleted list of 3-5 key achievements and responsibilities. Use strong action verbs and quantify results where possible."
                    },
                },
                required: ["jobTitle", "company", "location", "dates", "responsibilities"],
            },
        },
        skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of relevant technical and soft skills."
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique ID for the education item" },
                    degree: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    location: { type: Type.STRING },
                    dates: { type: Type.STRING, description: "e.g., 'Sept 2014 - May 2018'" },
                },
                required: ["degree", "institution", "location", "dates"],
            },
        },
        awardsAndCertifications: {
            type: Type.ARRAY,
            description: "A list of relevant awards or certifications.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique ID for the award/certification item" },
                    title: { type: Type.STRING, description: "The name of the award or certification, e.g., 'Project Management Professional (PMP)'" },
                    organization: { type: Type.STRING, description: "The issuing organization, e.g., 'Project Management Institute'" },
                    date: { type: Type.STRING, description: "The date it was awarded, e.g., 'May 2021'" },
                },
                required: ["title", "organization", "date"],
            }
        },
        sectionOrder: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An ordered list of section IDs to control resume layout. Default: ['summary', 'experience', 'skills', 'education', 'awards']"
        },
        theme: { // Dummy theme to satisfy the ResumeData interface in the schema
            type: Type.OBJECT,
            properties: {
                fontFamily: { type: Type.STRING },
                primaryColor: { type: Type.STRING },
                fontSize: { type: Type.STRING },
                fontWeight: { type: Type.STRING },
            },
            required: ["fontFamily", "primaryColor", "fontSize", "fontWeight"],
        },
        selectedTemplate: { type: Type.STRING, description: "The ID of the selected template, e.g., 'classic'" }
    },
    required: ["contact", "professionalSummary", "workExperience", "skills", "education", "awardsAndCertifications", "sectionOrder", "theme", "selectedTemplate"],
};


export const generateResumeFromPrompt = async (prompt: string): Promise<ResumeData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview", // Use pro model for complex generation from text
            contents: prompt,
            config: {
                systemInstruction: "You are an expert resume writing AI assistant named ResumeCraft. Your goal is to generate a professional, ATS-optimized resume based on the user's provided prompt. The resume should be well-structured, using strong action verbs and quantifying achievements where possible. Adhere strictly to the provided JSON schema for your output. Populate all fields with plausible data, including placeholder URLs for social media. For theme and template, use sensible defaults like 'Inter', '#0ea5e9', 'md', 'regular', and 'classic'.",
                responseMimeType: "application/json",
                responseSchema: resumeSchema,
            },
        });

        const jsonString = response.text;
        const generatedData = JSON.parse(jsonString);

        // Add unique IDs to array items and ensure they exist
        generatedData.workExperience = (generatedData.workExperience || []).map((item: WorkExperience, index: number) => ({ ...item, id: `we-${Date.now()}-${index}` }));
        generatedData.education = (generatedData.education || []).map((item: Education, index: number) => ({ ...item, id: `edu-${Date.now()}-${index}` }));
        generatedData.awardsAndCertifications = (generatedData.awardsAndCertifications || []).map((item: AwardOrCertification, index: number) => ({ ...item, id: `cert-${Date.now()}-${index}` }));
        generatedData.skills = generatedData.skills || [];

        // Add default section order and theme if not provided by AI
        generatedData.sectionOrder = generatedData.sectionOrder || ['summary', 'experience', 'skills', 'education', 'awards'];
        generatedData.theme = generatedData.theme || { fontFamily: 'Inter', primaryColor: '#0ea5e9', fontSize: 'md', fontWeight: 'regular' };
        generatedData.selectedTemplate = generatedData.selectedTemplate || 'classic';


        return generatedData;
    } catch (error) {
        console.error("Error generating resume from prompt:", error);
        throw new Error("Failed to generate resume. Please try again.");
    }
};

export const extractResumeFromDocument = async (file: File, fileType: string): Promise<ResumeData> => {
    try {
        const base64EncodedFile = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                    resolve(result.split(',')[1]); // Extract Base64 part
                } else {
                    reject(new Error("Failed to read file as base64 string."));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const imagePart = {
            inlineData: {
                mimeType: fileType,
                data: base64EncodedFile,
            },
        };

        const prompt = `You are an expert resume parsing AI. Your task is to extract all relevant information from the provided resume document and structure it according to the given JSON schema. Ensure all fields are populated accurately and completely. If a field is not present in the document, use a plausible placeholder value (e.g., for contact details). Infer the most likely job title for the summary if not explicit. For theme and template, use sensible defaults like 'Inter', '#0ea5e9', 'md', 'regular', and 'classic'.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // Use multimodal model for image/document input
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeSchema,
            },
        });

        const jsonString = response.text;
        const extractedData = JSON.parse(jsonString);

        // Add unique IDs to array items and ensure they exist
        extractedData.workExperience = (extractedData.workExperience || []).map((item: WorkExperience, index: number) => ({ ...item, id: `we-${Date.now()}-${index}` }));
        extractedData.education = (extractedData.education || []).map((item: Education, index: number) => ({ ...item, id: `edu-${Date.now()}-${index}` }));
        extractedData.awardsAndCertifications = (extractedData.awardsAndCertifications || []).map((item: AwardOrCertification, index: number) => ({ ...item, id: `cert-${Date.now()}-${index}` }));
        extractedData.skills = extractedData.skills || [];

        // Add default section order and theme if not provided by AI
        extractedData.sectionOrder = extractedData.sectionOrder || ['summary', 'experience', 'skills', 'education', 'awards'];
        extractedData.theme = extractedData.theme || { fontFamily: 'Inter', primaryColor: '#0ea5e9', fontSize: 'md', fontWeight: 'regular' };
        extractedData.selectedTemplate = extractedData.selectedTemplate || 'classic';


        return extractedData;
    } catch (error) {
        console.error("Error extracting resume from document:", error);
        throw new Error("Failed to extract resume from document. Please ensure it's a valid resume format and try again.");
    }
};

export const getAtsSuggestions = async (resumeData: ResumeData): Promise<{ score: number, suggestions: Suggestion[] }> => {
    try {
        const resumeText = JSON.stringify(resumeData);
        const prompt = `You are an expert career coach and ATS optimization specialist. Your task is to conduct a detailed analysis of the following resume JSON data.

        Resume Data:
        ${resumeText}

        Please perform the following steps:
        1.  **Infer Job Role:** First, analyze the resume to infer the candidate's most likely job title or career field (e.g., 'Senior Software Engineer', 'Marketing Manager').
        2.  **Analyze Key Resume Components:**
            *   **Keywords:** Based on the inferred job role, identify if crucial, high-value keywords are missing from the 'skills' section or 'workExperience' descriptions.
            *   **Action Verbs:** Check if the 'workExperience' responsibilities begin with strong, impactful action verbs (e.g., "Orchestrated", "Engineered", "Maximized"). Note any weak openings like "Responsible for...".
            *   **Quantification:** Identify at least one specific achievement in the 'workExperience' section that could be strengthened with metrics (numbers, percentages, dollar amounts).
            *   **Clarity and Conciseness:** Evaluate if the 'professionalSummary' is a concise 2-4 sentences and if the work experience bullet points are clear and impactful.
        3.  **Provide Score and Actionable Suggestions:**
            *   Based on your analysis, calculate an overall ATS score from 0-100.
            *   Generate 3-5 highly specific and actionable suggestions. Each suggestion must be concrete. For example, instead of "Add keywords," suggest "Consider adding keywords like 'Agile' and 'Scrum' to your skills to better align with a Project Manager role." Instead of "Quantify results," suggest "In your role as Project Manager, try to quantify 'led project to success' with a metric, like 'Led project to a successful launch 2 weeks ahead of schedule, saving an estimated $15,000 in operational costs.'".

        Your final output must be a JSON object that adheres strictly to the provided schema.`;

        const suggestionsSchema = {
            type: Type.OBJECT,
            properties: {
                atsScore: { type: Type.NUMBER, description: "A score from 0 to 100 representing the resume's estimated ATS compatibility." },
                suggestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING, description: "The specific, actionable suggestion text." },
                        },
                        required: ["text"],
                    }
                }
            },
            required: ["atsScore", "suggestions"],
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionsSchema,
            },
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);

        result.suggestions = (result.suggestions || []).map((s: { text: string }, index: number) => ({ ...s, id: `sugg-${Date.now()}-${index}` }));

        return { score: result.atsScore, suggestions: result.suggestions };

    } catch (error) {
        console.error("Error getting ATS suggestions:", error);
        // Return some defaults on error
        return {
            score: 75,
            suggestions: [
                { id: '1', text: "Error fetching suggestions. Consider rephrasing your summary." },
                { id: '2', text: "Try quantifying one of your achievements in your latest role." }
            ]
        };
    }
};

export const getSuggestionsForText = async (text: string, context: string, tone: string): Promise<Suggestion[]> => {
    try {
        let prompt: string;

        let toneInstruction = '';
        switch (tone) {
            case 'Impactful':
                toneInstruction = 'Focus on using strong action verbs and quantifying results to showcase achievements and impact.';
                break;
            case 'Concise':
                toneInstruction = 'Make it shorter and more direct without losing the core meaning. Remove filler words.';
                break;
            case 'Formal':
                toneInstruction = 'Use professional, corporate language. Avoid slang or overly casual phrasing.';
                break;
            case 'Creative':
                toneInstruction = 'Use more descriptive and engaging language to tell a story and show personality.';
                break;
            default:
                toneInstruction = 'Improve the phrasing for clarity and professionalism.';
        }

        if (context === 'Professional Summary') {
            prompt = `You are an expert resume writing assistant. The user wants to improve their Professional Summary.

            Original Summary: "${text}"

            Your task is to provide exactly 3 alternative phrasings. Each suggestion should be a powerful, high-impact summary of 2-3 sentences.
            **Rewrite it with a '${tone}' tone.** ${toneInstruction}

            Return a JSON object with a single key "suggestions" which is an array of objects, where each object has a single key "text" containing the suggestion.`;
        } else {
            prompt = `You are an expert resume writing assistant. The user has requested suggestions for a specific part of their resume.

            Context: "${context}"
            Original Text: "${text}"

            Please provide exactly 3 distinct and actionable alternative phrasings.
            **Rewrite it with a '${tone}' tone.** ${toneInstruction} If the original text is a list of responsibilities separated by newlines, provide a rewritten version of the entire list. Return a JSON object with a single key "suggestions" which is an array of objects, where each object has a single key "text" containing the suggestion.`;
        }

        const suggestionSchema = {
            type: Type.OBJECT,
            properties: {
                suggestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING, description: "An alternative phrasing for the user's text." }
                        },
                        required: ["text"],
                    }
                }
            },
            required: ["suggestions"],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: suggestionSchema,
            },
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);

        return (result.suggestions || []).map((s: { text: string }, index: number) => ({ ...s, id: `ctx-sugg-${Date.now()}-${index}` }));

    } catch (error) {
        console.error(`Error getting suggestions for ${context}:`, error);
        return [{ id: 'err-1', text: 'Sorry, we couldn\'t generate suggestions at this time.' }];
    }
};


export const generateCoverLetter = async (resumeData: ResumeData, jobDescription: string, template: string): Promise<string> => {
    try {
        const contactInfo = [
            resumeData.contact.name,
            resumeData.contact.email,
            resumeData.contact.phone,
            resumeData.contact.linkedin,
            resumeData.contact.twitter,
            resumeData.contact.github,
            resumeData.contact.website,
        ].filter(Boolean).join(', ');

        const resumeText = `
        Contact: ${contactInfo}
        Summary: ${resumeData.professionalSummary}
        Skills: ${resumeData.skills.join(', ')}
        Work Experience: ${resumeData.workExperience.map(exp => `${exp.jobTitle} at ${exp.company} (${exp.dates}) - Responsibilities: ${exp.responsibilities.join(', ')}`).join('; ')}
        Education: ${resumeData.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.dates})`).join('; ')}
        Awards/Certifications: ${resumeData.awardsAndCertifications.map(cert => `${cert.title} from ${cert.organization} (${cert.date})`).join('; ')}
        `;

        let templateInstructions = '';
        switch (template) {
            case 'modern':
                templateInstructions = "Use a modern, direct, and concise tone. Keep paragraphs short and to the point. Start with a strong opening that immediately grabs the reader's attention. The language should be confident but not overly formal.";
                break;
            case 'enthusiastic':
                templateInstructions = "Adopt an energetic, passionate, and enthusiastic tone. Clearly express genuine excitement for the company's mission and the specific role. Weave in language that shows alignment with the company culture described in the job description.";
                break;
            case 'creative':
                templateInstructions = "Adopt a creative, storytelling tone. Use vivid language and craft a narrative that connects the candidate's journey to the company's mission. This should be engaging and memorable, showing personality while remaining professional.";
                break;
            case 'direct':
                templateInstructions = "Adopt a bold, direct, and results-oriented tone. Get straight to the point, focusing on quantifiable achievements and how they directly solve the company's needs as stated in the job description. Use strong, confident language.";
                break;
            case 'professional':
            default:
                templateInstructions = "Adopt a formal, traditional, and highly professional tone. Structure the letter using classic business formatting. Emphasize experience, qualifications, and direct alignment with the job requirements in a respectful and sophisticated manner.";
                break;
        }

        const prompt = `You are an expert career coach and professional writer named ResumeCraft. Your task is to write a compelling and professional cover letter.

        You will be provided with the candidate's resume data and the job description for the role they are applying for.

        **Candidate's Resume Data:**
        ${resumeText}

        **Job Description:**
        ${jobDescription}

        **Instructions:**
        1.  **Analyze Both Inputs:** Thoroughly analyze the candidate's resume to understand their skills, experience, and achievements. Then, analyze the job description to identify the key requirements, responsibilities, and desired qualifications.
        2.  **Structure the Cover Letter:** Create a standard, professional cover letter with the following structure:
            *   **Introduction:** State the position being applied for and where it was seen. Briefly introduce the candidate and express enthusiasm.
            *   **Body Paragraphs (2-3):** This is the most critical part. Connect the candidate's specific experiences and skills from their resume directly to the requirements in the job description. Use specific examples and quantifiable achievements where possible. Do not just list skills; explain how they apply to the new role.
            *   **Closing Paragraph:** Reiterate interest in the role and the company. Mention a desire to discuss qualifications further in an interview.
            *   **Professional Closing:** End with "Sincerely," followed by the candidate's name.
        3.  **Tone and Language:** Adhere strictly to the following tone and style guide: **${templateInstructions}**
        4.  **Output:** Return only the full text of the cover letter. Do not include any extra commentary, headings, or markdown formatting. The output should be plain text, ready to be copied and pasted.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new Error("Failed to generate cover letter. Please try again.");
    }
};


export const analyzeResumeAgainstJobDescription = async (resumeData: ResumeData, jobDescription: string): Promise<JobMatchAnalysisResult> => {
    try {
        const resumeText = JSON.stringify(resumeData);
        const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Your task is to compare the provided resume JSON against a specific job description and provide a detailed analysis.

        **Resume Data (JSON):**
        ${resumeText}

        **Job Description (Text):**
        ${jobDescription}

        **Your Analysis MUST perform the following steps:**
        1.  **Calculate Match Score:** Based on the alignment of skills, experience, and keywords between the resume and the job description, calculate a "matchScore" from 0 to 100. A high score means the resume is a strong fit for the role.
        2.  **Keyword Analysis:**
            *   Identify the top 5-10 most critical keywords/skills from the job description (e.g., "React", "Project Management", "SaaS", "Data Analysis").
            *   Create a list of "matchingKeywords" found in the resume.
            *   Create a list of "missingKeywords" that are in the job description but not in the resume.
        3.  **Generate Actionable Suggestions:** Provide 3-4 highly specific, actionable suggestions for the user to improve their resume to better match this specific job description. These suggestions should be tailored. For example, "Consider adding a bullet point under your 'Senior Developer' role that highlights your experience with 'CI/CD pipelines', as this is a key requirement in the job description."

        Your final output must be a single JSON object that strictly adheres to the provided schema.`;

        const jobMatchSchema = {
            type: Type.OBJECT,
            properties: {
                matchScore: { type: Type.NUMBER, description: "A score from 0-100 indicating how well the resume matches the job description." },
                suggestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING, description: "A specific, actionable suggestion for improving the resume." },
                        },
                        required: ["text"],
                    }
                },
                missingKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Critical keywords from the job description that are NOT found in the resume."
                },
                matchingKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Critical keywords from the job description that ARE found in the resume."
                },
            },
            required: ["matchScore", "suggestions", "missingKeywords", "matchingKeywords"],
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jobMatchSchema,
            },
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);

        // Add unique IDs and ensure arrays exist
        result.suggestions = (result.suggestions || []).map((s: { text: string }, index: number) => ({ ...s, id: `match-sugg-${Date.now()}-${index}` }));
        result.missingKeywords = result.missingKeywords || [];
        result.matchingKeywords = result.matchingKeywords || [];

        return result;

    } catch (error) {
        console.error("Error analyzing resume against job description:", error);
        throw new Error("Failed to perform Job Match Analysis. Please try again.");
    }
};

export const generateLinkedInProfileContent = async (resumeData: ResumeData): Promise<LinkedInProfileContent> => {
    try {
        const resumeText = JSON.stringify({
            name: resumeData.contact.name,
            summary: resumeData.professionalSummary,
            experience: resumeData.workExperience.map(e => `${e.jobTitle} at ${e.company}`),
            skills: resumeData.skills,
        });

        const prompt = `You are an expert LinkedIn profile writer and career coach. Based on the following resume data, generate a compelling LinkedIn headline and an engaging "About" section.

        Resume Data:
        ${resumeText}

        **Instructions:**
        1.  **Headline:** Create a concise, keyword-rich headline (under 220 characters) that summarizes the candidate's professional identity and key value proposition. It should be more than just a job title.
        2.  **About Section:** Write a professional and approachable "About" section in the first person (using "I"). It should be around 3-5 short paragraphs. Start with a hook, highlight key skills and achievements from the resume, describe their passion or working style, and end with a call to action (e.g., inviting connections or discussing opportunities).

        Return a single JSON object that strictly adheres to the provided schema.`;

        const linkedInSchema = {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING, description: "A compelling, keyword-rich LinkedIn headline (under 220 characters)." },
                aboutSection: { type: Type.STRING, description: "A 3-5 paragraph professional summary for the LinkedIn 'About' section, written in the first person." },
            },
            required: ["headline", "aboutSection"],
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: linkedInSchema,
            },
        });

        const jsonString = response.text;
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating LinkedIn profile content:", error);
        throw new Error("Failed to generate LinkedIn profile content. Please try again.");
    }
};