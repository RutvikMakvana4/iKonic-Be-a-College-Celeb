import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    threadName: {
        type: String,
        default: null
    },
    addFriends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    description: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Thread = mongoose.model('Thread', ThreadSchema);

export default Thread;