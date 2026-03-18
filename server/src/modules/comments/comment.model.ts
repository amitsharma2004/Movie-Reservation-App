import mongoose from 'mongoose';

interface Comment {
    movieId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    userName: string;
    userAvatar?: string;
    comment: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new mongoose.Schema<Comment>({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie ID is required'],
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    userName: {
        type: String,
        required: [true, 'User name is required'],
        trim: true
    },
    userAvatar: {
        type: String,
        default: 'default-avatar-url'
    },
    comment: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        minlength: [1, 'Comment must be at least 1 character'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    }
}, {
    timestamps: true
});

// Indexes for better query performance
commentSchema.index({ movieId: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });

export const Comment = mongoose.model<Comment>('Comment', commentSchema);
