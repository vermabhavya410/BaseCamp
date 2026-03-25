import { StatusCodes } from "http-status-codes";
import { createUser, findUserByEmail, findUserByEmailOrUserName, findUserwithValidverficationToken, saveUser, verifyUser, findUserById, logout, findUsersWithValidResetToken, changeCurrentPassword, assignRefreshToken,resetPassword } from "../repositories/auth.repository.js";
import { ApiError } from "../utils/api-error.js";
import { forgotPasswordEmailContent, userVerificationEmailContent } from "../utils/mail.template.js";
import { sendEmail } from "./mailer.js";
import bcrypt from "bcrypt";


const generateAccessTokenandrefreshToken = async (userId) => {
  const user = await findUserById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not Found!")
  }
  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()
  return {
    accessToken,
    refreshToken
  }
}

//register user service:Normal function with some register functionality
//destructuring various fields we got from controller
const registerUserService = async ({ fullName, userName, email, password }) => {
  //checking if user already exists
  const existingUser = await findUserByEmailOrUserName(email)
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already exists!")
  }

  //If upper code results false then user will be created
  const user = await createUser({
    fullName, userName, email, password
  })

  console.log("user created successfully!");

  //assigning a email verification token to user so that it can verify its email
  const rawToken = await user.generateEmailVerificationToken()


  //saving the user
  await saveUser(user)

  //verification link that user will get in its email

  //changed it to Frontend Link because after clicking the link in email user should be directed to frontend page where we will call verify email api with raw token to verify user email
  const verificationLink = `http://localhost:5173/verify-email/${rawToken}`;

  //generating html for email
  const { html } = userVerificationEmailContent({
    name: user.fullName,
    verificationLink
  })

  //sending email
  await sendEmail({
    userEmail: user.email,
    subject: "user verification email",
    html
  })
  return user
}

const verifyUserService = async (rawToken) => {
  console.log("raw token in service is ", rawToken)
  if (!rawToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token not Found!")
  }
  const usersWithToken = await findUserwithValidverficationToken()
  console.log("users with token are ", usersWithToken.length)
  if (!usersWithToken.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No user Found!")
  }

  const comparision = await Promise.all(
    usersWithToken.map(async (user) => {
    
      const isMatched = await bcrypt.compare(rawToken, user.emailVerificationToken)
      return isMatched ? user : null
    })
  )
  const matchedUser = comparision.find((result) => result !== null)
  if (!matchedUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired token!");
      }
  if (matchedUser.isEmailVerified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is already verified!")
  }


  await verifyUser(matchedUser._id)

  return {
    message: "User verification Done! Congrats🎉"
  }

}

const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Both email and password is requires!")
  }
  const user = await findUserByEmail(email)
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "This email does not exist!")
  }
  const isPasswordCorrect = user.isPasswordCorrect(password)
  if (!isPasswordCorrect) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "invalid password")
  }
  if (!user.isEmailVerified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "please verify email before loggin in")
  }
  const { accessToken, refreshToken } = await generateAccessTokenandrefreshToken(user._id)
  return {
    user,
    accessToken,
    refreshToken
  }
}

const logoutUserService = async (userId) => {
  if (!userId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "unauthorized")
    await logout(userId)
    return {
      message: "user logged out successfully!"
    }
  }
}

//11 March 2026
const forgotPasswordRequestService = async (email) => {
  if (!email) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required!")
  }
  const user = await findUserByEmail(email)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Cannot Find user with this email!")
  }
  const rawToken = await user.generateForgotPasswordToken()
  await saveUser(user)

  const verificationLink = `http://localhost:5173/forgot-password/${rawToken}`

  const { html } = forgotPasswordEmailContent({
    name: user.fullName,
    verificationLink
  })

  await sendEmail({
    userEmail: user.email,
    subject: "forgot password Request",
    html: html
  })
  return {
    message: "A verification Email has been sent to your email address!"
  }
}

const forgotPasswordService = async (rawToken, newPassword) => {
  if (!rawToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token Not Found!")
  }
  if (!newPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "New Password is Required!")
  }
  const usersWithToken = await findUsersWithValidResetToken()
  if (!usersWithToken.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No User Found with a Valid Token!")
  }
  const comparision = await Promise.all(
    usersWithToken.map(async (user) => {
      const isMatched = await bcrypt.compare(rawToken, user.forgotPasswordToken)
      return isMatched ? user : null
    })
  )
  const matchedUser = comparision.find((result) => result !== null)
  if (!matchedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'user not found')
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await resetPassword(matchedUser._id, hashedPassword)

  return {
    message: "Password reset successfully"
  }
}

const changeCurrentPasswordService = async (user, oldPassword, newPassword) => {
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No User Found!")
  }
  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if (!isOldPasswordCorrect) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Old Password is Incorrect!")
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await changeCurrentPassword(user._id, hashedPassword)

  return {
    message: "Password changed successfully"
  }
}

const ResendEmailService = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User Not Found!");
  }
  if (user.isEmailVerified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User email is already Verified!");
  }
  const rawToken = await user.generateEmailVerificationToken()
  await saveUser(user)

  const verificationLink = `http://localhost:${process.env.PORT}/api/v1/auth/verify-email/${rawToken}`

  const { html } = userVerificationEmailContent({
    name: user.fullName,
    verificationLink
  })
  console.log("Before sending email")
  await sendEmail({
    userEmail: user.email,
    subject: "Resend Verification email",
    html
  })
  console.log("After sending email")
  return {
    message: "Verification email sent again successfully!"
  }
}

const refreshAccessTokenService = async (incomingToken) => {
  if (!incomingToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token Not Found!")
  }
  const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
  const user = await findUserById(decodedToken.id)
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "user not found")
  }

  if (incomingToken !== user.refreshToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "invalid token")
  }
  const { accessToken, refreshToken } = await generateAccessTokenandrefreshToken(user._id)
  await assignRefreshToken(user._id, refreshToken)
  return {
    accessToken,
    refreshToken
  }
}
export {
  registerUserService,
  verifyUserService,
  loginUserService,
  logoutUserService,
  forgotPasswordRequestService,
  forgotPasswordService,
  changeCurrentPasswordService,
  ResendEmailService,
  refreshAccessTokenService
}

