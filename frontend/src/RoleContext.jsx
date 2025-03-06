import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useWallet } from './WalletContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const walletContext = useWallet(); 
  const [role, setRole] = useState('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletContext || !walletContext.account) {
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/${walletContext.account}`);
        if (response.data && response.data.role) {
          setRole(response.data.role);
        }
      } catch (error) {
        console.error("Error fetching role from the backend", error);
        setRole('unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [walletContext?.account]);

  return (
    <RoleContext.Provider value={{ role, setRole, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export const resetRole = (setRole) => {
  setRole('unknown');  // Réinitialiser le rôle à 'unknown'
  localStorage.removeItem('role');  
};
