import React from 'react';
import NavBar from "../components/Navbar";
import { N } from 'ethers';
import Hero from '../components/Hero';
import MainSection from '../components/MainSection';
import ThemeProvider from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
        <NavBar />
        <Hero />
        <MainSection />
    </ThemeProvider>
  );
}

export default App;
