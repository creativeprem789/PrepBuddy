const mongoose = require('mongoose');

/**
 * -job description:string
 * -resume text :string
 * -self description:string
 * -overall feedback or matchScore:number
 * -Technical questions:[{}]
 * -Behavioral questions:[]
 * -Skill gaps :[]
 * -preparation tips
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },

    answer: { type: String }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    severity: {
        type: String,
        Enum: ['low', 'medium', 'high'],
        required: true
    }
}, {
    _id: false
})

const preparationTipSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String, required: true }]
})




const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true }, 
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number ,min:0, max:100},
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationTips: [preparationTipSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
    }
}, {
    timestamps: true
})
const InterviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReportModel;