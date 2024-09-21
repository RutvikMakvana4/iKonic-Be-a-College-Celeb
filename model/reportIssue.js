import mongoose from "mongoose";

const reportIssueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    issue: {
        type: String,
        trim: true
    },
    describeIssue: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
});

const ReportIssue = mongoose.model('ReportIssue', reportIssueSchema);

export default ReportIssue;