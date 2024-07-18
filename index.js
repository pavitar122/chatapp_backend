import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js"
import messageRoutes from  "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectToMongoDb from "./database/config.js";

import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 4000;
const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});



const userSocketMap = {};

export const getRecieverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId !== undefined){
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))


    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
});


app.get("/", (req, res)=>{
    res.send("Your Chat app backend is running.")
})

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)


server.listen(PORT, () => {
    connectToMongoDb();
    console.log(`Server is running on port ${PORT}`);
});


// server.listen(PORT, ()=>{
//     connectToMongoDb();
//     console.log(`Your app is running on port ${PORT}`)
// })