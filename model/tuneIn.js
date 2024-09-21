import mongoose from "mongoose";

const tuneInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CastMessages",
      default: null,
    },
    customizeMood: {
      type: String,
      default: null,
    },
    viewBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TuneIn = mongoose.model("TuneIn", tuneInSchema);

export default TuneIn;
