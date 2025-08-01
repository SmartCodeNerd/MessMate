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
    },
    contactNumber: {
        type: String,
        required: true,
    },
    isFirstLogin: {
        type: Boolean,
        default: true,
    },
    studentId: { // College roll number
        type: String,
        required: true,
        unique: true,
    },
    idCardPhotoURL: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
