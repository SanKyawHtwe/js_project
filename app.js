import express from 'express';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import User from './models/user.js';
import Student from './models/student.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    console.log("Entered password (plain-text):", password);
    console.log("Stored password (hashed):", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    console.log("User logged in successfully:", email);
    res.json({ success: true, message: "Login successful." });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post('/api/students', async (req, res) => {
  const { name, email, phone, course, batch } = req.body;

  if (!name || !email || !phone || !course || !batch) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const existingStudent = await Student.findOne({ $or: [{ email }, { phone }] });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Email or phone already registered." });
    }

    const newStudent = new Student({
      name,
      email,
      phone,
      course,
      batch,
    });

    await newStudent.save();

    res.status(201).json({ success: true, message: "Student added successfully.", student: newStudent });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ success: false, message: "Server error while adding student." });
  }
});

app.listen(process.env.PORT, () => console.log('Server running on port', process.env.PORT));
