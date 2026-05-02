const User = require('../models/User');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: 'wishlist', populate: { path: 'artist', select: 'name genre' } });
    res.json(user.wishlist || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { eventId } = req.body;
    const user = await User.findById(req.user._id);
    const idx  = user.wishlist.findIndex(id => id.toString() === eventId);
    if (idx === -1) user.wishlist.push(eventId);
    else            user.wishlist.splice(idx, 1);
    await user.save();
    res.json({ wishlisted: idx === -1, count: user.wishlist.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
