import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ],
    thankYou: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ],
    shoutOut: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ],
    ikons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ],
    secretlyAdmire: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ]
}, {
    timestamps: true
});

const Followers = mongoose.model('Followers', followerSchema);

export default Followers;