const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  price:          { type: Number, required: true, min: 0 },
  totalSeats:     { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  perks:          { type: String, default: '' },
});

const schema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category:    { type: String, required: true, enum: ['Concert','DJ Night','Fest','Live Performance','Workshop','Open Mic','Acoustic Night'] },
  artist:      { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', default: null },
  venue: {
    name:    { type: String, required: true },
    city:    { type: String, required: true },
    address: { type: String, default: '' },
  },
  date:        { type: Date, required: true },
  time:        { type: String, required: true },
  endTime:     { type: String, default: '' },
  image:       { type: String, default: '' },
  ticketTiers: [tierSchema],
  isFeatured:  { type: Boolean, default: false },
  isFree:      { type: Boolean, default: false },
  ageLimit:    { type: String, default: 'All Ages' },
  dressCode:   { type: String, default: '' },
  tags:        [String],
  status:      { type: String, enum: ['upcoming','ongoing','completed','cancelled'], default: 'upcoming' },
  totalViews:  { type: Number, default: 0 },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('minPrice').get(function () {
  if (!this.ticketTiers?.length) return 0;
  return Math.min(...this.ticketTiers.map(t => t.price));
});
schema.virtual('totalAvailable').get(function () {
  return (this.ticketTiers || []).reduce((s, t) => s + t.availableSeats, 0);
});

module.exports = mongoose.model('Event', schema);
