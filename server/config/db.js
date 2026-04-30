import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/cinemaphile");
    console.log("MongoDB Database Connected Successfully! ");
  } catch (error) {
    console.error(error || "Error Connecting Database.");
    return;
  }
};

export default connectDB;
