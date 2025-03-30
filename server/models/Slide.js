const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  presentation: { type: mongoose.Schema.Types.ObjectId, ref: 'Presentation' },
  textBlocks: [
    {
      content: String,
      x: Number,
      y: Number,
    },
  ],
});

module.exports = mongoose.model('Slide', slideSchema);
