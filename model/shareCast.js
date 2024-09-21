import mongoose from "mongoose";

const shareCastSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    castId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cast'
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

const ShareCast = mongoose.model('ShareCast', shareCastSchema);

export default ShareCast;