import mongoose from "mongoose";

const StudentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
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

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
