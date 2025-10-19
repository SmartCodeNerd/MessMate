import Feedback from '../models/feedbackModel.js';
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const createFeedback = catchAsync(async (req, res, next) => {
    
    const userId = req.user.id; 
    const { heading, description } = req.body;

    // 2. Validate text input
    if (!heading || !description) {
        return next(new AppError('Heading and Description are required fields.', 400));
    }

    // 3. Get image file IDs from the request (processed by multer-gridfs-storage)
    let imageIds = [];
    if (req.files && req.files.length > 0) {
        // The 'upload' middleware adds the file details to req.files.
        // We just need to extract the ID of each uploaded file.
        imageIds = req.files.map(file => file.id);
    }

    // 4. Create a new feedback document in the database
    const newFeedback = await Feedback.create({
        user: userId,
        heading: heading,
        description: description,
        imageIds: imageIds, // Store the array of file IDs
    });

    res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully!',
        data: newFeedback,
    });
});

export { createFeedback };