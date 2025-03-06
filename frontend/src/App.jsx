import React from 'react';
import NavBar from "../components/Navbar";
import Hero from '../components/Hero';
import ThemeProvider from './ThemeContext';
import {RoleProvider, useRole } from "./RoleContext"; // Assure-toi d'importer depuis le bon fichier
import RoleSelection from "./RoleSelection"; // Importation de RoleSelection sans "default"
import SenderDashboard from "../components/SenderDashboard";
import CarrierDashboard from "../components/CarrierDashboard";
import { WalletProvider } from './WalletContext';

const AppContent = () => {
  const { role } = useRole(); 

  if (role === "unknown") {
    return <RoleSelection />; 
  }

  return role === "sender" ? <SenderDashboard /> : <CarrierDashboard />;
};

function App() {
  return (
    <RoleProvider>  
      <WalletProvider>  
        <ThemeProvider>
          <NavBar />
          <Hero />
          <div id="_main-section">
            <AppContent /> 
          </div>
        </ThemeProvider>
      </WalletProvider>
    </RoleProvider>
  );
}

export default App;
