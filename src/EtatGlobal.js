import React, { createContext, useContext, useState } from "react";

const EtapeContext = createContext();

export function EtapeProvider({ children }) {
  const [etape, setEtape] = useState(0);
  // 0 = Offre, 1 = RDV, 2 = Lancement, 3 = Status

  const nextEtape = () => {
    setEtape((prev) => Math.min(prev + 1, 3));
  };

  const prevEtape = () => {
    setEtape((prev) => Math.max(prev - 1, 0));
  };

  return (
    <EtapeContext.Provider value={{ etape, setEtape, nextEtape, prevEtape }}>
      {children}
    </EtapeContext.Provider>
  );
}

export function useEtape() {
  return useContext(EtapeContext);
}
