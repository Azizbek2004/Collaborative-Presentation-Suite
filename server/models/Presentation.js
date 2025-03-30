const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
  name: String,
  creator: String,
  slides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slide' }],
  users: [
    {
      nickname: String,
      role: {
        type: String,
        enum: ['creator', 'editor', 'viewer'],
        default: 'viewer',
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Presentation', presentationSchema);
