import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    image: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Interests = mongoose.model('Interests', interestSchema);

export default Interests;