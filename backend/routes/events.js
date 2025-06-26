const express = require('express');
const router = express.Router();
const { Event } = require('../models');

// GET all events
router.get('/', async (req, res) => {
  try {
    const { status, category, search, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    console.log('API GET /events - Filter:', filter);
    const events = await Event.find(filter)
      .sort({ startDate: 1 });
    console.log('API GET /events - Found events:', events);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create new event
router.post('/', async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, category } = req.body;
    
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      category,
    });

    const savedEvent = await event.save();
    const populatedEvent = await Event.findById(savedEvent._id);

    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, category, status } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, startDate, endDate, location, category, status },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 