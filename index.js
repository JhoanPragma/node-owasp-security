const correlationId = require("./middlewares/correlationId");
const schemaValidation = require("./middlewares/schemaValidation");
const rateLimiter = require("./middlewares/rateLimiter");
const ssrfGuard = require("./middlewares/ssrfGuard");
const securityHeaders = require("./middlewares/securityHeaders");
const metrics = require("./metrics/securityMetrics");

module.exports = {
  correlationId,
  schemaValidation,
  rateLimiter,
  ssrfGuard,
  securityHeaders,
  metrics
};
