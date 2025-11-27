import React from "react";
import { useEtape } from "../../EtatGlobal";
import "./offre.css";

function Offre() {
  const { nextEtape } = useEtape();

  return (
    <div>
      <h3>Bienvenue Mrs Jonathan</h3>
      <br />
      <p>Découvrez le détail de votre création d'entreprise.</p>
      <button onClick={nextEtape} style={{ padding: "1%" }}>
        Démarrer ma création d'entreprise
      </button>
      <br />
      <br />
    </div>
  );
}

export default Offre;
