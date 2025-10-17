const { validationResult } = require("express-validator");

// ============================================================
// Middleware: Validasi Request Body (Express Validator)
// ============================================================
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validasi gagal, periksa input Anda",
      errors: formattedErrors,
    });
  }

  next();
};
