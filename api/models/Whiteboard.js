import mongoose from "mongoose";

const WhiteboardSchema = new mongoose.Schema({
    boardId: { type: String, required: true, unique: true },
    imageData: { type: String },
});

export default mongoose.model("Whiteboard", WhiteboardSchema);