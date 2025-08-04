import mongoose from 'mongoose';

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
        enum: ['Super Admin', 'College Admin', 'Mess Admin', 'Student'],
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
        required: function () {
            return this.role === 'Student';
        },
        unique: true,
        sparse: true,
    },
    idCardPhoto: {
        fileName: { type: String },
        fileUrl: { type: String },
        contentType: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    },

    // ✅ Passport Photo as object with metadata
    passportPhoto: {
        fileName: { type: String },
        fileUrl: { type: String },
        contentType: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);
