const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


// Import routes
const eventRoutes = require('./routes/events');
const scheduleRoutes = require('./routes/schedules');

dotenv.config();

const server = express();
connectDB();
server.use(cors());
server.use(express.json());

// Use routes
server.use('/api/events', eventRoutes);
server.use('/api/schedules', scheduleRoutes);

// Start server
const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});