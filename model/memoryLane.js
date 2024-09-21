import mongoose from "mongoose";

const memoryLaneSchema = new mongoose.Schema(
  {
    castId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cast",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    uploadFileName: {
      type: String,
      default: null,
    },
    uploadFiles: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
      default: null,
    },
    tagFriend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tagFriendImage: {
      type: String,
      default: null,
    },
    userPostImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const MemoryLane = mongoose.model("MemoryLane", memoryLaneSchema);

export default MemoryLane;
