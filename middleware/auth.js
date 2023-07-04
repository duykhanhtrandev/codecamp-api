const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse(
        "Not authorize to access this route",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findOne({ _id: decoded.id });

    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        "Not authorize to access this route",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
});

module.exports = {
  protect,
};