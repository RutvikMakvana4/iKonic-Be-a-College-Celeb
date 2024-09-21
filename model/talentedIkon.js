import mongoose from "mongoose";

const talentedIkonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    numberOfCreativeCasts: {
      type: Number,
      default: 0,
    },
    averageRatings: {
      type: Number,
      default: 0,
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
    quizPoints: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    oldScore: {
      type: Number,
      default: 0,
    },
    diff: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const TalentedIkon = mongoose.model("TalentedIkon", talentedIkonSchema);

export default TalentedIkon;
