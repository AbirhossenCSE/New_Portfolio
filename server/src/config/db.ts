import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const errMsg =
      "Error: MONGODB_URI is not defined in the environment variables.";
    console.error(errMsg);
    if (process.env.VERCEL) {
      throw new Error(errMsg);
    } else {
      process.exit(1);
    }
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "PortfolioDB", // explicitly target the PortfolioDB database
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const errMsg = `Error connecting to MongoDB: ${(error as Error).message}`;
    console.error(errMsg);
    if (process.env.VERCEL) {
      throw new Error(errMsg);
    } else {
      process.exit(1);
    }
  }
};
