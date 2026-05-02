const Event  = require('../models/Event');
const Review = require('../models/Review');

exports.getEvents = async (req, res) => {
  try {
    const { category, search, isFree, city, featured, status } = req.query;
    const filter = { status: status || 'upcoming' };
    if (category && category !== 'All') filter.category = category;
    if (isFree === 'true') filter.isFree = true;
    if (city)    filter['venue.city'] = { $regex: city, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;
    if (search)  filter.$or = [
      { title:         { $regex: search, $options: 'i' } },
      { 'venue.city':  { $regex: search, $options: 'i' } },
      { tags:          { $in: [new RegExp(search, 'i')] } },
    ];
    const events = await Event.find(filter).populate('artist', 'name genre image').sort({ date: 1 });
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, { $inc: { totalViews: 1 } }, { new: true }
    ).populate('artist');
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    const reviews  = await Review.find({ event: event._id }).populate('user', 'name').sort({ createdAt: -1 }).limit(20);
    const avgRating = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;
    res.json({ ...event.toJSON(), reviews, avgRating });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('artist');
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(event);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ event: req.params.id, user: req.user._id });
    if (existing) { existing.rating = rating; existing.comment = comment; await existing.save(); return res.json(existing); }
    const review = await Review.create({ event: req.params.id, user: req.user._id, rating, comment });
    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
