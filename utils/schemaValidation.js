import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const validateRegisterBody = registerBody => {
  const schema = Joi.object({
    username: Joi.string().min(2).required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password")
  });

  return schema.validate(registerBody);
}

const validateLoginBody = loginBody => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password")
  });

  return schema.validate(loginBody);
}

const validateRefreshTokenBody = refreshTokenBody => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh token")
  });

  return schema.validate(refreshTokenBody);
}

export {
  validateLoginBody,
  validateRegisterBody,
  validateRefreshTokenBody
};
