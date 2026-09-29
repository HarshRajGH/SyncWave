import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import waveRoutes from './routes/waveRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SyncWave API', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/waves', waveRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/messages', messageRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[API Error]:', err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[SyncWave Server] Running on http://localhost:${PORT}`);
});
