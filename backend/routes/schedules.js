const express = require('express');
const router = express.Router();
const { Schedule, Event } = require('../models');

// GET all schedules (with optional event filter)
router.get('/', async (req, res) => {
  try {
    const { eventId, type, startTime, endTime } = req.query;
    const filter = {};

    if (eventId) filter.eventId = eventId;
    if (type) filter.type = type;
    if (startTime || endTime) {
      filter.startTime = {};
      if (startTime) filter.startTime.$gte = new Date(startTime);
      if (endTime) filter.startTime.$lte = new Date(endTime);
    }

    const schedules = await Schedule.find(filter)
      .populate('eventId', 'title startDate endDate')
      .sort({ startTime: 1, order: 1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET schedules by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const schedules = await Schedule.find({ eventId: req.params.eventId })
      .populate('eventId', 'title startDate endDate')
      .sort({ startTime: 1, order: 1 });

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules by event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET single schedule
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('eventId', 'title startDate endDate');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create new schedule
router.post('/', async (req, res) => {
  try {
    const { eventId, title, description, startTime, endTime, location, type, order } = req.body;
    
    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const schedule = new Schedule({
      eventId,
      title,
      description,
      startTime,
      endTime,
      location,
      type,
      order
    });

    const savedSchedule = await schedule.save();
    const populatedSchedule = await Schedule.findById(savedSchedule._id)
      .populate('eventId', 'title startDate endDate');

    res.status(201).json(populatedSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update schedule
router.put('/:id', async (req, res) => {
  try {
    const { title, description, startTime, endTime, location, type, order } = req.body;
    
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { title, description, startTime, endTime, location, type, order },
      { new: true }
    ).populate('eventId', 'title startDate endDate');

    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 