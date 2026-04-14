import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    answer: mongoose.Schema.Types.Mixed, // string for MC/TF/FIB, string[] for MS
  },
  { _id: false },
);

const resultSchema = new mongoose.Schema(
  {
    questionId: String,
    isCorrect: Boolean,
    pointsEarned: Number,
  },
  { _id: false },
);

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    course: { type: String, ref: "CourseModel" },
    user: { type: String, ref: "UserModel" },
    attemptNumber: { type: Number, default: 1 },
    answers: [answerSchema],
    results: [resultSchema],
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quiz_attempts" },
);

export default quizAttemptSchema;
