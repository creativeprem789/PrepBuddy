const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
async function authUser(req,res,next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({token})
    if (isBlacklisted) {
        return res.status(401).json({
            message:"Token is Invalid"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

module.exports = {authUser};