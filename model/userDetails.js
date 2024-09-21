import mongoose from "mongoose";

const userDetailSchema = new mongoose.Schema({
    type: {
        type: Number,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    thankYou: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    shoutOut: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    secretAdmirer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
   
}, { timestamps: true });

const UserDetails = mongoose.model('UserDetails', userDetailSchema);

export default UserDetails;