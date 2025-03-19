import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [role, setRole] = useState(null)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [isLoadingRole, setIsLoadingRole] = useState(true) // Pour éviter l'affichage prématuré de la popup

  // Fonction pour connecter le portefeuille
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setAccount(address)

      console.log('Fetching user role for:', address)
      setIsLoadingRole(true) // On commence à charger le rôle

      // Vérifier si l'utilisateur existe déjà dans la base de données
      const response = await axios.get(
        `http://localhost:3001/api/user/${address}`,
      )

      if (response.data && response.data.role) {
        console.log('User found, role:', response.data.role)
        setRole(response.data.role)
        setIsPopupVisible(false) // Ne pas afficher la popup si le rôle est défini
      } else {
        console.log('No role found, showing popup.')
        setRole('unknown')
        setIsPopupVisible(true) // Afficher la popup si aucun rôle trouvé
      }

      setIsLoadingRole(false) // Fin du chargement
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
      alert('Connection to MetaMask failed')
      setIsLoadingRole(false)
    }
  }

  // Vérifier le rôle au chargement de la page si un compte est connecté
  useEffect(() => {
    if (!isLoadingRole) {
      // On attend que l'API ait répondu avant de décider
      if (role === 'unknown' && account) {
        setIsPopupVisible(true)
      } else {
        setIsPopupVisible(false)
      }
    }
    console.log('📌 Role mis à jour dans le Dashboard:', role)
    console.log('📌 Compte mis à jour dans le Dashboard:', account)
  }, [role, account, isLoadingRole])

  // Fonction pour déconnecter le portefeuille
  const disconnectWallet = () => {
    setAccount(null)
    setRole(null)
    setIsPopupVisible(false)
    alert('Wallet disconnected! To change account, please use MetaMask.')
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        role,
        connectWallet,
        disconnectWallet,
        isPopupVisible,
        setIsPopupVisible,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
