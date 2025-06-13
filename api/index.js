import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./routes/auth.js";
import inviteRoutes from "./routes/invite.js";
import Router from "./routes/verify.js";
import { initSocket } from "./utils/socket.js";
import white from "./routes/whiteboard.js";
import download from "./routes/download.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));
// app.use("/api/admin", Router)
app.use('/api', router)
app.use("/api/invite", inviteRoutes);
app.use("/api", Router);
app.use("/api/whiteboard", white);
app.use("/api", download);

server.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server listening on ${process.env.PORT}`);
});