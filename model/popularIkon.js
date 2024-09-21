import mongoose from "mongoose";

const popularIkonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    numberOfFollowers: {
      type: Number,
      default: 0,
    },
    numberOfShoutOuts: {
      type: Number,
      default: 0,
    },
    numberOfThankyou: {
      type: Number,
      default: 0,
    },
    numberOfSecretAdmirers: {
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

const PopularIkon = mongoose.model("PopularIkon", popularIkonSchema);

export default PopularIkon;
