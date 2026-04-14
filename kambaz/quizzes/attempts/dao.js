import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizAttemptsDao() {
  async function createAttempt(attemptData) {
    const attempt = { ...attemptData, _id: uuidv4() };
    return model.create(attempt);
  }

  async function findLastAttemptByUserAndQuiz(userId, quizId) {
    return model
      .findOne({ user: userId, quiz: quizId })
      .sort({ attemptNumber: -1 });
  }

  async function countAttemptsByUserAndQuiz(userId, quizId) {
    return model.countDocuments({ user: userId, quiz: quizId });
  }

  return { createAttempt, findLastAttemptByUserAndQuiz, countAttemptsByUserAndQuiz };
}
