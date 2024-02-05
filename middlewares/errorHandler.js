import {
  BAD_REQUEST,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR
} from "../constants.js";

const handleError = (err, req, res, next) => {
  console.log("\nerrorHandler.js:", err);

  switch (err.name) {
    case "TokenExpiredError":
      res.status(UNAUTHORIZED.code).json({
        error: true,
        status: UNAUTHORIZED.code,
        title: UNAUTHORIZED.title,
        message: err.message,
        expiredAt: err?.expiredAt
      });
      break;
    case "JsonWebTokenError":
      res.status(BAD_REQUEST.code).json({
        error: true,
        status: BAD_REQUEST.code,
        title: BAD_REQUEST.title,
        message: err.message
      });
      break;
    case "MongoServerError":
      let duplicateKey = undefined;

      for (let key in err?.keyPattern) {
        duplicateKey = key;
      }

      const duplicateKeyValue = err?.keyValue?.[`${duplicateKey}`];

      if (duplicateKey && duplicateKeyValue) {
        res.status(BAD_REQUEST.code).json({
          error: true,
          status: BAD_REQUEST.code,
          title: BAD_REQUEST.title,
          message: `${duplicateKey} ${duplicateKeyValue} already exists`
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR.code).json({
          status: INTERNAL_SERVER_ERROR.code,
          title: INTERNAL_SERVER_ERROR.title,
          message: err.message
        });
      }
      break;
    case "Error":
      let statusCode = res.statusCode;
      let statusMessage = res.statusMessage;

      if (!statusMessage) {
        statusCode = INTERNAL_SERVER_ERROR.code;
        statusMessage = INTERNAL_SERVER_ERROR.title;
      }

      res.status(statusCode).json({
        error: true,
        status: statusCode,
        title: statusMessage,
        message: err.message
      });
      break;

    default:
      res.status(INTERNAL_SERVER_ERROR.code).json({
        error: true,
        status: INTERNAL_SERVER_ERROR.code,
        title: INTERNAL_SERVER_ERROR.title,
        message: err.message
      });
      break;
  }
}

export default handleError;
