import mongoose from "mongoose";

const phoneVerificationSchema = new mongoose.Schema({
    countryCode: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    phoneOTP: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const PhoneVerification = mongoose.model('phoneVerification', phoneVerificationSchema);

export default PhoneVerification;