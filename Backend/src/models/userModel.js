// models/User.js
import mongoose from 'mongoose';

const photoSchema = {
    fileName: { type: String },
    fileUrl: { type: String },
    contentType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
};

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Super Admin', 'College Admin', 'Mess Admin', 'Student'],
        required: true,
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
    },
    contactNumber: { type: String, required: true },
    isFirstLogin: { type: Boolean, default: true },
    studentId: {
        type: String,
        required: function () {
            return this.role === 'Student';
        },
        unique: true,
        sparse: true,
    },
    passportPhoto: photoSchema
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);
