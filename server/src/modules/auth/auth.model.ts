import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";

interface User {
    fullname: string;
    email: string;
    password: string;
    role: string;
    subscription?: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    zipCode?: string;
    country?: string;
    avatar: string;
    isVerified: boolean;
    history: mongoose.Schema.Types.ObjectId[];
}

interface UserMethods {
    comparePassword(password: string): boolean;
    generateToken(): { accessToken: string; refreshToken: string };
}

const userSchema = new mongoose.Schema<User, mongoose.Model<User>, UserMethods>({
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters'],
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin"],
            message: 'Role must be either user or admin'
        },
        default: "user"
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    city: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    state: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        required: false,
        match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number'],
        default: ''
    },
    zipCode: {
        type: String,
        required: false,
        match: [/^[0-9]{5,10}$/, 'Please provide a valid zip code'],
        default: ''
    },
    country: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    avatar: {
        type: String,
        default: 'default-avatar-url'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        }
    ]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: any) {
        logger.error('Error hashing password:', error.message);
        throw error;
    }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function () {
    this.updatedAt = new Date();
});

// Compare password method
userSchema.methods.comparePassword = function (password: string): boolean {
    try {
        return bcrypt.compareSync(password, this.password);
    } catch (error: any) {
        logger.error('Error comparing passwords:', error);
        return false;
    }
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Generate JWT tokens
userSchema.methods.generateToken = function (): { accessToken: string; refreshToken: string } {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
        logger.error('JWT_SECRET is not configured');
        throw new Error('JWT_SECRET is not configured');
    }

    const accessToken = jwt.sign(
        {
            id: this._id.toString(),
            role: this.role
        },
        jwtSecret,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        {
            id: this._id.toString(),
            role: this.role
        },
        jwtSecret,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

export const User = mongoose.model('User', userSchema);