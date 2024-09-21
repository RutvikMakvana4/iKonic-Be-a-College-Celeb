import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    castId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cast'
    },
    status: {
        type: Number,
        trim: true
    },
    type: {
        type: Number,
        default: null
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    readAt: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model('notification', notificationSchema);

export default Notification;