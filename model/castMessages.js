import mongoose from "mongoose";

const castMessageSchema = new mongoose.Schema({
    type: {
        type: Number
    },
    icon: {
        type: String,
        default: null
    },
    message: {
        type: String
    }
}, {
    timestamps: true
});

const CastMessages = mongoose.model('CastMessages', castMessageSchema);

export default CastMessages;