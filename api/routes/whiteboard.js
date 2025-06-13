import express from "express";
import Whiteboard from "../models/Whiteboard.js";

const white = express.Router();

// Save canvas image
white.post("/save", async (req, res) => {
    const { boardId, imageData } = req.body;
    try {
        let board = await Whiteboard.findOne({ boardId });
        if (!board) {
            board = new Whiteboard({ boardId, imageData });
            await board.save();
        } else {
            board.imageData = imageData;
            await board.save();
        }
        res.json({ success: true, board });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Load canvas image
white.get("/:boardId", async (req, res) => {
    try {
        const board = await Whiteboard.findOne({ boardId: req.params.boardId });
        res.json({ success: true, imageData: board?.imageData || null });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default white;