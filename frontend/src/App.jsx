import { useState } from 'react';
import NavBar from "../components/Navbar";
import { N } from 'ethers';
import Hero from '../components/Hero';
import MainSection from '../components/MainSection';

function App() {
  return (
    <div>
      <NavBar />
      <Hero />
      <MainSection />
    </div>
  );
}

export default App;
