const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
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