import { get } from "mongoose";
import User from "../models/Users.schema";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";

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
