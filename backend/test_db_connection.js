const mongoose = require('mongoose');

async function testConnection() {
  const mongoURI = 'mongodb://localhost:27017/sdn_event_management';
  await mongoose.connect(mongoURI);
  console.log('✅ Connected to MongoDB:', mongoURI);

  // Lấy dữ liệu từ collection events
  const events = await mongoose.connection.db.collection('events').find({}).toArray();
  console.log('Events:', events);

  // Lấy dữ liệu từ collection schedules
  const schedules = await mongoose.connection.db.collection('schedules').find({}).toArray();
  console.log('Schedules:', schedules);

  await mongoose.disconnect();
}

testConnection().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
}); 