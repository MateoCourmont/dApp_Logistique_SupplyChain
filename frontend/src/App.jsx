import { useState } from 'react';
import NavBar from "../components/Navbar";
import { N } from 'ethers';
import Hero from '../components/Hero';

function App() {
  return (
    <div>
      <NavBar />
      <Hero />
    </div>
  );
}

export default App;
