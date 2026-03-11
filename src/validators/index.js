import z from "zod";

export const userRegistrationValidatorSchema=z.object({
  fullName:z.string().min(3,"min length should be 3 characters").max(50,"max length should be 50 characters"),
  userName:z.string().min(3,"min length should be 3 characters").max(50,"max length should be 50 characters"),
  email:z.string().email("invalid email address").toLowerCase(),
  password:z.string().min(8,"min length should be 8 characters").max(100,"max length should be 100 characters")
})

export const userLoginValidatorSchema = z.object({
    email:z.string().email().toLowerCase(),
    password:z.string().min(5).max(50)
})