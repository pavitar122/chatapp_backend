import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../database/models/userModel.js"

const protectRoute = async (req, res, next)=>{
    try {
        const token = req.headers.authorization;

        if(!token){
            return res.status(400).json({error: "Unauthorized - Token not found."})
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(400).json({error: "Unauthorized - Token invalid."})
        }

        const user = await User.findById(decoded.id).select("-password")

        if(!user){
            return res.status(400).json({error: "User not found."})
        }
        
        req.user = user
        next();

    } catch (error) {
        res.status(500).json(error)
    }

}

export default protectRoute;