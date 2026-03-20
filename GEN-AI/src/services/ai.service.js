const { GoogleGenAI } = require("@google/genai")
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Manually define the response schema using the Gemini-compatible JSON Schema format
// (zod-to-json-schema outputs Draft-07 which Gemini ignores — use plain objects instead)
const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description: "A numerical score between 0 and 100 indicating how well the candidate matches the job requirements."
        },
        technicalQuestions: {
            type: "array",
            description: "A list of at least 5 technical interview questions relevant to the job.",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical interview question." },
                    intention: { type: "string", description: "The reason for asking this question." },
                    answer:    { type: "string", description: "The ideal answer the candidate should give." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "A list of behavioral interview questions.",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral interview question." },
                    intention: { type: "string", description: "The reason for asking this question." },
                    answer:    { type: "string", description: "The ideal answer the candidate should give." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Skills the candidate is missing or weak in.",
            items: {
                type: "object",
                properties: {
                    skill:    { type: "string", description: "The skill that is lacking." },
                    severity: { type: "string", enum: ["low", "medium", "high"], description: "How critical this gap is." }
                },
                required: ["skill", "severity"]
            }
        },
        preparationTips: {
            type: "array",
            description: "A structured 7-day preparation plan.",
            items: {
                type: "object",
                properties: {
                    day:   { type: "number", description: "Day number in the plan (1-7)." },
                    focus: { type: "string", description: "The main topic or theme for that day." },
                    tasks: {
                        type: "array",
                        description: "List of tasks for that day.",
                        items: { type: "string" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationTips"]
}

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
    const prompt = `You are an expert career coach. Based on the following information, generate a comprehensive interview report.

Resume:
${resume}

Job Description:
${jobDescription}

Self Description:
${selfDescription}

Instructions:
- Carefully analyze the candidate's skills and experience.
- Generate at least 5 realistic technical interview questions based on the job description.
- Generate behavioral questions relevant to the role.
- Identify missing or weak skills compared to the job requirements.
- Provide a structured 7-day preparation plan.
- Ensure every field in the response is filled. Do not leave any section empty.
- The matchScore must be a NUMBER between 0 and 100.
- Return the result strictly as JSON matching the provided schema.
`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    })

    console.log("RAW AI response:", response.text);
    return JSON.parse(response.text)
}

module.exports = generateInterviewReport;