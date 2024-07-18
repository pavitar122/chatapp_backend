import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// Middleware (optional, use if needed)
// app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

// Simple test endpoint
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, io, server };
