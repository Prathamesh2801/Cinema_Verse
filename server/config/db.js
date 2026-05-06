import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log("MongoDB Database Connected Successfully! ");
  } catch (error) {
    console.error(error || "Error Connecting Database.");
    return;
  }
};

export default connectDB;
