const jwt = require("jwt");
const User = require("../modals/Users");
const asyncWrapper = require("../middleware/asyncWrapper");
const { customErrorFunc } = require("../errors/customError");
const crypto = require("crypto");

const userVerifyToken = asyncWrapper(async (req, res, next) => {
  const token = req.headers.Authorization;

  if (!token) return next(customErrorFunc(`No token found`, 404));

  const [bearer, jwtToken] = token.split(" ");

  if (bearer != "Bearer")
    return next(
      customErrorFunc(`No token found, Only bearer token are authorized`, 404)
    );

  const data = jwt.verify(jwtToken, process.env.JWT_SALT);

  const user = await User.findById(data.id);

  if (!user) return next(customErrorFunc(`User not verified`, 401));

  req.user = user;
  next();
});

const isAdmin = (req, res, next) => {
  if (req.user.role == "Admin") next();
  else return next(customErrorFunc(`Unauthorized`, 401));
};

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(customErrorFunc(`Email or password incorrect`, 400));

  const newPassword = crypto
    .createHmac("sha256", process.env.SALT)
    .update(password)
    .digest("hex");

  if (newPassword != user.password)
    return next(customErrorFunc(`Email or password incorrect`, 400));

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SALT, {
    expiresIn: "30d",
  });

  return res
    .status(200)
    .json({ msg: "Login Successful", data: { user, token: jwtToken } });
});

const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(customErrorFunc(`No user found`, 400));

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SALT, {
    expiresIn: "30m",
  }); //this will generate a temporary token for the user to use edit password functionality

  return res.status(200).json({ msg: "Verified", data: { token: jwtToken } });
});
//isadmin?
//login
//forgot password

module.exports = { userVerifyToken, isAdmin, login, forgotPassword };
