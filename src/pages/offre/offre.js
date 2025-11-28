import React from "react";
import { useEtape } from "../../EtatGlobal";
import "./offre.css";

function Offre() {
  const { nextEtape } = useEtape();

  return (
    <div style={{ padding: "0.5% 1%" }}>
      <h3>Bienvenue Mrs Jonathan</h3>
      <p
        style={{
          margin: 0,
          color: "#013a51",
          marginTop: "1%",
          marginBottom: "0.5%",
        }}
      >
        Découvrez le détail de votre création d'entreprise.
      </p>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "#dff2fb",
          padding: "40px 30px",
          borderRadius: "8px",
          margin: 0,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#013a51",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Création d'entreprise +{" "}
            <span style={{ color: "#11abec" }}>comptabilité</span>
          </p>
        </div>
        <hr style={{ height: "0.1px", backgroundColor: "#013a51" }} />
        <p style={{ margin: 0, fontWeight: "bold", color: "#11abec" }}>
          Faites-vous conseiller par un vrai juriste lors d'un rdv dédié
        </p>
        <p style={{ margin: 0, color: "#013a51" }}>
          Nous prenons le temps nécessaire pour choisir avec vous la forme
          juridique, le statut social et les options fiscales les plus
          avantageuses. Une fois votre devis personnalisé validé, nous réalisons
          l'intégralité de vos démarches administratives. Assurance anti-rejet
          incluse.
        </p>
        <p style={{ margin: 0, fontSize: "0.8rem" }}>
          * Honoraires remboursés sous condition d'un abonnement comptable, hors
          frais de greffe et d'annonce légale obligatoires
        </p>
      </div>
      <button onClick={nextEtape} style={{ padding: "1%" }}>
        Démarrer ma création d'entreprise
      </button>
      <br />
    </div>
  );
}

export default Offre;
