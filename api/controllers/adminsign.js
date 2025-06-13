
import bcrypt from 'bcryptjs';
import user from '../models/users.js';

export const adminsign = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const existing = await user.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
            email,
            password: hashedPassword,

        });

        await newUser.save();
        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
export default adminsign;