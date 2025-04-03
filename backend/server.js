const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const bodyParser = require('body-parser')
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParser = require("cookie-parser");


// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const listings = require('./routes/listings');
const bookings = require('./routes/bookings');
const locations = require('./routes/locations');
const reviews = require('./routes/reviews');
const uploads = require('./routes/uploads');

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://rooms-on-rent.vercel.app', 'http://localhost:5173', 'http://172.16.91.115:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: process.env.NODE_ENV === 'development'
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/listings', listings);
app.use('/api/bookings', bookings);
app.use('/api/locations', locations);
app.use('/api/reviews', reviews);
app.use('/api/uploads', uploads);

const midd = (req,res,next)=>{
    if (req.query.id==5){
      next();
    }
    else{
      res.send('Not Allowed');
    }
}

app.post('/temp',midd,(req, res)=>{
    // console.log(req.params);
    // console.log(req.params.room);
    console.log(req.query);
    res.send(req.body.email);
    console.log(req.body);
    
    // res.send(`Hello ${parseInt(req.params.room) + parseInt(req.params.id)}`);
})

// Error handler middleware
app.use(errorHandler);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Any route that is not api will be redirected to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 80;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 