const QRCode  = require('qrcode');
const Booking = require('../models/Booking');
const Event   = require('../models/Event');

exports.createBooking = async (req, res) => {
  try {
    const { eventId, tickets, totalAmount, paymentId, razorpayOrderId, attendeeName, attendeeEmail, attendeePhone } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    // Deduct seats
    for (const item of tickets) {
      const tier = event.ticketTiers.find(t => t.name === item.tierName);
      if (!tier)                        return res.status(400).json({ message: `Tier "${item.tierName}" not found.` });
      if (tier.availableSeats < item.quantity) return res.status(400).json({ message: `Only ${tier.availableSeats} seats left in "${item.tierName}".` });
      tier.availableSeats -= item.quantity;
    }
    await event.save();

    const isFreeBooking = totalAmount === 0;
    const booking = await Booking.create({
      user: req.user._id, event: eventId, tickets, totalAmount, isFreeBooking,
      paymentId: paymentId || '',
      razorpayOrderId: razorpayOrderId || '',
      paymentStatus: (isFreeBooking || paymentId) ? 'paid' : 'pending',
      attendeeName:  attendeeName  || req.user.name,
      attendeeEmail: attendeeEmail || req.user.email,
      attendeePhone: attendeePhone || req.user.phone || '',
    });

    // QR code
    const qrPayload = JSON.stringify({
      bookingId: booking.bookingId,
      event: event.title,
      date:  event.date,
      venue: event.venue?.name,
      attendee: booking.attendeeName,
      tickets: tickets.map(t => `${t.tierName} ×${t.quantity}`).join(', '),
    });
    booking.qrCode = await QRCode.toDataURL(qrPayload, { errorCorrectionLevel: 'H', margin: 2 });
    await booking.save();
    await booking.populate('event', 'title date venue image');
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date venue image category')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.validateTicket = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId }).populate('event user');
    if (!booking)                          return res.status(404).json({ message: 'Booking not found.' });
    if (booking.isValidated)               return res.status(400).json({ message: '⚠️ Ticket already scanned & used!', booking });
    if (booking.paymentStatus !== 'paid')  return res.status(400).json({ message: 'Payment not completed for this booking.' });
    booking.isValidated = true;
    await booking.save();
    res.json({ message: '✅ Ticket validated! Welcome in.', booking });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking)          return res.status(404).json({ message: 'Booking not found.' });
    if (booking.isValidated) return res.status(400).json({ message: 'Cannot cancel a validated ticket.' });
    booking.paymentStatus = 'refunded';
    await booking.save();
    // Restore seats
    const event = await Event.findById(booking.event);
    if (event) {
      for (const item of booking.tickets) {
        const tier = event.ticketTiers.find(t => t.name === item.tierName);
        if (tier) tier.availableSeats += item.quantity;
      }
      await event.save();
    }
    res.json({ message: 'Booking cancelled successfully.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
