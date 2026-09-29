import express from 'express';
import {
  getWaves,
  getWaveById,
  createWave,
  joinWave,
  leaveWave,
  toggleGoal,
  endWave,
} from '../controllers/waveController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getWaves);
router.get('/:id', getWaveById);
router.post('/', protect, createWave);
router.post('/:id/join', protect, joinWave);
router.post('/:id/leave', protect, leaveWave);
router.patch('/:id/goals/:goalId', protect, toggleGoal);
router.post('/:id/end', protect, endWave);

export default router;
