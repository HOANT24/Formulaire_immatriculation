import React, { useState } from "react";
import { useEtape } from "../../EtatGlobal";
import "./offre.css";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { PiPersonSimpleRunThin } from "react-icons/pi";

function Offre() {
  const { nextEtape } = useEtape();

  // Valeur sélectionnée : "basique" ou "complet"
  const [choix, setChoix] = useState("basique");

  // formData simple

  // Fonction appelée quand on clique sur un container
  const handleSelect = (value) => {
    setChoix(value);
    console.log("FormData :", { offre: value });
  };

  return (
    <div style={{ padding: "0.5% 1%" }}>
      <h3
        style={{
          color: "#013a51",
        }}
      >
        Bienvenue
      </h3>
      <p
        style={{
          margin: 0,
          color: "#555",
          marginTop: "0.5%",
          marginBottom: "0.2%",
        }}
      >
        Découvrez le détail de votre création d'entreprise.
      </p>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#dff2fb",
          padding: "20px 30px",
          borderRadius: "8px",
          border: "1px solid #11abec",
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
              marginBottom: "10px",
              marginTop: "5px",
            }}
          >
            Création d'entreprise
          </p>
        </div>
        <hr style={{ height: "0.1px", backgroundColor: "#013a51" }} />
        <p
          style={{
            margin: 0,
            fontWeight: "bold",
            color: "#11abec",
            marginTop: "15px",
          }}
        >
          Faites-vous conseiller par un vrai juriste lors d'un rdv dédié
        </p>
        <p
          style={{
            margin: 0,
            color: "#555",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          Nous prenons le temps nécessaire pour choisir avec vous la forme
          juridique, le statut social et les options fiscales les plus
          avantageuses. Une fois votre devis personnalisé validé, nous réalisons
          l'intégralité de vos démarches administratives.
        </p>
      </div>
      <br />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f8f8f8",
            padding: "20px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Détails de votre paiement
        </div>
        <hr style={{ height: "0.1px", backgroundColor: "#013a51" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "50px",
            marginBottom: "10px",
            gap: "10%",
          }}
        >
          {/* BASIQUE */}
          <div
            className={`containerChoix ${choix === "basique" ? "active" : ""}`}
            onClick={() => handleSelect("basique")}
          >
            <h2>BASIQUE</h2>
            <h1>99 € HT</h1>

            <h4>
              Création Micro / <br />
              Entreprise individuelle / LMNP
            </h4>
            <div style={{ height: "100%" }}>
              <p> ✓ Aide au choix de la forme sociale</p>
              <p> ✓ Aide au choix des régimes fiscaux et sociaux </p>
              <p> ✓ Formalités administratives </p>
            </div>

            <br />
            <div className="boutonChoix">
              {choix === "basique" ? "Appliquer" : "Sélectionner"}
            </div>
          </div>

          {/* COMPLET */}
          <div
            className={`containerChoix ${choix === "complet" ? "active" : ""}`}
            onClick={() => handleSelect("complet")}
          >
            <h2>COMPLET</h2>
            <h1>880 € HT</h1>

            <h4 style={{ marginTop: "4%", marginBottom: "8%" }}>
              Création de société{" "}
            </h4>
            <div style={{ height: "100%" }}>
              <p> ✓ Aide au choix de la forme sociale </p>
              <p> ✓ Aide au choix des régimes fiscaux et sociaux</p>
              <p> ✓ Rédaction des statuts </p>
              <p> ✓ Dépôt du capital social avec Qonto</p>
              <p> ✓ Création 100% en ligne </p>
              <p> ✓ Signature électronique </p>
              <p> ✓ Formalités administratives </p>
            </div>

            <br />
            <div className="boutonChoix">
              {choix === "complet" ? "Appliquer" : "Sélectionner"}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "30px",
            color: "#555",
            marginLeft: "3%",
          }}
        >
          <div
            style={{
              borderLeft: "3px solid #11abec",
              paddingLeft: "10px",
              paddingBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2%",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <p style={{ fontSize: "3rem" }}>○</p>
              <p style={{ marginTop: "0.5%" }}>Avant le rendez-vous</p>
            </div>
            <p style={{ fontSize: "0.9rem", marginLeft: "3%" }}>
              {" "}
              ● &nbsp; Acompte RDV juridique
            </p>
          </div>
          <div
            style={{
              borderLeft: "3px solid #11abec",
              paddingLeft: "10px",
              marginTop: "30px",
              paddingBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2%",
                alignItems: "center",
                fontWeight: "bold",
                marginTop: "20px",
              }}
            >
              <p style={{ fontSize: "3rem" }}>○</p>
              <p style={{ marginTop: "0.5%" }}>Après le rendez-vous</p>
            </div>
            <p style={{ fontSize: "0.9rem", marginLeft: "3%" }}>
              {" "}
              ● &nbsp; Acompte d'honoraires de création (conseils et rédaction
              des statuts)
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                marginLeft: "3%",
                marginTop: "10px",
              }}
            >
              {" "}
              ● &nbsp; Frais légaux (administration fiscale)
            </p>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fcf0d9",
            padding: "25px 20px",
            color: "#723913",
            margin: "2px 5%",
            borderRadius: "8px",
          }}
        >
          {" "}
          <p style={{ fontWeight: "bold" }}>
            🛈 &nbsp; &nbsp;Comment obtenir mon remboursement ?
          </p>
          <p style={{ marginLeft: "2.7%", marginTop: "15px" }}>
            Vous avancez le rendez-vous juridique et les honoraires de création.
            Puis,
          </p>
          <p style={{ marginLeft: "4%", marginTop: "10px" }}>
            ● &nbsp; Remboursés intégralement sur vos premières factures
            comptables.
          </p>
          <p style={{ marginLeft: "4%", marginTop: "5px" }}>
            ● &nbsp;1 mois de comptabilité supplémentaire offert pour toute
            souscription.
          </p>
        </div>
        <br />
        <br />
      </div>
      <button
        onClick={() => {
          console.log({ offre: choix });
          nextEtape();
        }}
        style={{ padding: "1%" }}
      >
        Démarrer maintenant
      </button>
      <p
        style={{
          margin: 0,
          color: "#555",
          marginTop: "1.7%",
          marginBottom: "0.2%",
          fontSize: "0.8rem",
          padding: "0 3%",
        }}
      >
        * Des frais annexes pourront être éventuellement ajoutés selon les
        obligations légales et fiscales liées à votre projet de création
        d'entreprise. <br />
        &nbsp; Votre juriste évoquera tous ces détails avec vous lors de votre
        rendez-vous.
      </p>
      <br />
      <br />
      <br />
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "35%",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px 15px",
            }}
          >
            <HiOutlineUserGroup size={25} color="#555" />
            <h4
              style={{
                color: "#555",
                marginTop: "1.5%",
              }}
            >
              À vos côtés de A à Z
            </h4>
            <p style={{ color: "#555", marginTop: "1.5%", fontSize: "0.8rem" }}>
              Un juriste dédié vous accompagne jusqu'à l'obtention de votre
              Kbis.
            </p>
          </div>
          <div
            style={{
              width: "35%",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px 15px",
            }}
          >
            <PiPersonSimpleRunThin size={25} color="#555" />
            <h4
              style={{
                color: "#555",
                marginTop: "1.5%",
              }}
            >
              Processus ultra-rapide
            </h4>
            <p style={{ color: "#555", marginTop: "1.5%", fontSize: "0.8rem" }}>
              En quelques jours, vos statuts et dossiers sont envoyés au greffe.
            </p>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <p style={{ textAlign: "center", color: "#555", marginBottom: "0.5%" }}>
        Besion d'aide ?
      </p>
      <p
        style={{
          textAlign: "center",
          color: " #11abec",
          textDecoration: "underline",
        }}
      >
        Echanger avec un conseiller
      </p>
    </div>
  );
}

export default Offre;
