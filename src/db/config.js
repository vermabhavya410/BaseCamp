import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";
import "dotenv/config";

const connectDB = async () => {
  try {
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MongoDB is connected and app is running on port : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(error, "error in mongodb connection");
    process.exit(1)
  }
}

export {connectDB}