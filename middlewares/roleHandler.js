import expressAsyncHandler from "express-async-handler";
import {
  FORBIDDEN
} from "../constants.js";

const checkRoles = roles => {
  return expressAsyncHandler(async (req, res, next) => {
    if (req.user.roles.includes(...roles)) {
      next();
    } else {
      res.status(FORBIDDEN.code);
      res.statusMessage = FORBIDDEN.title;
      throw new Error("You are not allowed to use this resource");
    }
  });
}

export {
  checkRoles
};
