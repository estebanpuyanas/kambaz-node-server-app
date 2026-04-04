import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const resolveUserId = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return null;
      }
      userId = currentUser._id;
    }
    return userId;
  };

  const findEnrollmentsForUser = async (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  const enrollUserInCourse = async (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const { courseId } = req.params;
    try {
      const enrollment = await dao.enrollUserInCourse(userId, courseId);
      res.json(enrollment);
    } catch (error) {
      if (error.code === 11000) {
        const existing = await dao.findEnrollmentsForUser(userId);
        const enrollment = existing.find((e) => e.course === courseId);
        res.json(enrollment);
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const { courseId } = req.params;
    await dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(204);
  };

  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.post("/api/users/:userId/enrollments/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/enrollments/:courseId", unenrollUserFromCourse);
}
