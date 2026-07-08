import dotenv from 'dotenv';
// Load environment variables before any other imports that might depend on them
dotenv.config();

import dns from 'dns';
// Force Node.js to use Google's public DNS servers for resolving MongoDB's SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import contactRoutes from './routes/contact';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import skillRoutes from './routes/skills';
import experienceRoutes from './routes/experience';
import profileRoutes from './routes/profile';
import educationRoutes from './routes/education';

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers with Helmet
app.use(helmet());

// CORS configuration - only allow the specific frontend URL configured in environment variables
const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  console.warn('Warning: FRONTEND_URL is not defined in the environment variables. CORS is set to restrict all requests.');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server) or matching frontendUrl
      if (!origin || origin === frontendUrl) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Body parsing middleware
app.use(express.json());

// Mount API routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to database and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
