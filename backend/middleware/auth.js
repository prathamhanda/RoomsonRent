const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');


// USE THIS checkauth
exports.checkAuthMiddleWare = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
      return res.status(401).json({  status: false, error: 'Not authorized, no token' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //get user from db
      const user = await User.findById(decoded.id);
      req.user = user;
      next();
  } catch (error) {
      res.status(401).json({  status: false, error:'Not authorized, token failed, ' + error });
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      res.status(403).send('ERR IN authorize middleware ??!')
    }
    next();
  };
}; 