import mongoose from "mongoose";

const ikonWinnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: null,
    },
    ikon: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const IkonWinners = mongoose.model("IkonWinners", ikonWinnerSchema);

export default IkonWinners;
