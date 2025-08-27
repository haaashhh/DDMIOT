import rateLimit from 'express-rate-limit';

export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100, // limit each IP to 100 requests per windowMs
  message: string = 'Too many requests from this IP'
) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date().toISOString(),
        limit: max,
        window: windowMs,
      },
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

// Default rate limiter
export const defaultRateLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
);

// Strict rate limiter for sensitive endpoints
export const strictRateLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  20, // 20 requests per 5 minutes
  'Too many requests to this endpoint'
);

// Lenient rate limiter for metrics endpoints
export const metricsRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  60, // 60 requests per minute
  'Too many metrics requests'
);