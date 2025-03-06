const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserRoutes = require('./routes/UserRoutes');

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connection to MongoDB successful'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Routes
app.use('/api', UserRoutes);

// Lancer le serveur sur le port 3001
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
