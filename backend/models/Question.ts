import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    explanation: String,
    steps: [String],
    codeExample: String,
    diagram: String,
    quiz: {
      question: String,
      options: [String],
      correctIndex: Number,
      explanation: String
    }
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    answer: { type: AnswerSchema, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
