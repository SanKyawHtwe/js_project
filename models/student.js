import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
  referral:{
    type: String,
  }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
