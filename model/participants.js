import mongoose from "mongoose";

const participantsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    collegeId: {
      type: Number,
      default: null,
    },
    seasonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seasons",
      },
    images: [
      {
        type: String,
        default: null,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Participants = mongoose.model("participants", participantsSchema);

export default Participants;
