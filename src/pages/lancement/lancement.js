import React from "react";
import { useEtape } from "../../EtatGlobal";

function Lancement() {
  const { nextEtape } = useEtape();
  return (
    <div>
      <h1>Lancement Page</h1>
      <p>This is the lancement page content.</p>
      <button onClick={nextEtape}>Suivant</button>
    </div>
  );
}

export default Lancement;
