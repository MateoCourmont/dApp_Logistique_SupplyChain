import React, { useState, useContext } from "react";
import { useWallet } from "./WalletContext";  
import { useRole } from "./RoleContext";  
import { ThemeContext } from "../src/ThemeContext";  
import axios from "axios";

const RoleSelection = () => {
  const { account } = useWallet();  
  const { role, setRole } = useRole();  
  const { theme } = useContext(ThemeContext); 
  const [selectedRole, setSelectedRole] = useState(null);  
  const { isPopupVisible, setIsPopupVisible } = useWallet(); 

  // Fonction pour enregistrer le rôle en base
  const saveRoleInDatabase = async () => {
    if (selectedRole && account) {
      try {
        await axios.post("http://localhost:3001/api/register-role", { walletAddress: account, role: selectedRole });
        setRole(selectedRole);  
        setIsPopupVisible(false);  
        alert("Role successfully saved!");
      } catch (error) {
        console.error("Error while saving role:", error);
        alert("Error while saving role.");
      }
    } else {
      alert("Please choose a role.");
    }
  };

  return (
    isPopupVisible && role === 'unknown' && (  
      <div className={`overlay ${theme === 'dark' ? 'overlay-dark' : 'overlay-light'}`}>
        <div className={`role-popup ${theme === 'dark' ? 'role-popup-dark' : 'role-popup-light'}`}>
          <h2>Who are you?</h2>
          <button onClick={() => setSelectedRole("sender")} className={`btn ${theme === 'dark' ? 'btn-dark' : 'btn'}`}>
            Sender
          </button>
          <button onClick={() => setSelectedRole("carrier")} className={`btn ${theme === 'dark' ? 'btn-dark' : 'btn'}`}>
            Carrier
          </button>

          {selectedRole && (
            <div>
              <p>You chose: <span className="selected-role">{selectedRole}</span></p>
              <button onClick={saveRoleInDatabase} className={`btn ${theme === 'dark' ? 'btn-dark' : 'btn'}`}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default RoleSelection;
