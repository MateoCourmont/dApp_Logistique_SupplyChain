import React, { useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext'; 

const Hero = () => {
  // Accéder au contexte du thème
  const { theme } = useContext(ThemeContext);

  return (
    <section id="_hero" >
      <div className="hero-left">
        <h1 className={`hero-title ${theme === 'dark' ? 'hero-title-dark' : 'hero-title-light'}`}>
          MANAGE YOUR SUPPLY CHAIN LIKE NEVER
        </h1>
        <p className={`hero-description ${theme === 'dark' ? 'hero-description-dark' : 'hero-description-light'}`}>
          The blockchain-based logistics platform which follows steps in the supply chain.
        </p>
        <button className={`btn ${theme === 'dark' ? 'btn-dark' : 'btn'}`}>
          Start to work now!
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
