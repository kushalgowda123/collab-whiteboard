import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import user from "../models/users.js";

const adminlogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ error: "admin not valid" });
        }
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        if (foundUser.isAdmin) {
            const token = jwt.sign({ email: foundUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({ message: "Login successful", token });
        } else {
            return res.status(403).json({ error: "Access denied" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export default adminlogin;