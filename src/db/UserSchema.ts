import mongoose from "mongoose"
const UserSchema = new mongoose.Schema({
    username: {
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
    level: {
        type: Number,
        required: true
    },
    scoreMulti: {
        type: Number,
        required: true
    },
    scores: {
        type: Array,
        required: true
    },
    finalScore: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
