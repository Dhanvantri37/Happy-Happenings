const User    = require('../models/User');
const Event   = require('../models/Event');
const Booking = require('../models/Booking');
const Artist  = require('../models/Artist');

exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalArtists, paidBookings, totalBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Event.countDocuments(),
      Artist.countDocuments(),
      Booking.find({ paymentStatus: 'paid' }),
      Booking.countDocuments(),
    ]);
    const totalRevenue     = paidBookings.reduce((s, b) => s + b.totalAmount, 0);
    const totalTicketsSold = paidBookings.reduce((s, b) => s + b.tickets.reduce((ss, t) => ss + t.quantity, 0), 0);

    const revenueByEvent = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$event', revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'event' } },
      { $unwind: '$event' },
      { $project: { title: '$event.title', revenue: 1, count: 1 } },
      { $sort: { revenue: -1 } }, { $limit: 6 },
    ]);

    const sixAgo = new Date(); sixAgo.setMonth(sixAgo.getMonth() - 6);
    const monthlyData = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixAgo }, paymentStatus: 'paid' } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]);

    const categoryBreakdown = await Event.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);

    res.json({ totalUsers, totalEvents, totalArtists, totalRevenue, totalTicketsSold, totalBookings, revenueByEvent, monthlyData, categoryBreakdown });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUsers = async (req, res) => {
  try { res.json(await User.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
