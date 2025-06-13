import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("DB Connection Error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("DB Connection Error:", error.message);
  }
};

export default connectDB;
