import { StatusCodes } from "http-status-codes";
import { createUser, findUserByEmail, findUserByEmailOrUserName, findUserwithValidverficationToken, saveUser, verifyUser, findUserById,logout } from "../repositories/auth.repository.js";
import { ApiError } from "../utils/api-error.js";
import { userVerificationEmailContent } from "../utils/mail.template.js";
import { sendEmail } from "./mailer.js";
import bcrypt from "bcrypt";

const generateAccessTokenandrefreshToken = async (userId) => {
  const user = await findUserById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not Found!")
  }
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
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
  const verificationLink = `http://localhost:${process.env.PORT}/api/v1/auth/verify-email/${rawToken}`

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
  if (!rawToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token not Found!")
  }
  const usersWithToken = await findUserwithValidverficationToken()
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

const logoutUserService=async(userId)=>{
  if(!userId){
    throw new ApiError(StatusCodes.BAD_REQUEST,"unauthorized")
    await logout(userId)
    return{
      message:"user logged out successfully!"
    }
  }
}
export {
  registerUserService,
  verifyUserService,
  loginUserService,
  logoutUserService
}

