const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL || "mongodb://localhost:27017/sdn_event_management";
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected!!");
    } catch (error) {
        console.log("MongoDB Connect error: ", error.message);
        process.exit(1);
    }
}
module.exports = connectDB;
