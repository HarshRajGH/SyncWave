import Message from '../models/Message.js';

export const getMessagesByWave = async (req, res) => {
  try {
    const messages = await Message.find({ waveId: req.params.waveId })
      .sort({ createdAt: 1 })
      .limit(100);

    const formatted = messages.map((m) => ({
      id: m._id.toString(),
      author: m.author,
      text: m.text,
      me: req.user ? m.sender.toString() === req.user._id.toString() : false,
      createdAt: m.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    const message = await Message.create({
      waveId: req.params.waveId,
      sender: req.user._id,
      author: req.user.name,
      text: text.trim(),
    });

    res.status(201).json({
      id: message._id.toString(),
      author: message.author,
      text: message.text,
      me: true,
      createdAt: message.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
