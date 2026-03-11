import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { StatusCodes } from "http-status-codes";
import { findUserById } from "../repositories/auth.repository.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const token=req.cookies?.accessToken
    if(!token){
     throw new ApiError(StatusCodes.NOT_FOUND,"unauthorized")
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    if(!decodedToken){
       throw new ApiError(StatusCodes.BAD_REQUEST,"invalid token")
    }
    const user=await findUserById(decodedToken.id)
      if(!user){
          throw new ApiError(StatusCodes.NOT_FOUND,"user not found")
      }
      req.user=user
      next()
  } catch (error) {
    console.log(error, "error validating jwt");
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "error validating jwt", {
      error
    })
  }
}