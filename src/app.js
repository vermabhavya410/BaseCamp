import e,{urlencoded} from "express";
import "dotenv/config";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { AuthenticationRoute } from "./routes/auth.router.js";
import Projectroute from "./routes/project.routes.js";

export const app=e();

app.use(e.json({limit:"16kb"}))
app.use(urlencoded({limit:"16kb"}))
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));

app.get("/api/v1/auth/test",(req,res)=>{
  res.json({message:"Backend is working"});
})

app.use("/api/v1/auth",AuthenticationRoute); 
app.use("/api/v1/projects",Projectroute); 