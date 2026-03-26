const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors({
    origin: function(origin, callback) {
        const allowed = [
            'http://localhost:5173',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(express.json());
const cookiieParser = require("cookie-parser");
app.use(cookiieParser())
// #require all the routes fro the authentication
const authRouter=require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
app.use("/api/interview",interviewRouter)
// using all the routes 
app.use("/api/auth",authRouter)
module.exports=app