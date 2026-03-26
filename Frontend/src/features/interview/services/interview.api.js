import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

export async function generateInterviewReport({ jobDescription, selfDescription, resumeFile }) {
    try {
        const formData = new FormData();
        formData.append('jobDescription', jobDescription);
        formData.append('selfDescription', selfDescription);
        formData.append('resume', resumeFile);

        const response = await api.post('/api/interview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
}

export async function getAllInterviewReports() {
    try {
        const response = await api.get('/api/interview/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all reports:', error);
        throw error;
    }
}

export async function getInterviewReportById(interviewId) {
    try {
        const response = await api.get(`/api/interview/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report by ID:', error);
        throw error;
    }
}

export async function generateResumePdf({ interviewReportId }) {
    try {
        const response = await api.post(`/api/interview/resume-pdf/${interviewReportId}`, {}, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Error generating resume PDF:', error);
        throw error;
    }
}
