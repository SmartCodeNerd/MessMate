import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Refers to your User model
    },
    heading: {
        type: String,
        required: [true, "Please provide a heading for your feedback."],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description of the issue."],
        trim: true,
    },
    // This now stores an array of file IDs from GridFS
    imageIds: [{
        type: mongoose.Schema.Types.ObjectId, 
    }],
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps


const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;