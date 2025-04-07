const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const http = require('http');
const { wss } = require('./websocket');
const { initSocket } = require('./socket');
require('dotenv').config();

// Debugging Twilio credentials
console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("Twilio Auth Token:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Not Loaded");

const twilio = require('twilio');

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error("❌ Twilio credentials are missing! Check your .env file.");
  process.exit(1); // Stop execution if Twilio credentials are missing
}

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Express app
const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL,
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
authRoutes(app);
profileRoutes(app);
symptomRoutes(app);
appointmentRoutes(app);
notificationRoutes(app);
doctorRoutes(app);
chatRoutes(app);
adminRoutes(app);
activityLogRoutes(app);
analyticsRoutes(app);
feedbackRoutes(app);

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.info('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ Database error:', err);
  });

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(PORT, () => {
  console.info(`🚀 Server running on port ${PORT}`);
});

