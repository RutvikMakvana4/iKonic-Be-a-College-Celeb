import mongoose from "mongoose";

const filterCollegeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    collegeId: {
        type: Array,
        default: null
    }
}, {
    timestamps: true
});

const FilterCollege = mongoose.model("FilterCollege", filterCollegeSchema);

export default FilterCollege;