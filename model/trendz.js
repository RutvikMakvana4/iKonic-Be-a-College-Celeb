import mongoose from "mongoose";

const trendzSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    castId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cast",
    },
    totalLikes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Trendz = mongoose.model("Trendz", trendzSchema);

export default Trendz;
