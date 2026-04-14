import mongoose from "mongoose";
import quizAttemptSchema from "./schema.js";

export default mongoose.model("QuizAttemptModel", quizAttemptSchema);
