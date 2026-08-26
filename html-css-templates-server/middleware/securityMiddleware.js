import rateLimit from "express-rate-limit";

// Rate limiter for authentication endpoints (login, register, reset password)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});

// General rate limiter for public marketplace APIs
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests sent to the server. Please slow down.",
  },
});

// Security HTTP headers middleware
export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};

// Global Express Error Handler Middleware
export const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 [SERVER ERROR]:", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    message: err.message || "An unexpected internal server error occurred",
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
