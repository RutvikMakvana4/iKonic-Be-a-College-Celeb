import mongoose from "mongoose";

const trendingCreatorIkonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    numberOfTrendingCasts: {
      type: Number,
      default: 0,
    },
    totalLikes: {
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

const TrendingCreator = mongoose.model(
  "TrendingCreator",
  trendingCreatorIkonSchema
);

export default TrendingCreator;
