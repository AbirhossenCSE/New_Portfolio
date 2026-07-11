import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "Error: MONGODB_URI is not defined in the environment variables.",
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "PortfolioDB", // explicitly target the PortfolioDB database
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};
