import express from "express"
import { getAllOnlineUsers } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/getAllUsers", protectRoute, getAllOnlineUsers)



export default router