import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    castDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cast",
      default: null,
    },
    type: {
      type: Number, // 1 - text |  2 - cast
      default: 1,
    },
    roomId: {
      type: String,
      required: false,
      default: null,
    },
    seenAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
