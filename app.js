import express from 'express';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import User from './models/user.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  

const url = 'mongodb+srv://sankyawhtwe:mongodbPassword@cluster0.wfzkryr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    res.send("Login success!");
  } else {
    res.send("Invalid username or password.");
  }
});

app.listen(3000, () => console.log('Server started: http://localhost:3000'));
