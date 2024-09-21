import mongoose from "mongoose";

const subCultureSchema = new mongoose.Schema({
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

const SubCulture = mongoose.model('SubCulture', subCultureSchema);

export default SubCulture;