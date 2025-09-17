// server.js
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import multer from "multer";

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://yusuf-abdulsalam560.github.io" })); // allow frontend

// ===== In-memory data (replace with DB later) =====
let users = [];
let posts = [];

// ===== AUTH =====
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);

    res.json({ success: true, message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error registering user." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user) return res.status(400).json({ success: false, message: "User not found." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid password." });

    const token = `${email}-${Date.now()}`;
    res.json({ success: true, message: "Login successful!", token, name: user.name });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error logging in." });
  }
});

// ===== CONTACT FORM (Nodemailer) =====
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_USER,
      subject: `New Contact from ${name}`,
      text: message,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// ===== FILE UPLOAD (Multer) =====
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ success: true, filename: req.file.filename });
});

// ===== BLOG =====
app.post("/blog", (req, res) => {
  const { title, content } = req.body;
  posts.push({ title, content, date: new Date() });
  res.json({ success: true });
});

app.get("/blog", (req, res) => {
  res.json(posts);
});

// ===== Health check (for Render) =====
app.get("/healthz", (req, res) => {
  res.send("OK");
});

// ===== Root route =====
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

