import { Router } from "express";
import { registerUserHandler, verifyUserhandler,loginUserHandler,logoutUserHandler,getCurrentUserHandler } from "../controllers/auth.controller.js";
import {validate} from "../middlewares/zod.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { userRegistrationValidatorSchema,userLoginValidatorSchema} from "../validators/index.js";
const AuthenticationRoute = Router()


AuthenticationRoute.route("/register").post(validate( userRegistrationValidatorSchema),registerUserHandler)
AuthenticationRoute.route("/verify-email/:rawToken").get( verifyUserhandler)
AuthenticationRoute.route("/login").post(validate(userLoginValidatorSchema),loginUserHandler)
AuthenticationRoute.route("/current-user").get(verifyJwt,getCurrentUserHandler)
AuthenticationRoute.route("/logout").post(verifyJwt,logoutUserHandler)


export {AuthenticationRoute} 