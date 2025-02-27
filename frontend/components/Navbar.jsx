import React, { useState } from "react";
import { ethers } from "ethers";

const Navbar = () => {
  const [account, setAccount] = useState(null);

  // Fonction pour se connecter à MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Demander la connexion à MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum); 
        // Demande à MetaMask de lister les comptes
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Obtenir le signer et l'adresse du compte connecté
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Connection to MetaMask failed");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null); // Réinitialiser l'état du compte
  };

  return (
    <nav className="flex justify-between items-center p-6 h-28 w-full bg-white">
      <div>
        <p></p>
      </div>
      <div>
    {/* Affiche le bouton de connexion si aucun compte n'est connecté */}
    {!account && (
      <button className="header-btn" onClick={connectWallet}>
        Connect to wallet &gt;
      </button>
    )}

    {/* Affiche l'adresse si un compte est connecté */}
    {account && (
        <button className="header-btn" onClick={disconnectWallet}>{account}</button>
    )}
     </div>
  </nav>
 
  );
};

export default Navbar;
