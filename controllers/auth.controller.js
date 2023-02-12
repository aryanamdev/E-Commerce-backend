import User from "../models/User.schema";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";
import mailHelper from "../utils/mailHelper";
import crypto from "crypto";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  // could be in seperate file in utils
};

/***********************************
@SIGNUP

@route http://localhost:4000/api/auth/signup
@description User signup controller for creating a new user
@parameters
@return User Object()
***********************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new customError("Please provide all the fields", 400);
  }
  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new customError("User already exits", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();
  console.log(user);
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/***********************************
@SIGNIN

@route http://localhost:4000/api/auth/login
@description User signIn controller for logging in a new user
@parameters email password
@return User Object()
***********************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customError("Please provide all the fields", 400);
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new customError("Invalid credentials", 400);
  }

  const isPasswordMatched = await user.comparedPassword(password);

  if (!isPasswordMatched) {
    throw new customError("Invalid Credentials - Password");
  } else {
    const token = user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }
});

/***********************************
@LOGOUT

@route http://localhost:4000/api/auth/logout
@description User logout by clearing user cookies
@parameters email password
@return User Object()
***********************************/

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

/***********************************
@FORGOTPASSWORD

@route http://localhost:4000/api/auth/password/forgot
@description User logout by clearing user cookies
@parameters email
@return success message - email sent
***********************************/

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new customError("Please provide with a value", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new customError("User not found", 404);
  }

  const resetToken = user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/password/reset/${resetToken}`;

  const text = `Your password reset link is ${resetUrl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: "Password reset email for website",
      text: text,
    });
    res
      .status(200)
      .json({ success: true, message: `Email sent to ${user.email}` });
  } catch (error) {
    // rollback - clear field
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new customError(error.message, 500);
  }
});

/***********************************
@RESETPASSWORD

@route http://localhost:4000/api/auth/password/reset/:resetPasswordToken
@description User will be able to reset password based on url token
@parameters token from url, password, confirm password
@return User Object()
***********************************/

export const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new customError("password token is invalid or expired", 400);
  }

  if (password != confirmPassword) {
    throw new customError("password and confirm password doesn't match", 400);
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  // create token and send as response
  const token = user.getJwtToken();
  user.password = undefined;

  // helper method for cookie can be added
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    user,
  });
});

// Todo: Create a controller for change password
