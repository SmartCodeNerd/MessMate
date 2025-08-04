import College from "../models/collegeModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// 🔹 Create a college
export const createCollege = catchAsync(async (req, res, next) => {
  const { name, code } = req.body;
  const createdBy = req.user._id; // Assuming authenticated SuperAdmin

  if (!name || !code) {
    return next(new AppError("Name and code are required", 400));
  }

  const existingCollege = await College.findOne({ code });
  if (existingCollege) {
    return next(new AppError("College code already exists", 409));
  }

  const college = await College.create({ name, code, createdBy });

  res.status(201).json({
    success: true,
    message: "College created successfully",
    data: college,
  });
});

// 🔹 Get all colleges
export const getColleges = catchAsync(async (req, res, next) => {
  const colleges = await College.find().populate("createdBy", "name email");
  res.status(200).json({
    success: true,
    data: colleges,
  });
});

// 🔹 Get college by ID
export const getCollegeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const college = await College.findById(id).populate("createdBy", "name email");
  if (!college) {
    return next(new AppError("College not found", 404));
  }

  res.status(200).json({
    success: true,
    data: college,
  });
});

// 🔹 Update a college
export const updateCollege = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedCollege = await College.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedCollege) {
    return next(new AppError("College not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "College updated successfully",
    data: updatedCollege,
  });
});

// 🔹 Delete a college
export const deleteCollege = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedCollege = await College.findByIdAndDelete(id);
  if (!deletedCollege) {
    return next(new AppError("College not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "College deleted successfully",
  });
});
