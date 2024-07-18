import User from "../database/models/userModel.js";
import Conversation from "../database/models/conversationModel.js"

export const getAllOnlineUsers = async (req, res) => {
    try {
        const loggedinUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedinUserId } }).select("-password")

        res.status(200).json(filteredUsers)

    } catch (error) {
        res.status(500).json(error)
    }
}









