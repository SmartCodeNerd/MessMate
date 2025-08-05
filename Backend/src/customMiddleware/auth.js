import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");
    if (!req.user) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token.", 401));
  }
};

const isRole = (roleName) => {
  return async (req, res, next) => {
    try {
      if (req.user?.role?.toString() === roleName) {
        return next(); 
      }
      
      return next(new AppError(`Access denied: ${roleName} only`, 403));
    } catch (error) {
      return next(new AppError('Server error: ' + error.message, 500));
    }
  };
};

const orMiddleware = (...middlewares) => {
  return async (req, res, next) => {
    let lastError = null;

    for (let middleware of middlewares) {
      try {
        await new Promise((resolve, reject) => {
          middleware(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return next(); 
      } catch (err) {
        lastError = err;
      }
    }

    return next(lastError || new AppError("Unauthorized access", 403));
  };
};

const isSuperAdmin = isRole('Super Admin');
const isMessAdmin = isRole('Mess Admin');
const isClgAdmin = isRole('College Admin');
const isStudent = isRole('Student');

export {
    protect,
    isStudent,
    isClgAdmin,
    isMessAdmin,
    isSuperAdmin,
    orMiddleware
};
