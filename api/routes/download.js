import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const download = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
download.get("/download", (req, res) => {
    const { boardId } = req.query;

    if (!boardId) {
        return res.status(400).send("Missing boardId");
    }

    const filePath = path.join(__dirname, `../../whiteboards/${boardId}.png`);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send("Whiteboard not found");
        }

        res.setHeader("Content-Disposition", `attachment; filename=${boardId}_whiteboard.png`);
        res.setHeader("Content-Type", "image/png");
        fs.createReadStream(filePath).pipe(res);
    });
});

export default download;
