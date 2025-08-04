import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: { // Unique short identifier (like IIITBH)
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // SuperAdmin
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('College', CollegeSchema);
