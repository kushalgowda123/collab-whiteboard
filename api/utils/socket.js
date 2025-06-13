// api/socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);

        socket.on("joinBoard", (boardId) => {
            socket.join(boardId);
            console.log(`Socket ${socket.id} joined board ${boardId}`);
        });

        // Broadcast drawing data to others in the same board
        socket.on("drawing", (data) => {
            const { boardId, ...drawingData } = data;
            socket.to(boardId).emit("drawing", drawingData);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected: " + socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};