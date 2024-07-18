import express from "express";
import { deleteConversation, getConversationsForSidebar, getMessages, sendMessage, startConversation } from "../controllers/messageController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/send/:recieverId", protectRoute, sendMessage)

router.get("/startConversation/:recieverId", protectRoute, startConversation)

router.get("/deleteConversation/:chatId", protectRoute, deleteConversation)

router.get("/sidebarConversation", protectRoute, getConversationsForSidebar)

router.get("/fetchMessages/:chatId", protectRoute, getMessages)

export default router