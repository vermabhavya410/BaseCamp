import mongoose from "mongoose";


const projectSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
      trim:true,
      minLength:2,
    },
    description:{
      type:String,
      trim:true,
      default:"",
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
   { timestamps: true }
);
   
export const Project = mongoose.model("Project", projectSchema);