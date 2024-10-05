import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],

    },
    role: {
        type: String,
        enum: ['admin', 'instructor', 'learner'],
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'course'
        }
    ],
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})
//using bcrypt before saving the data only when password is changed
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})
// checking password 
userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// generating tokens
userSchema.methods.genAccToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.genRefToken = async function () {
    return jwt.sign(
        {
            _id: this._id,          // _id mongodb id

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)