import mongoose from "mongoose";

const castSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        default: null
    },
    docType: {
        type: String,
        default: null
    },
    thumbnail: {
        type: String,
        default: null
    },
    uploadFile: {
        type: String,
        default: null
    },
    uploadFileName: {
        type: String,
        default: null
    },
    uploadFiles: [
        {
            type: String
        }
    ],
    location: {
        type: String,
        default: null
    },
    latitude: {
        type: String,
        trim: true,
        default: null
    },
    longitude: {
        type: String,
        trim: true,
        default: null
    },
    tagFriend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    userPostImage: {
        type: String,
        default: null
    },
    tagFriendImage: {
        type: String,
        default: null
    },
    describeCast: {
        type: String,
        default: null
    },
    isNominateForTrendz: {
        type: Boolean,
        default: false
    },
    thankYouMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CastMessages",
        default: null
    },
    shoutOutMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CastMessages",
        default: null
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CastMessages",
        default: null
    },
    frequency: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        default: null
    },
    feedbackRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CastMessages",
        default: null
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ]
}, {
    timestamps: true
});

const Cast = mongoose.model('Cast', castSchema);

export default Cast;