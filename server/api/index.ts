import app from "../src/index";
import { connectDB } from "../src/config/db";

// Ensure database connection is established and cached in Vercel's serverless runtime
const handler = async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Request Handler Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "An error occurred while routing the request.",
    });
  }
};

export default handler;
