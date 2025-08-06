// utils/globalErrorHandler.js

const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 Error caught by globalErrorHandler:", err);

  // Set default values if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send the error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Optionally include this in development:
    // stack: err.stack
  });
};

export default globalErrorHandler;
