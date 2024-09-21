import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: null,
    },
    question: {
      type: String,
      default: null,
    },
    options: [
      {
        option: String,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
