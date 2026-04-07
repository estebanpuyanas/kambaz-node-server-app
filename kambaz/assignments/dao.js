import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {
  async function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  }

  async function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    return model.findByIdAndUpdate(assignmentId, { $set: assignmentUpdates }, { new: true });
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
