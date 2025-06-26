const mongoose = require('mongoose');
const { Event, Schedule } = require('./models'); // Import Event model

async function testConnection() {
  const mongoURI = 'mongodb://localhost:27017/sdn_event_management';
  await mongoose.connect(mongoURI);
  console.log('✅ Connected to MongoDB:', mongoURI);

  // Thêm đoạn này để kiểm tra Event.find() cơ bản
  try {
    const testEvents = await Event.find({});
    console.log('Test Events from Mongoose model:', testEvents);
  } catch (e) {
    console.error('Error fetching test events:', e);
  }

  // Lấy dữ liệu từ collection events (đã có)
  const events = await mongoose.connection.db.collection('events').find({}).toArray();
  console.log('Events (direct collection access):', events);

  // Lấy dữ liệu từ collection schedules (đã có)
  const schedules = await mongoose.connection.db.collection('schedules').find({}).toArray();
  console.log('Schedules (direct collection access):', schedules);

  await mongoose.disconnect();
}

testConnection().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});