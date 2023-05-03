const User = require("../modals/Users");
const asyncWrapper = require("../middleware/asyncWrapper");
const { customErrorFunc } = require("../errors/customError");
const crypto = require("crypto");

//signup
//edit
//delete
//edit password

const addUser = asyncWrapper(async (req, res, next) => {
  const user = await User.create(req.body);

  return user
    ? res.status(201).json({ msg: "Success", data: user })
    : res.status(400).json({ msg: "Error in adding new user" });
});

const editUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  return user
    ? res.status(200).json({ msg: "Success", data: user })
    : res.status(400).json({ msg: "Error in editing your data" });
});

const editUserByAdmin = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.query.userId, req.body, {
    new: true,
  });

  return user
    ? res.status(200).json({ msg: "Success", data: user })
    : res.status(400).json({ msg: "Error in editing users data" });
});

const editPassword = asyncWrapper(async (req, res, next) => {
  const password = crypto
    .createHmac("sha256", process.env.SALT)
    .update(req.body.newPassword)
    .digest("hex");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { password },
    { new: true }
  );

  return user
    ? res.status(202).json({ msg: "Success" })
    : res.status(400).json({ msg: "Error in editing your data" });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { isDeleted: true });

  return user
    ? res.status(202).json({ msg: "Success" })
    : res.status(400).json({ msg: "Error in editing your data" });
});

module.exports = {
  addUser,
  editUser,
  editUserByAdmin,
  editPassword,
  deleteUser,
};
