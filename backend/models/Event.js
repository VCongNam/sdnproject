const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  category: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  strict: false
});

// Index để tối ưu query theo thời gian
// eventSchema.index({ startDate: 1, endDate: 1 });
// eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema); 