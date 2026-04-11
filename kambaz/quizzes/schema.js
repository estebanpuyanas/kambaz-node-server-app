import mongoose from "mongoose";

// Embedded question schema for quizzes (since there are multiple question types).
const questionSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE",
    },
    points: { type: Number, default: 1 },
    questionText: String,
    choices: [{ _id: String, text: String, isCorrect: Boolean }],
    correctAnswer: String,
  },
  { _id: false },
);

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    title: { type: String, default: "New Quiz" },
    description: String,
    points: { type: Number, default: 0 },
    dueDate: String,
    availableFrom: String,
    availableUntil: String,
    published: { type: Boolean, default: false },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimitEnabled: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    questions: [questionSchema],
  },
  { collection: "quizzes" },
);

export default quizSchema;
