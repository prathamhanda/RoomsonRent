const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');

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


exports.checkLogin = asyncHandler(async (req, res, next) => {
  exports.checkAuthMiddleWare(req, res, () => {
    console.log(req.user.id);
    return res.status(200).json({  status: true, message: 'Authorized',user:req.user });
  });
});

// GET Request for fetching
// exports.TERA_ROUTE = asyncHandler(async (req, res, next) => {
//   checkAuthMiddleWare(req, res, () => {
//     // req.user.id

//     // Listings.find({owner : req.user.id})

//     // fetch properties listing of that user  <> 
//     //and send in res.send()
//   });
// });


//POST REQUEST TO UPDATE CREATE OR DELETE
// exports.TERA_ROUTE = asyncHandler(async (req, res, next) => {
//   checkAuthMiddleWare(req, res, () => {
//     // req.user.id
          // req.body

          // const { name ,etc} = req.body; CREATE

          //const {id} = req.body // id of listing 
          //if user ki listing hai then Listings.delete({id});


//     // Listings.create({owner : req.user.id , id ,name ,etc})

//     //and send in res.send("added sucecessfukly")
//   });
// });

// _> 1 Shayam Ghar  delbtn -> JSON.stringify({'id' : idListing})
// _> 2 BBS
// _> 3 Mats



exports.logout = () => asyncHandler(async (req, res) => {
    // Loop through all cookies and set them to an empty value with an expired date
    Object.keys(req.cookies).forEach(cookie => {
        res.cookie(cookie, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(0) // Expire the cookie immediately
        });
    });

    res.status(200).json({ status: true, message: "Logged out successfully, all cookies expired" });
});



// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ status: false, error: "Phone number is required" });
  }

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
  const otpGen = generateOTP();

  try {
    let user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ status: false, error: "User not found. Please register first." });
    }

    // Update OTP for authentication
    user.otp = otpGen;
    await user.save();

    // Send OTP via WhatsApp API
    await axios.post(
      `${process.env.WHATSAPP_ENDPOINT}/sendWa`,
      {
        phone,
        msg: `Welcome to ROR! Your One-Time Password (OTP) is ${otpGen}. Use this to complete your verification. Do not share it with anyone.`,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.json({ status: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: false, error: "Server error. Please try again later." });
  }
});

exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ msg: 'Phone and OTP are required' });
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ msg: 'Invalid OTP' });
  }

  user.verified = true;
  user.otp = null;
  await user.save();

  sendTokenResponse(user, 200, res);
});



exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, role } = req.body;

  // if email or phone exists in database return error that user already exists

  
  if(role == 'admin'){
   res.status(403).send(JSON.stringify({'status': false, 'error': 'You cannot register as an admin'}));
  }
  
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const otpGen = generateOTP();

    try{
      const user = await User.create({
        name,
        email,
        phone,
        role: role || 'user',
        otp: otpGen
      });
    } catch (error) {
      res.status(500).send(JSON.stringify({'status': false, 'error': error}));
    }

    const response = await axios.post(
      process.env.WHATSAPP_ENDPOINT + '/sendWa',
      {
        'phone': phone,
        'msg': `Welcome to ROR! Your One-Time Password (OTP) is ${otpGen}. Use this to complete your verification. Do not share it with anyone.`
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.send(JSON.stringify({'status': true, 'message': 'OTP sent successfully'}));

  // Generate verification token
  // const verificationToken = user.generateVerificationToken();
  // await user.save({ validateBeforeSave: false });

  // Create verification url
  // const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  // const message = `
  //   <h1>Email Verification</h1>
  //   <p>Please click the link below to verify your email:</p>
  //   <a href="${verificationUrl}" target="_blank">Verify Email</a>
  // `;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: 'Email Verification - RoomsOnRent',
  //     message
  //   });


//     sendTokenResponse(user, 200, res);
//   } catch (err) {
//     console.log(err);
//     user.verificationToken = undefined;
//     user.verificationTokenExpire = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorResponse('Email could not be sent', 500));
//   }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

// @desc    Google login/register
// @route   POST /api/auth/google-login
// @access  Public
exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { name, email, photo } = req.body;

  if (!email) {
    return next(new ErrorResponse('Email is required', 400));
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user if not exists
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: crypto.randomBytes(20).toString('hex'),
      avatar: photo,
      verified: true // Google accounts are pre-verified
    });
  } else {
    // Update existing user's google info
    user.avatar = photo || user.avatar;
    user.verified = true;
    await user.save({ validateBeforeSave: false });
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const message = `
    <h1>Password Reset</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset - RoomsOnRent',
      message
    });

    res.status(200).json({
      success: true,
      data: 'Password reset email sent'
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:verificationtoken
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.verificationtoken)
    .digest('hex');

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set verified to true
  user.verified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      status: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        avatar: user.avatar
      }
    });
};