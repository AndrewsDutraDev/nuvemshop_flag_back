const { error } = require('../utils/response');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    if (!result.success) {
      return error(res, 'Validation error', 400, result.error.flatten());
    }
    req.validated = result.data;
    return next();
  };
}

module.exports = { validate };
