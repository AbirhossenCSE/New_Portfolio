import dotenv from "dotenv";
// Load environment variables before any other imports that might depend on them
dotenv.config();

import dns from "dns";
// Force Node.js to use Google's public DNS servers for resolving MongoDB's SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import contactRoutes from "./routes/contact";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import skillRoutes from "./routes/skills";
import experienceRoutes from "./routes/experience";
import profileRoutes from "./routes/profile";
import educationRoutes from "./routes/education";

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers with Helmet
app.use(helmet());

// CORS configuration - only allow the specific frontend URL configured in environment variables
const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  console.warn(
    "Warning: FRONTEND_URL is not defined in the environment variables. CORS is set to restrict all requests.",
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server) or matching frontendUrl
      if (!origin || (frontendUrl && origin === frontendUrl)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json());

// Mount API routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/education", educationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Detailed MongoDB and Env environment health check (not exposing secrets)
app.get("/api/health-check", async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  let dbConnected = false;
  let dbPingError = null;

  if (dbStatus === 1) {
    try {
      await mongoose.connection.db?.admin().ping();
      dbConnected = true;
    } catch (err: any) {
      dbPingError = err.message || String(err);
    }
  }

  const requiredEnv = [
    "MONGODB_URI",
    "JWT_SECRET",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD_HASH",
    "FRONTEND_URL",
  ];
  const missingEnv = requiredEnv.filter((name) => !process.env[name]);

  res.status(dbConnected ? 200 : 500).json({
    status: dbConnected ? "healthy" : "unhealthy",
    database: {
      status: dbStateMap[dbStatus] || "unknown",
      connected: dbConnected,
      pingError: dbPingError,
    },
    environment: {
      vercel: !!process.env.VERCEL,
      missingVariables: missingEnv,
    },
  });
});

// Connect to database and start server (only if not running in Vercel Serverless environment)
if (!process.env.VERCEL) {
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  };

  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

export default app;
