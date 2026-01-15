import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* =====================
   AUTH MIDDLEWARE
===================== */
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)
  if (!token)
    return res.status(401).json({ msg: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

/* =====================
   REGISTER
===================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: null, // role will be set later
    });

    res.json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================
   LOGIN
===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================
   SET ROLE (NEW)
===================== */
router.patch("/role", protect, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["owner", "seeker"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    req.user.role = role;
    await req.user.save();

    res.json({ msg: "Role updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;