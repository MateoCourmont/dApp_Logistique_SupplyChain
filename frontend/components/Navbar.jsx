import React, { useContext, useEffect } from "react";
import { ThemeContext } from '../src/ThemeContext';
import { useWallet } from '../src/WalletContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const { account, connectWallet, disconnectWallet } = useWallet();

  useEffect(() => {
    if (account) {
      console.log("Wallet connected:", account);
    } else {
      console.log("Wallet disconnected");
    }
  }, [account]);

  return (
    <header>
      <nav>
        <div>
          <p className={`logo ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}>Xchain</p>
        </div>
        <div className="left-nav flex justify-end items-center ">
          <div className="theme-toggle">
            {/* Toggle bouton pour le mode sombre et clair */}
            <button onClick={toggleTheme}>
              {theme === 'dark' ? (
                <img src="./src/assets/images/sun.png" alt="Switch to light mode" id="sun_icon"/>
              ) : (
                <img src="./src/assets/images/moon.png" alt="Switch to dark mode" id="moon_icon"/>
              )}
            </button>
          </div>
          <div className="wallet_button">
            {!account && (
              <button onClick={connectWallet}>
                <img id="metamask_connect" src="./src/assets/images/MetaMask_Fox.png" alt="metamask connect" />
              </button>
            )}

            {account && (
              <button onClick={disconnectWallet}>
                <img id="metamask_disconnect" src="./src/assets/images/MetaMask_disconnect.png" alt="metamask disconnect" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
