const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['session', 'break', 'workshop', 'presentation', 'other'],
    default: 'session'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  strict: false
});

// Index để tối ưu query
// scheduleSchema.index({ eventId: 1, startTime: 1 });
// scheduleSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema); 