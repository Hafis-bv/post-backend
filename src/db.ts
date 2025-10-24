import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL!);
    console.log("MongoDB connected");
  } catch (e) {
    console.log("Mongodb connection error:", e);
    process.exit(1);
  }
}
