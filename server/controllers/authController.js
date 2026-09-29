import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Password must be at least 8 characters and contain uppercase, lowercase, digit, and symbol
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'syncwave_secure_jwt_secret_dev_2026', {
    expiresIn: '30d',
  });
};

const decodeGoogleCredential = (credential) => {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. !@#$%^&*).',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        message: 'No account found with this email. Please register first.',
      });
    }

    if (!user.password && user.googleId) {
      return res.status(400).json({
        message: 'This account was created with Google. Please use Google Sign-In to log in.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please check your credentials.' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential, email: directEmail, name: directName, googleId: directId, avatar } = req.body;

    let email = directEmail;
    let name = directName;
    let googleId = directId;
    let picture = avatar || '';

    if (credential) {
      const payload = decodeGoogleCredential(credential);
      if (!payload || !payload.email) {
        return res.status(400).json({ message: 'Invalid Google credential token.' });
      }
      email = payload.email;
      name = payload.name || payload.email.split('@')[0];
      googleId = payload.sub;
      picture = payload.picture || '';
    }

    if (!email) {
      return res.status(400).json({ message: 'Google authentication failed: Email not found.' });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      if (!user.googleId && googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      user = await User.create({
        name: name ? name.trim() : email.split('@')[0],
        email: email.toLowerCase().trim(),
        googleId: googleId || `google-${Date.now()}`,
        avatar: picture,
      });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: { id: req.user._id.toString(), name: req.user.name, email: req.user.email },
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already taken by another account.' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) user.name = name.trim();
    await user.save();

    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
