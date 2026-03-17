import { Router } from "express";
import { registerUserHandler, verifyUserhandler,loginUserHandler,logoutUserHandler,getCurrentUserHandler, forgotPasswordRequestHandler, forgotPasswordHandler, changeCurrentPasswordHandler,ResendEmailHandler,refreshAccessTokenHandler} from "../controllers/auth.controller.js";
import {validate} from "../middlewares/zod.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { userRegistrationValidatorSchema,userLoginValidatorSchema} from "../validators/index.js";

const AuthenticationRoute = Router()

AuthenticationRoute.route("/register").post(validate( userRegistrationValidatorSchema),registerUserHandler)
AuthenticationRoute.route("/verify-email/:rawToken").get( verifyUserhandler)
AuthenticationRoute.route("/login").post(validate(userLoginValidatorSchema),loginUserHandler)
AuthenticationRoute.route("/current-user").get(verifyJwt,getCurrentUserHandler)
AuthenticationRoute.route("/logout").post(verifyJwt,logoutUserHandler)
AuthenticationRoute.route("/forgot-password/request").get(forgotPasswordRequestHandler)
AuthenticationRoute.route("/forgot-password/:rawToken").post(forgotPasswordHandler)
AuthenticationRoute.route("/change-password").post(verifyJwt,changeCurrentPasswordHandler)
AuthenticationRoute.route("/resend-verification-email").post(ResendEmailHandler)
AuthenticationRoute.route("/refresh-token").post(refreshAccessTokenHandler)
export {AuthenticationRoute}