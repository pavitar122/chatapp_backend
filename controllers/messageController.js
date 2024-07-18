import Conversation from "../database/models/conversationModel.js"
import Message from "../database/models/messageModel.js"
import { getRecieverSocketId } from "../index.js";
import { io } from "../index.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { recieverId } = req.params;
        const senderId = req.user._id;


        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        })

        if (!conversation) {
            return res.status(400).json("There was no conversation found.")
        }

        if (!message) {
            return res.status(400).json("Message field is empty.")
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
            await newMessage.save();
            await conversation.save();
        }

        const SocketId = getRecieverSocketId(recieverId)

        if (SocketId) {
            io.to(SocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage)

    } catch (error) {
        res.status(500).json(error)
    }
}


export const getConversationsForSidebar = async (req, res) => {
    try {
        const loggedinUserId = req.user._id;

        const SidebarConversations = await Conversation.find({
            participants: { $all: [loggedinUserId] }
        }).populate("participants").select("-messages")

        res.status(200).json(SidebarConversations)

    } catch (error) {
        res.status(500).json(error)
    }
}


export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const loggedinUserId = req.user._id;

        const conversation = await Conversation.findOne({ _id: chatId }).populate("messages").populate({
            path: "participants",
            match: { _id: { $ne: loggedinUserId } }
        });

        if (conversation === null) {
            return res.status(200).json([]);

        }

        res.status(200).json(conversation)

    } catch (error) {
        res.status(500).json(error)
    }
}



export const startConversation = async (req, res) => {
    try {
        const { recieverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        }).populate("participants")


        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId]
            })
            
            await conversation.populate("participants")
        } 

        return res.status(200).json(conversation)

    } catch (error) {
        res.status(500).json(error)
    }
}


export const deleteConversation = async (req, res) => {
    try {
        const { chatId } = req.params;
        const deleteConversation = await Conversation.findByIdAndDelete({ _id: chatId });
        if (deleteConversation) {
            return res.status(200).json("Your chat has been deleted.")
        } else {
            return res.status(400).json("Internal server error.")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

