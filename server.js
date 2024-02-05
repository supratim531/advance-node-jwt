import cors from "cors";
import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import connectDb from "./config/dbConnection.js";
import handleError from "./middlewares/errorHandler.js";

config();
connectDb();

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/user", authRoute);
app.use(handleError);

app.get("/test-cookie", (req, res) => {
  return res.status(200).cookie("user-access-token", "accessToken", {
    sameSite: "strict",
    expires: new Date(new Date().getTime() + 10 * 1000),
    httpOnly: true
  }).json({
    error: false,
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    message: "Successfully logged in"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
