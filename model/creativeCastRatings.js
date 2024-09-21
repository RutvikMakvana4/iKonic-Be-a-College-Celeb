import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    castId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cast"
    },
    rating: {
        type: Number,
        default: null
    },
    ratingBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;