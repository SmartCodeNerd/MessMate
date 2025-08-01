import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, company, phone, role, designation, department } = req.body;
  if (!email || !first_name || !last_name || !company || !phone || !role) {
    return next(new AppError("All fields are required", 400));
  }
  const result = await createUserService({ email, first_name, last_name, phone, company, role, designation, department });

  if (!result.success) {
    return next(new AppError(result.message, result.status));
  }

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {createUser};