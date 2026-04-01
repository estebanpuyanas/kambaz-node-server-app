import model from "./model.js";

export default function UsersDao() {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const findAllUsers = () => model.find();

  const findUserById = (userId) => model.findById(userId);

  const findUserByUsername = (username) => model.findOne({ username });

  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });

  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findUsersByRole = (role) => model.find({ role });

  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
    findUsersByRole,
    findUsersByPartialName,
  };
}
