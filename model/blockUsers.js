import mongoose from "mongoose";

const blockUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    blockUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const BlockUser = mongoose.model("BlockUser", blockUserSchema);

export default BlockUser;