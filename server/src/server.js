import 'dotenv/config.js';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import mongoConnect from './config/db.js';
import rootRouter from './routes/index.js';         // note .js
import User from './models/user.model.js';  

const app = express();
const port = process.env.PORT || 8080;

// Health-check and root endpoint
app.get('/', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/healthcheck', (_req, res) => {
  res.status(200).json({ status: 'ok', time: Date.now() });
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://purdue-348.web.app',
  'https://purdue-348.uc.r.appspot.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up API route
app.use('/api', rootRouter);

// Serve static files from the React build folder
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the 'client/build' directory
  app.use(express.static(path.join(__dirname, '../client/build')));

  // For any route that isn't an API route, send the React index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Connect to MongoDB and sync indexes
mongoConnect().then(async () => {
  try {
    // Synchronize indexes for the User model
    await User.syncIndexes();
    console.log('Indexes synchronized for User model');

    // Start the server
    app.listen(port, () => {
      console.log(`node env: ${process.env.NODE_ENV}`);
      console.log(`server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1); // Exit the process if an error occurs
  }
});
