import mongoose from "mongoose";

const ikonsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    ikonImage: {
        type: String,
        default: null
    },
    ikonName: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Ikons = mongoose.model('Ikons', ikonsSchema);

export default Ikons;