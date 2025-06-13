import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send", async (req, res) => {
    const { boardId, email } = req.body;
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];
    // const token =
    //     req.cookies?.token ||
    //     req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const inviteToken = jwt.sign(
        { boardId, from: decoded.email, to: email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const inviteLink = `http://localhost:5173/board/${boardId}?token=${inviteToken}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Join your Whiteboard",
        html: `<p>${decoded.email} invited you to join a board. Click to join:</p><a href="${inviteLink}">${inviteLink}</a>`,
    });

    res.json({ message: "Invite sent", token: inviteToken });
});

const inviteRoutes = router;
export default inviteRoutes;