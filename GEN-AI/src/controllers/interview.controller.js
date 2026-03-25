const pdfParse = require("pdf-parse");
const PDFDocument = require("pdfkit");
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
            user: req.user.id,
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
        const interviewReports = await interviewModel.find({ user: req.user.id });
        res.status(200).json({ interviewReports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getReportByIdController(req, res) {
    try {
        const interviewReport = await interviewModel.findOne({ 
            _id: req.params.id,
            user: req.user.id 
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

async function generatePdfController(req, res) {
    try {
        const interviewReport = await interviewModel.findOne({ 
            _id: req.params.id,
            user: req.user.id 
        });
        
        if (!interviewReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        const doc = new PDFDocument({ margin: 50 });
        const filename = `Report_${req.params.id}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Styling and Content
        doc.fontSize(24).font('Helvetica-Bold').text('Interview Preparation Report', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).font('Helvetica').text(`Match Score: ${interviewReport.matchScore}%`, { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(18).font('Helvetica-Bold').text('Technical Questions');
        doc.moveDown(0.5);
        if (interviewReport.technicalQuestions && interviewReport.technicalQuestions.length > 0) {
            interviewReport.technicalQuestions.forEach((q, index) => {
                doc.fontSize(12).font('Helvetica-Bold').text(`${index + 1}. Q: ${q.question}`);
                doc.font('Helvetica-Oblique').text(`Intention: ${q.intention}`);
                doc.font('Helvetica').text(`Answer: ${q.answer}`);
                doc.moveDown();
            });
        }

        doc.addPage();
        doc.fontSize(18).font('Helvetica-Bold').text('Behavioral Questions');
        doc.moveDown(0.5);
        if (interviewReport.behavioralQuestions && interviewReport.behavioralQuestions.length > 0) {
            interviewReport.behavioralQuestions.forEach((q, index) => {
                doc.fontSize(12).font('Helvetica-Bold').text(`${index + 1}. Q: ${q.question}`);
                doc.font('Helvetica-Oblique').text(`Intention: ${q.intention}`);
                doc.font('Helvetica').text(`Answer: ${q.answer}`);
                doc.moveDown();
            });
        }

        doc.addPage();
        doc.fontSize(18).font('Helvetica-Bold').text('Skill Gaps');
        doc.moveDown(0.5);
        if (interviewReport.skillGaps && interviewReport.skillGaps.length > 0) {
            interviewReport.skillGaps.forEach((gap, index) => {
                doc.fontSize(12).font('Helvetica').text(`• ${gap.skill} (Severity: ${gap.severity})`);
            });
        }
        doc.moveDown();

        doc.fontSize(18).font('Helvetica-Bold').text('Preparation Plan');
        doc.moveDown(0.5);
        if (interviewReport.preparationTips && interviewReport.preparationTips.length > 0) {
            interviewReport.preparationTips.forEach((tip, index) => {
                doc.fontSize(14).font('Helvetica-Bold').text(`Day ${tip.day}: ${tip.focus}`);
                doc.fontSize(12).font('Helvetica');
                if (tip.tasks && tip.tasks.length > 0) {
                    tip.tasks.forEach(task => {
                        doc.text(`  • ${task}`);
                    });
                }
                doc.moveDown();
            });
        }

        doc.end();

    } catch (error) {
        console.error("Error generating PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = {
    generateReportController,
    getReportsController,
    getReportByIdController,
    generatePdfController
}