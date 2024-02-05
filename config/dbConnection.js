import mongoose from "mongoose";

const connectDb = () => {
  mongoose.connect(process.env.DB_URI);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connection disconnected");
  });

  mongoose.connection.on("error", err => {
    console.log("Error while connecting to database:", err);
    process.exit(1);
  });
}

export default connectDb;
