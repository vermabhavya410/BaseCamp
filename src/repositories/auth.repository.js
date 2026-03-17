import User from "../models/user.modal.js";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error.js";

//We are performing various crud operations on database modal we created.


//For Creating the User
const createUser = async ({ fullName, userName, email, password }) => {
  const user = await User.create({
    fullName,
    userName,
    email,
    password
  })
  return user
}

//Read operations for reading the id passed by user 
const findUserById = async (id) => {
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "user not found by id")
  }
  return user
}

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email })
  return user
}

const findUserByEmailOrUserName = async (email, userName) => {
  const user = await User.findOne({
    $or: [
      { email },
      { userName }
    ]
  })
  return user
}

//Update Operation
const saveUser = async (user) => {
  const updatedUser = await user.save({ validateBeforeSave: false })
  return updatedUser
}

//find the user by id and assign it a refresh token in the refresh token field
const assignRefreshToken = async (userId, refreshToken) => {
  const user = await User.findByIdAndUpdate(userId, {
    $set: { refreshToken: refreshToken }
  })
  await user.save()
  return user

}

// 6 March 2026

//find user with a valid verification Token
const findUserwithValidverficationToken = async () => {
  const users = await User.find({
    isEmailVerified: false,
    emailVerificationTokenExpiry: { $gt: Date.now() }
  })
  return users
}

//Function used to verify the user and set and unset some of its properties in the database.
const verifyUser = async (userId) => {
  const verifieduser = await User.findByIdAndUpdate(userId, {
    $set: {
      isEmailVerified: true
    },
    $unset: {
      emailVerificationToken: null,
      emailVerificationTokenExpiry: null
    }
  })
  return verifieduser
}

//Function used to logout the user from DB and remove its refresh Token
const logout = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, {
    $unset: {
      refreshToken
    }
  }, {
    new: true
  })
  return user
}

//11-03-26

//Used to find user with a valid reset Token, reset token assures a valid req for pass change.
//$ne: not equal to functionality,provided by mongoose!
const findUsersWithValidResetToken = async () => {
  const users = await User.find({
    forgotPasswordToken: { $ne: null },
    forgotPasswordTokenExpiry: { $gt: Date.now() }
  })
  return users
}

//After getting a valid reset Token, update/reset password.
const resetPassword = async (id, newPassword) => {
  const user = await User.findByIdAndUpdate(id, {
    $set: { password: newPassword },
    $unset: {
      forgotPasswordToken: null,
      forgotPasswordTokenExpiry: null
    }
  })
  return user;
}

const changeCurrentPassword  = async (id, newPassword) => {
  const user = await User.findByIdAndUpdate(id, {
    $set: { password: newPassword }
  },
    {
      new: true
    }
  )
  return user

}

export {
  createUser,
  findUserByEmail,
  findUserByEmailOrUserName,
  saveUser,
  findUserById,
  assignRefreshToken,
  findUserwithValidverficationToken,
  verifyUser,
  logout,
  findUsersWithValidResetToken,
  resetPassword,
  changeCurrentPassword
}