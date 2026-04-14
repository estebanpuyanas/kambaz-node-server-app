import QuizzesDao from "./dao.js";
import QuizAttemptsDao from "./attempts/dao.js";

function gradeSubmission(quiz, answers) {
  const answerMap = {};
  for (const a of answers) {
    answerMap[a.questionId] = a.answer;
  }

  let score = 0;
  const totalPoints = quiz.questions.reduce(
    (sum, q) => sum + (q.points || 0),
    0,
  );
  const results = [];

  for (const q of quiz.questions) {
    const studentAnswer = answerMap[q._id];
    let isCorrect = false;

    switch (q.type) {
      case "MULTIPLE_CHOICE": {
        const correctChoice = q.choices.find((c) => c.isCorrect);
        isCorrect = !!(correctChoice && studentAnswer === correctChoice._id);
        break;
      }
      case "MULTIPLE_SELECT": {
        const correctIds = new Set(
          q.choices.filter((c) => c.isCorrect).map((c) => c._id),
        );
        const studentIds = new Set(
          Array.isArray(studentAnswer) ? studentAnswer : [],
        );
        isCorrect =
          correctIds.size === studentIds.size &&
          [...correctIds].every((id) => studentIds.has(id));
        break;
      }
      case "TRUE_FALSE":
      case "FILL_IN_BLANK":
        isCorrect =
          String(studentAnswer ?? "")
            .toLowerCase()
            .trim() ===
          String(q.correctAnswer ?? "")
            .toLowerCase()
            .trim();
        break;
    }

    const pointsEarned = isCorrect ? q.points || 0 : 0;
    score += pointsEarned;
    results.push({ questionId: q._id, isCorrect, pointsEarned });
  }

  return { score, totalPoints, results };
}

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();
  const attemptsDao = QuizAttemptsDao();

  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    res.json(quiz);
  };

  const createQuizForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await dao.createQuiz(courseId, quiz);
    res.json(newQuiz);
  };

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    await dao.deleteQuiz(quizId);
    res.sendStatus(204);
  };

  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const updated = await dao.updateQuiz(quizId, req.body);
    res.json(updated);
  };

  // Returns { attempt: <last attempt or null>, attemptCount: number }
  const getMyLastAttempt = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);

    const { quizId } = req.params;
    const [attempt, attemptCount] = await Promise.all([
      attemptsDao.findLastAttemptByUserAndQuiz(currentUser._id, quizId),
      attemptsDao.countAttemptsByUserAndQuiz(currentUser._id, quizId),
    ]);

    res.json({ attempt, attemptCount });
  };

  const submitAttempt = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);

    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await dao.findQuizById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });

    const attemptCount = await attemptsDao.countAttemptsByUserAndQuiz(
      currentUser._id,
      quizId,
    );

    if (!quiz.multipleAttempts && attemptCount >= 1) {
      return res
        .status(403)
        .json({ message: "This quiz does not allow multiple attempts." });
    }
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      return res
        .status(403)
        .json({ message: "You have used all your allowed attempts." });
    }

    const { score, totalPoints, results } = gradeSubmission(
      quiz,
      answers || [],
    );

    const attempt = await attemptsDao.createAttempt({
      quiz: quizId,
      course: quiz.course,
      user: currentUser._id,
      attemptNumber: attemptCount + 1,
      answers: answers || [],
      results,
      score,
      totalPoints,
    });

    res.json(attempt);
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.get("/api/quizzes/:quizId/attempts/mine", getMyLastAttempt);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}
