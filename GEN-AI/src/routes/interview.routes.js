const express = require("express");
const interviewRouter = express.Router();
const authmiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");
/**
 * @route POST /api/interview/generateReport
 * @desc Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access Private
 * @body { resume: string, jobDescription: string, selfDescription: string }
 * @returns { matchScore: number, technicalQuestions: Array<{ question: string, intention: string, answer: string }>, behavioralQuestions: Array<{ question: string, intention: string, answer: string }>, skillGaps: Array<{ skill: string, severity: 'low' | 'medium' | 'high' }>, preparationTips: Array<{ day: number, focus: string, tasks: Array<string> }> }
 */
interviewRouter.post("/", authmiddleware.authUser, upload.single("resume"), interviewController.generateReportController)
interviewRouter.get("/all", authmiddleware.authUser, interviewController.getReportsController)
interviewRouter.get("/:id", authmiddleware.authUser, interviewController.getReportByIdController)

module.exports = interviewRouter;