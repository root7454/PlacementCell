//userController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";


export const register = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    phone,
    email,
    password,
    role,
    tenthPercentage,
    tenthPassingYear,
    twelfthPercentage,
    twelfthPassingYear,
    diplomaPercentage,
    diplomaPassingYear,
    degree,
    degreePercentage,
    degreePassingYear,
    activeBacklogs,
    educationGap,
    experienced,
  } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    tenthPercentage,
    tenthPassingYear,
    twelfthPercentage,
    twelfthPassingYear,
    diplomaPercentage,
    diplomaPassingYear,
    degree,
    degreePercentage,
    degreePassingYear,
    activeBacklogs,
    educationGap,
    experienced,
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === " ") {
    return next(
      new ErrorHandler(" not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "User Updated!",
  });
});
// Add this function to your userController.js

export const getUsersExceptTPO = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ role: { $ne: "TPO" } });
  res.status(200).json({
    success: true,
    users,
  });
});


export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === " ") {
    return next(
      new ErrorHandler("Student not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("OOPS! user not found.", 404));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User Deleted!",
  });
});

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});