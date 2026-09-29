import express from 'express';
import { getMessagesByWave, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:waveId', getMessagesByWave);
router.post('/:waveId', protect, sendMessage);

export default router;
