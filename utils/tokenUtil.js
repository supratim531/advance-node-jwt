import jwt from "jsonwebtoken";

const generateAccessToken = user => {
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      roles: user.roles
    }
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "2m"
    }
  );

  return accessToken;
}

const generateRefreshToken = user => {
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      roles: user.roles
    }
  };

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "30d"
    }
  );

  return refreshToken;
}

const verifyRefreshToken = refreshToken => {
  let payload;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decodedPayload) => {
    if (err) {
      throw err;
    } else {
      payload = decodedPayload;
    }
  });

  return payload;
}

export {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
};
