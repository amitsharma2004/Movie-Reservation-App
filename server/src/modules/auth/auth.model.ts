import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
    fullname: string
    email: string,
    password: string,
    role: string,
    subscription: mongoose.Schema.Types.ObjectId,
    cretedAt: Date,
    updatedAt: Date,
    address: string,
    city: string,
    state: string,
    phone: string,
    zipCode: string,
    country: string,
    avatar: string,
    isVerfied: boolean,
    history: mongoose.Schema.Types.ObjectId[]
}

interface UserMethods {
    comparePassword(password: string): boolean;
    generateToken(): { accessToken: string; refreshToken: string };
}

const userSchema = new mongoose.Schema<User, mongoose.Model<User>, UserMethods>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan"
    },
    cretedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    isVerfied: {
        type: Boolean,
        default: false
    },
    history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        }
    ]
})

userSchema.pre('save', function (next: any) {
    if (!this.isModified('password')) return next();

    this.password = bcrypt.hashSync(this.password, 10);
    next();
})

userSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

userSchema.methods.generateToken = function () {
    const accessToken = jwt.sign({
        id: this._id,
        role: this.role
    }, process.env.JWT_SECRET || "this is accessToken", {
        expiresIn: "1h"
    })

    const refreshToken = jwt.sign({
        id: this._id,
        role: this.role
    }, process.env.JWT_SECRET || "this is refreshToken", {
        expiresIn: "7d"
    })

    return { accessToken, refreshToken }
}

export const User = mongoose.model('User', userSchema);