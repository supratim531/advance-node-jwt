import bcrypt from "bcrypt";
import User from "../models/User.js";
import expressAsyncHandler from "express-async-handler";
import {
  BAD_REQUEST
} from "../constants.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/tokenUtil.js";
import {
  validateLoginBody,
  validateRegisterBody,
  validateRefreshTokenBody
} from "../utils/schemaValidation.js";

//@desc User login
//@route POST /api/v1/user/login
const login = expressAsyncHandler(async (req, res) => {
  const validationError = validateLoginBody(req.body);

  if (validationError.error) {
    res.status(BAD_REQUEST.code);
    res.statusMessage = BAD_REQUEST.title;
    throw new Error(validationError.error.details[0].message);
  }

  const user = await User.findOne({ username: req.body.username });

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Login successful"
    });
  } else {
    res.status(BAD_REQUEST.code);
    res.statusMessage = BAD_REQUEST.title;
    throw new Error("Wrong username or password");
  }
});

//@desc New user registration
//@route POST /api/v1/user/register
const register = expressAsyncHandler(async (req, res) => {
  const validationError = validateRegisterBody(req.body);

  if (validationError.error) {
    console.log("registerBodyValidation error:", validationError.error);
    res.status(BAD_REQUEST.code);
    res.statusMessage = BAD_REQUEST.title;
    throw new Error(validationError.error.details[0].message);
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  await new User({ ...req.body, password: hashedPassword }).save();

  return res.status(201).json({
    error: false,
    message: `Account created successfully for ${req.body.username}`
  });
});

//@desc Get current user via access-token
//@route GET /api/v1/user/current
const getCurrentUser = expressAsyncHandler(async (req, res) => {
  return res.status(200).json({
    error: false,
    user: req.user
  });
});

//@desc Get new access-token
//@route POST /api/v1/user/token
const getNewAccessToken = expressAsyncHandler(async (req, res) => {
  const validationError = validateRefreshTokenBody(req.body);

  if (validationError.error) {
    console.log("refreshTokenBodyValidation error:", validationError.error);
    res.status(BAD_REQUEST.code);
    res.statusMessage = BAD_REQUEST.title;
    throw new Error(validationError.error.details[0].message);
  }

  const payload = verifyRefreshToken(req.body.refreshToken);
  const accessToken = generateAccessToken(payload.user);

  return res.status(201).json({
    error: false,
    accessToken,
    message: "New access token created successfully"
  });
});

const test = expressAsyncHandler(async (req, res) => {
  return res.status(200).json({
    error: false,
    books: [
      {
        bookId: "1",
        bookName: "RS Agarwaal",
        bookPrice: 350
      },
      {
        bookId: "2",
        bookName: "Let Us C",
        bookPrice: 1200
      }
    ]
  });
});

export {
  test,
  login,
  register,
  getCurrentUser,
  getNewAccessToken
};
