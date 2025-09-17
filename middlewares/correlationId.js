const { v4: uuidv4 } = require("uuid");

function correlationId(headerName = "X-Correlation-Id") {
  return (req, res, next) => {
    const id = req.headers[headerName.toLowerCase()] || uuidv4();
    req.correlationId = id;
    res.setHeader(headerName, id);
    next();
  };
}

module.exports = correlationId;
