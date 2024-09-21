import mongoose from "mongoose";

const sheerIdSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    verificationId: {
        type: String,
        default: null
    },
    currentStep: {
        type: String,
        default: null
    },
    errorIds: [
        {
            type: String,
            default: null
        }
    ]
}, {
    timestamps: true
});

const SheerId = mongoose.model('SheerId', sheerIdSchema);

export default SheerId;