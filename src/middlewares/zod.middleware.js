import { ZodError } from "zod";
import {ApiError} from "../utils/api-error.js";
import {StatusCodes} from "http-status-codes";


export const validate=(schema)=>{
   return async(req,res,next)=>{
    try {
      const parsed=await schema.parseAsync(req.body);
      req.body=parsed;
       next(); 
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success:false,
          errors:error.issues.map((err)=>({
            field:err.path.join("."),
            message:err.message
          }))
        })
      }
      throw new ApiError (500,"error in validator middleware")
    }
   }
}
