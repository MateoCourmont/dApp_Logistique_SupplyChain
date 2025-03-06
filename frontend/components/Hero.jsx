import React, { useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext'; 

const Hero = () => {
  // Accéder au contexte du thème
  const { theme } = useContext(ThemeContext);

  const handleStartClick = () => {
    // Défilement vers _main-section
    document.getElementById('_main-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="_hero" >
      <div className="hero-left">
        <h1 className={`hero-title ${theme === 'dark' ? 'hero-title-dark' : 'hero-title-light'}`}>
          MANAGE YOUR SUPPLY CHAIN LIKE NEVER
        </h1>
        <p className={`hero-description ${theme === 'dark' ? 'hero-description-dark' : 'hero-description-light'}`}>
          The blockchain-based logistics platform which helps you with the supply chain.
        </p>
        <button id="start-btn" className={`btn ${theme === 'dark' ? 'btn-dark' : 'btn'}`} onClick={handleStartClick}>
          Start working now!
        </button>
      </div>

      <div className="hero-right">
        <img
          src="./src/assets/images/portrait-hero.jpg"
          alt="Hero Image"
          className="hero-img"
        />
      </div>
    </section>
  );
};



export default Hero;
