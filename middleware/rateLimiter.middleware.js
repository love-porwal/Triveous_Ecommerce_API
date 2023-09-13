const maxRequests = 5;
const windowMs = 60 * 1000;

const requestCounter = new Map();
const requestTimer = new Map();

// Rate limiting middleware
const rateLimit = (req, res, next) => {
  try {
    const clientIP = req.ip;
    if (
      !requestCounter.has(clientIP) ||
      requestTimer.get(clientIP) < Date.now()
    ) {
      requestCounter.set(clientIP, 1);
      requestTimer.set(clientIP, Date.now() + windowMs);
    } else {
      requestCounter.set(clientIP, requestCounter.get(clientIP) + 1);
     
      if (requestCounter.get(clientIP) > maxRequests) {
        return res
          .status(429)
          .json({
            message: "Rate limit exceeded. Please try after 1 minute.",
            ok: false,
          });
      }
    }
    next();
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = { rateLimit };
