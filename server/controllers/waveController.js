import Wave from '../models/Wave.js';
import History from '../models/History.js';

import User from '../models/User.js';

export const getWaves = async (_req, res) => {
  try {
    let waves = await Wave.find({ status: 'active' }).sort({ createdAt: -1 });
    if (waves.length === 0) {
      let seedUser = await User.findOne({ email: 'scholar@syncwave.internal' });
      if (!seedUser) {
        seedUser = await User.create({
          name: 'Rahul Sharma',
          email: 'scholar@syncwave.internal',
          password: 'seedpassword123',
        });
      }
      await Wave.create([
        {
          name: 'DSA Revision',
          subject: 'Data Structures',
          duration: 30,
          max: 6,
          description: 'Arrays and Linked List practice before Monday quiz.',
          goals: [
            { text: 'Arrays', done: true },
            { text: 'Searching', done: true },
            { text: 'Linked List', done: false },
            { text: 'Stack', done: false },
          ],
          host: seedUser._id,
          hostName: 'Rahul Sharma',
          participants: [{ user: seedUser._id, name: 'Rahul Sharma' }],
        },
        {
          name: 'React Practice',
          subject: 'React',
          duration: 45,
          max: 5,
          description: 'Building small components and custom hooks together.',
          goals: [
            { text: 'useState basics', done: false },
            { text: 'Props drilling', done: false },
          ],
          host: seedUser._id,
          hostName: 'Simran Kaur',
          participants: [{ user: seedUser._id, name: 'Simran Kaur' }],
        },
        {
          name: 'Operating Systems & Concurrency',
          subject: 'Operating Systems',
          duration: 60,
          max: 8,
          description: 'Mutex locks, semaphores, deadlock detection, and Peterson algorithm.',
          goals: [
            { text: 'Process Scheduling algorithms', done: true },
            { text: 'Critical section problem', done: false },
            { text: 'Banker algorithm practice', done: false },
          ],
          host: seedUser._id,
          hostName: 'Rohan Mehra',
          participants: [{ user: seedUser._id, name: 'Rohan Mehra' }],
        },
      ]);
      waves = await Wave.find({ status: 'active' }).sort({ createdAt: -1 });
    }
    res.json(waves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWaveById = async (req, res) => {
  try {
    const wave = await Wave.findById(req.params.id);
    if (!wave || wave.status !== 'active') {
      return res.status(404).json({ message: 'Wave not found.' });
    }
    res.json(wave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createWave = async (req, res) => {
  try {
    const { name, subject, duration, max, description, goals } = req.body;
    if (!name || !subject) {
      return res.status(400).json({ message: 'Wave name and subject are required.' });
    }

    const parsedGoals = Array.isArray(goals)
      ? goals.map((g) => (typeof g === 'string' ? { text: g, done: false } : g))
      : [];

    const wave = await Wave.create({
      name: name.trim(),
      subject: subject.trim(),
      duration: Number(duration) || 30,
      max: Number(max) || 5,
      description: description ? description.trim() : '',
      goals: parsedGoals,
      host: req.user._id,
      hostName: req.user.name,
      participants: [{ user: req.user._id, name: req.user.name }],
    });

    res.status(201).json(wave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinWave = async (req, res) => {
  try {
    const wave = await Wave.findById(req.params.id);
    if (!wave || wave.status !== 'active') {
      return res.status(404).json({ message: 'Wave not found.' });
    }

    const isMember = wave.participants.some(
      (p) => (p.user || p._id).toString() === req.user._id.toString()
    );

    if (!isMember) {
      if (wave.participants.length >= wave.max) {
        return res.status(400).json({ message: 'This study wave has reached maximum capacity.' });
      }
      wave.participants.push({ user: req.user._id, name: req.user.name });
      await wave.save();
    }

    res.json(wave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const leaveWave = async (req, res) => {
  try {
    const wave = await Wave.findById(req.params.id);
    if (!wave) {
      return res.status(404).json({ message: 'Wave not found.' });
    }

    wave.participants = wave.participants.filter(
      (p) => (p.user || p._id).toString() !== req.user._id.toString()
    );
    await wave.save();

    res.json(wave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleGoal = async (req, res) => {
  try {
    const { id, goalId } = req.params;
    const wave = await Wave.findById(id);
    if (!wave) {
      return res.status(404).json({ message: 'Wave not found.' });
    }

    const goal = wave.goals.id(goalId) || wave.goals.find((g) => g._id.toString() === goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' });
    }

    goal.done = !goal.done;
    await wave.save();

    res.json(wave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const endWave = async (req, res) => {
  try {
    const wave = await Wave.findById(req.params.id);
    if (!wave) {
      return res.status(404).json({ message: 'Wave not found.' });
    }

    const goalsCompleted = wave.goals.filter((g) => g.done).length;

    const historyEntry = await History.create({
      user: req.user._id,
      waveName: wave.name,
      subject: wave.subject,
      duration: wave.duration,
      goalsCompleted,
      goalsTotal: wave.goals.length,
      participants: wave.participants.length,
      completedAt: new Date(),
    });

    // Mark wave as completed and remove from active list
    wave.status = 'completed';
    await wave.save();

    res.json({
      message: 'Wave completed successfully.',
      history: historyEntry,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
