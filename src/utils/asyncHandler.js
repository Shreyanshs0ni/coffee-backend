const asyncHandler = (requestHandler) => {
  return (res, req, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(error));
  };
};

export { asyncHandler };

// const asyncHandler = (fn) => async (res, req, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
