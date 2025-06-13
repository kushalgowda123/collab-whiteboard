import express from "express";
import adminlogin from "../controllers/adminlogin.js";
import adminsign from "../controllers/adminsign.js";
const router = express.Router();
router.post("/adminlogin", adminlogin)
router.post("/adminsign", adminsign)


export default router;