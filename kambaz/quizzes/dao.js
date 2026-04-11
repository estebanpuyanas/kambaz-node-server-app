import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
  async function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId }).sort({ availableFrom: 1 });
  }

  async function findQuizById(quizId) {
    return model.findById(quizId);
  }

  async function createQuiz(courseId, quiz) {
    const newQuiz = { ...quiz, course: courseId, _id: uuidv4() };
    return model.create(newQuiz);
  }

  async function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
  }

  async function updateQuiz(quizId, quizUpdates) {
    return model.findByIdAndUpdate(quizId, { $set: quizUpdates }, { new: true });
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    deleteQuiz,
    updateQuiz,
  };
}
