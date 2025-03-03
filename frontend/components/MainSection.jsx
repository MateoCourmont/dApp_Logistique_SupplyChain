import { useState, useEffect } from "react"; 
import SenderDashboard from "./SenderDashboard";
import CarrierDashboard from "./CarrierDashboard";

const MainSection = () => {

  const savedRole = localStorage.getItem("role") || 'sender'; // recupérer le role du local storage, sinon sender par défaut
  const [role, setRole] = useState(savedRole);

  // Met à jour le localStorage quand le rôle change
  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  return (
    <div id="_main-section">
        {/* Bouton pour changer de rôle (test) */}
        <button 
        onClick={() => setRole(role === "sender" ? "carrier" : "sender")} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Switch Role
        </button>
      {role === "sender" && <SenderDashboard />}
      {role === "carrier" && <CarrierDashboard />}
    </div>
  );
};

export default MainSection;
