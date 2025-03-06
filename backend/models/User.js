const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true, // 
    },
    role: {
      type: String,
      enum: ['sender', 'carrier', 'unknown'], 
      default: 'unknown', 
    },
  },
  {
    timestamps: true, 
  }
);

// Création du modèle User à partir du schema
const User = mongoose.model('User', userSchema, 'addresses_role');

module.exports = User;
