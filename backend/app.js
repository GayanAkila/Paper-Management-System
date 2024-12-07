const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config({ path: './.env' });

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const settingRoutes = require('./routes/settingRoutes');
// Add other route files

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/settings', settingRoutes);
app.use('/api/v1', certificateRoutes);
// Mount other routers

// Error handler
app.use(errorHandler);

module.exports = app;
