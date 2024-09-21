import mongoose from "mongoose";

const castViewerSchema = new mongoose.Schema({
    castId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cast"
    },
    viewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const CastViewer = mongoose.model('CastViewer', castViewerSchema);

export default CastViewer;