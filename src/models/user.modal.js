import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const userSchema = new Schema({
  profileImage: {
    type: {
      url: String,
      localPath: String,
    },
    default: {
      url: 'https://placehold.co/200x200',
      localPath: '',
    },
  },
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: [50, 'Name should be less than 50 characters'],
  },
  userName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: [50, 'Name should be less than 50 characters'],
    index: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    trim: true,
    minlength: 4,
  
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationTokenExpiry: {
    type: Date,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordTokenExpiry: {
    type: Date,
  },
},
  { timestamps: true })

// Before saving the userSchema, hash its password
userSchema.pre("save", async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// To compare the password for login
userSchema.methods.isPasswordCorrect = async function (incomingPassword) {
  return bcrypt.compare(incomingPassword, this.password)
}

// Generating access token with the help of jwt.
// jwt accepts 3 parameters: payload(data)+secret Key+expiresIn
userSchema.methods.generateAccessToken = async function () {
  try {
    const token = await jwt.sign(
      {
        id: this._id,
        email: this.email,
        userName: this.userName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    )
  return token
  } catch (error) {
    console.log(error, "Error in generating Access Token!")
  }

}

//Generating Refresh Token
userSchema.methods.generateRefreshToken = async function () {
  try {
    const token = await jwt.sign({
      id: this._id
    }, process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
      
    return token

  } catch (error) {
    console.log(error, "error generating refresh token");

  }
}


//Generated Email verification Token that user will get when he try to verify its email
userSchema.methods.generateEmailVerificationToken = async function () {
  try {
    // generate a random token
    const rawToken = uuidv4()
    // hash token
    this.emailVerificationToken = await bcrypt.hash(rawToken, 10)
    this.emailVerificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000

    return rawToken
  } catch (error) {
    console.log(error, "error generating email verification token");
  }
}

//Generated forgot password token in case user forgets its password
userSchema.methods.generateForgotPasswordToken = async function () {
  try {
    // generate a random token
    const rawToken = uuidv4()
    // hash token
    this.forgotPasswordToken = await bcrypt.hash(rawToken, 10)
    this.forgotPasswordTokenExpiry = Date.now() + 20 * 60 * 1000

    return rawToken
  } catch (error) {
    console.log(error, "error generating forgot password token");
  }
}

const User = mongoose.model('User', userSchema)

export default User