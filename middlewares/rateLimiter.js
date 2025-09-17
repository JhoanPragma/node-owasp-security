const { RateLimiterMemory } = require("rate-limiter-flexible");

function rateLimiter(options = { points: 100, duration: 60 }) {
  const limiter = new RateLimiterMemory(options);

  return async (req, res, next) => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch {
      res.status(429).json({ error: "Too Many Requests" });
    }
  };
}

module.exports = rateLimiter;
