const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  genre: { type: String, required: true, enum: ['Electronic','Hip-Hop','Rock','Pop','Jazz','Classical','Indie','Metal','R&B','Folk','Bollywood','Other'] },
  bio:   { type: String, default: '', maxlength: 1000 },
  image: { type: String, default: '' },
  socialLinks: {
    instagram: { type: String, default: '' },
    spotify:   { type: String, default: '' },
    youtube:   { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Artist', schema);
