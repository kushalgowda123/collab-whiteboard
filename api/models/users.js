import mongoose from "mongoose";

const user = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    boardId: String,
    isAdmin: {
        required: false,
        type: Boolean,
        default: false
    }
});

export default mongoose.model("User", user);