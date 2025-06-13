import express from 'express';
import jwt from 'jsonwebtoken';

const Router = express.Router();

Router.get('/verify', (req, res) => {
    // console.log("Request Headers:", req.headers);
    const authHeader = req.headers.authorization || `Bearer ${req.cookies?.token}`;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Token valid', user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default Router;