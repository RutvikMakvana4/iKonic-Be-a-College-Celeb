import mongoose from "mongoose";

const privacyAndSecuritySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accountStatus: {
        type: String,    // 1 - Public || 2 - Private
        default: 1
    },
    manageNotifications: {
        type: Boolean,
        default: false
    },
    isParticipant: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const PrivacySecurity = mongoose.model('PrivacySecurity', privacyAndSecuritySchema);

export default PrivacySecurity;