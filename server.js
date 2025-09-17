// server.js
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://yusuf-abdulsalam560.github.io" })); // allow your frontend

// Fake database for demo (replace later with MongoDB or PostgreSQL)
const users = [];

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);

    res.json({ success: true, message: "Registration successful!" });
  } catch (err) {
    res.json({ success: false, message: "Error registering user." });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password." });
    }

    res.json({ success: true, message: "Login successful!" });
  } catch (err) {
    res.json({ success: false, message: "Error logging in." });
  }
});

// Health check for Render
app.get("/healthz", (req, res) => {
  res.send("OK");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
