import mongoose from "mongoose";

const tuneInViewerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tuneInId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TuneIn"
    },
    view: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isUnlockProfile: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const TuneInViewer = mongoose.model('TuneInViewer', tuneInViewerSchema);

export default TuneInViewer;