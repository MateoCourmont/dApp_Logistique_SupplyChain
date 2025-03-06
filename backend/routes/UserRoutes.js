const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route pour enregistrer un rôle
router.post('/register-role', async (req, res) => {
    
    const { walletAddress, role } = req.body;
  
    try {
      console.log('Received data:', { walletAddress, role }); // Affiche les données reçues
  
      const existingUser = await User.findOne({ walletAddress });
      console.log('Existing user:', existingUser); // Affiche si l'utilisateur existe déjà
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already registered' });
      }
  
      const newUser = new User({ walletAddress, role });
      console.log('Saving new user:', newUser); // Affiche l'utilisateur avant d'enregistrer
      
      await newUser.save(); // Sauvegarde le nouvel utilisateur
  
      return res.status(201).json({ message: 'User role registered successfully' });
    } catch (error) {
      console.error('Error while saving role:', error); // Affiche l'erreur
      return res.status(500).json({ message: 'Server error' });
    }
  });
  

// Route pour récupérer un utilisateur via son wallet
router.get("/user/:walletAddress", async (req, res) => {
    console.log("Fetching user with wallet address:", req.params.walletAddress); // Debug log
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Server error :", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
