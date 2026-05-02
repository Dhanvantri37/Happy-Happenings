const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const schema = new mongoose.Schema({
  bookingId:       { type: String, unique: true, default: () => `HHM-${uuid().split('-')[0].toUpperCase()}` },
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event:           { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  tickets: [{
    tierName:       String,
    quantity:       Number,
    pricePerTicket: Number,
  }],
  totalAmount:     { type: Number, required: true },
  isFreeBooking:   { type: Boolean, default: false },
  paymentStatus:   { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  paymentId:       { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  qrCode:          { type: String, default: '' },
  isValidated:     { type: Boolean, default: false },
  attendeeName:    { type: String, default: '' },
  attendeeEmail:   { type: String, default: '' },
  attendeePhone:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', schema);
