import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error.js";
import { registerUserService, verifyUserService, loginUserService ,logoutUserService} from "../services/auth.service.js";
import { ApiResponse } from "../utils/api-response.js";

//register user handler, which is functionality that should perform on a particular route
const registerUserHandler = async (req, res) => {
  try {
    //getting data from frontend that will come from frontend body
    const { fullName, userName, email, password } = req.body
    if (!fullName || !userName || !email || !password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "all fields are required")
    }
    //Calls service, in service layer the logic for creating user exits
    const user = await registerUserService({
      fullName,
      userName,
      email,
      password
    })
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, user, "user created successfully and a verification mail is sent to the user's email")
    )
  } catch (error) {
    console.log(error, "error in register user handler in controller folder!")
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
}

const verifyUserhandler = async (req, res) => {
  try {
    const { rawToken } = req.params;
    await verifyUserService(rawToken)
    return res.status(400).json(new ApiResponse(StatusCodes.ACCEPTED, {}, "USer verification is Successful!🥳"))
  } catch (error) {
    console.log(error, "Error in verify user handler!");
    throw new ApiError(StatusCodes.BAD_REQUEST, "error in verify user Handler!"), {
      error
    }
  }
}

const loginUserHandler = async (req, res) => {
  try {
    const { email, password } = req.body
    const { user, accessToken, refreshToken } = await loginUserService({
      email, password
    })
    return res.
      status(StatusCodes.OK)
      .cookie("accessToken", accessToken,
        {
          httpOnly: true,
          secure: true
        })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true
      })
      .json(new ApiResponse(StatusCodes.OK, {
        user,
        accessToken,
        refreshToken
      }, "user logged in successfully"))
  } catch (error) {
    console.log(error.message, "error in login user handler");
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "error in login user handler", {
      error
    })
  }
}

const getCurrentUserHandler = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(StatusCodes.OK, req.user, "current user fetched successfully"))
  } catch (error) {
    console.log(error, "Error in fetching Current User!");
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error in current user Handler!")
  }
}

const logoutUserHandler = async (req, res) => {
  try {
    await logoutUserService(req.user._id)
    return res
      .status(StatusCodes.OK)
      .cookie("accessToken", null, {
        httpOnly: true,
        secure: true
      })
      .cookie("refreshToken", null, {
        httpOnly: true,
        secure: true
      })
      .json(new ApiResponse(StatusCodes.OK, {}, "user logged out successfully"))
  } catch (error) {
    console.log(error, "error logging out user");
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "error in logout handler")
  }
}
export {
  registerUserHandler,
  verifyUserhandler,
  loginUserHandler,
  getCurrentUserHandler,
  logoutUserHandler
}