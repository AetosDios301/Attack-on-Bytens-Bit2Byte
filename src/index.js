const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Define Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const measurementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chest: Number,
  neckCircumference: Number,
  armCircumference: Number,
  waist: Number,
  shoulder: Number,
  frontLength: Number,
  waistToAnkleLength: Number,
  hipCircumference: Number,
  createdAt: { type: Date, default: Date.now }
});


const User = mongoose.model('User', userSchema);
const Measurement = mongoose.model('Measurement', measurementSchema);


app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await User.create({ 
      name: name, 
      email: email, 
      password: hashedPassword
   })

    res.status(201).json({ message: 'User registered successfully', user: user })
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
    console.error(error);  
  }
});


app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'Sign-in successful' });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error: error.message });
    console.error(error);  
  }
});


app.post('/measurements', async (req, res) => {
  const { userId, chest, neckCircumference, armCircumference, waist, shoulder, frontLength, waistToAnkleLength, hipCircumference } = req.body;

  try {
    const measurement = new Measurement({
      userId,
      chest,
      neckCircumference,
      armCircumference,
      waist,
      shoulder,
      frontLength,
      waistToAnkleLength,
      hipCircumference
    });

    await measurement.save();
    res.status(201).json({ message: 'Measurements saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving measurements', error: error.message });
    console.error(error);  
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to the API');
});






app.post('/gps-location', (req, res) => {
  const { latitude, longitude } = req.body;

  
  console.log('Received GPS coordinates:', latitude, longitude);

  
  const newLocation = new Location({
    latitude: latitude,
    longitude: longitude,
    timestamp: new Date()
  });

  newLocation.save((err) => {
    if (err) {
      res.status(500).send('Error saving location');
    } else {
      res.status(200).send('Location saved successfully');
    }
  });
});

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: Date
});

const Location = mongoose.model('Location', locationSchema);





app.listen(3001, () => {
  console.log('Server is running on port 3001');
});





