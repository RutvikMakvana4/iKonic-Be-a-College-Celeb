import mongoose from "mongoose";

const followRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: Number,    //  1 -> requested  2 -> confirm   3-> follow
        default: 0
    }
}, {
    timestamps: true
});

const FollowRequest = mongoose.model("FollowRequest", followRequestSchema);

export default FollowRequest;