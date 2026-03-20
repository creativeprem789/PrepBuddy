const pdfParse = require("pdf-parse");
const interviewModel = require("../models/interviewReport.model");
const generateInterviewReport = require("../services/ai.service");

async function generateReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Resume PDF file is required." });
        }

        const rawResult = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const resumeText = typeof rawResult === "string" ? rawResult : rawResult.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewreportByAI = await generateInterviewReport({
            resume: resumeText,
            jobDescription,
            selfDescription
        });

        const interviewReport = new interviewModel({
            user: req.user._id,
            resume: resumeText,
            jobDescription,
            selfDescription,
            ...interviewreportByAI
        });

        await interviewReport.save();

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport: {
                ...interviewReport._doc,
                preparationPlan: interviewReport.preparationTips
            }
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: error.message });
    }
}

async function getReportsController(req, res) {
    try {
        const interviewReports = await interviewModel.find({ user: req.user._id });
        res.status(200).json({ interviewReports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getReportByIdController(req, res) {
    try {
        const interviewReport = await interviewModel.findOne({ 
            _id: req.params.id,
            user: req.user._id 
        });
        
        if (!interviewReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json({ 
            interviewReport: {
                ...interviewReport._doc,
                preparationPlan: interviewReport.preparationTips
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    generateReportController,
    getReportsController,
    getReportByIdController
}