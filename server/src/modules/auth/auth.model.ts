import mongoose from "mongoose";

interface User {
    fullname: string
    email: string,
    password: string,
    role: string,
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan"
    },
    cretedAt: Date,
    updatedAt: Date,
    
}