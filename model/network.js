import mongoose from "mongoose";

const NetworkSchema = new mongoose.Schema({
    image: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

const Network = mongoose.model('Network', NetworkSchema);

export default Network;