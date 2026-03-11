import e,{urlencoded} from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { AuthenticationRoute } from "./routes/auth.router.js";

export const app=e();

app.use(e.json({limit:"16kb"}))
app.use(urlencoded({limit:"16kb"}))
app.use(cookieParser());

app.use("/api/v1/auth",AuthenticationRoute);