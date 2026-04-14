import mongoose from "mongoose";

// Embedded question schema for quizzes (since there are multiple question types).
const questionSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    type: {
      type: String,
      enum: [
        "MULTIPLE_CHOICE",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
        "FILL_IN_BLANK",
      ],
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
    quizType: {
      type: String,
      enum: [
        "GRADED_QUIZ",
        "PRACTICE_QUIZ",
        "GRADED_SURVEY",
        "UNGRADED_SURVEY",
      ],
      default: "GRADED_QUIZ",
    },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "ESSAYS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimitEnabled: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: Boolean, default: true },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: false },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    questions: [questionSchema],
  },
  { collection: "quizzes" },
);

export default quizSchema;
