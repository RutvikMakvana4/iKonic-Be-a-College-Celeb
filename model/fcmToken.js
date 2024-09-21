import mongoose from "mongoose";

const fcmSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        index: {
            unique: true
        }
    },
    deviceId: {
        type: String,
        trim: true
    },
    deviceType: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

const FcmStore = mongoose.model('fcmtoken', fcmSchema);

export default FcmStore;