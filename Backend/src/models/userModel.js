import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { // Used for login + mailing credentials
    type: String,
    required: true,
    unique: true,
  },
  password: { // Hashed password
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['SuperAdmin', 'CollegeAdmin', 'MessAdmin', 'Student'],
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: function () {
      return this.role !== 'superadmin';
    },
  },
  isFirstLogin: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
