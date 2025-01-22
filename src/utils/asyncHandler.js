function asyncHandler(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(err.code || 400).json({
        success: false,
        message: err.message,
      });
    }
  };
}

module.exports = asyncHandler;
