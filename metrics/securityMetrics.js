const client = require("prom-client");

const invalidPayloadCounter = new client.Counter({
  name: "security_payload_invalid_count",
  help: "Número de payloads inválidos"
});

const rateLimitBlockedCounter = new client.Counter({
  name: "security_ratelimit_blocked_count",
  help: "Número de requests bloqueadas por rate limiting"
});

function metrics() {
  return async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  };
}

module.exports = metrics;
