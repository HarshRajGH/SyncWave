import History from '../models/History.js';

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id }).sort({ completedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    await History.deleteMany({ user: req.user._id });
    res.json({ message: 'Study history cleared successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
