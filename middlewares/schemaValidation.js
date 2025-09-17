const Ajv = require("ajv");
const fs = require("fs");

function schemaValidation(schemaPath) {
  const ajv = new Ajv();
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    if (["POST", "PUT"].includes(req.method)) {
      const valid = validate(req.body);
      if (!valid) {
        return res.status(400).json({
          error: "invalid_payload",
          details: validate.errors
        });
      }
    }
    next();
  };
}

module.exports = schemaValidation;
