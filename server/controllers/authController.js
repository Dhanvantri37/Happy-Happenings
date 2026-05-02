const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const sign = id => jwt.sign({ id }, process.env.JWT_SECRET || 'hhm_dev_secret', { expiresIn: '7d' });
const sanitize = u => ({ _id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered.' });
    const user = await User.create({ name, email, password, phone: phone || '' });
    res.status(201).json({ token: sign(user._id), user: sanitize(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email }).select('+password');
    if (!user)   return res.status(401).json({ message: 'No account found with that email.' });
    const ok = await user.comparePassword(password);
    if (!ok)     return res.status(401).json({ message: 'Incorrect password.' });
    res.json({ token: sign(user._id), user: sanitize(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMe = (req, res) => res.json({ user: req.user });

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true });
    res.json({ user: sanitize(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
