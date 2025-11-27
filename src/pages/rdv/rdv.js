import React, { useState } from "react";
import "./rdv.css";
import {
  FaUtensils,
  FaHammer,
  FaBuilding,
  FaStethoscope,
  FaLaptopCode,
  FaTruck,
  FaCar,
} from "react-icons/fa";

function Rdv() {
  const [step, setStep] = useState(1);

  // ✅ FormData global
  const [formData, setFormData] = useState({
    secteur: "",
    formeSociale: "",
    nomEntreprise: "",
    ville: "",
  });

  const [isAutre, setIsAutre] = useState(false);

  const nextStep = () => {
    if (step < 7) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // ✅ Gestion des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecteurChange = (value) => {
    if (value === "Autre Secteur") {
      setIsAutre(true);
      setFormData((prev) => ({
        ...prev,
        secteur: "",
      }));
    } else {
      setIsAutre(false);
      setFormData((prev) => ({
        ...prev,
        secteur: value,
      }));
    }
  };

  const secteurIcons = {
    "Commerce / restauration": <FaUtensils size={20} />,
    "Artisan & BTP": <FaHammer size={20} />,
    "Investissement immobilier": <FaBuilding size={20} />,
    "Médical / paramédical": <FaStethoscope size={20} />,
    Freelance: <FaLaptopCode size={20} />,
    Transport: <FaTruck size={20} />,
    Automobile: <FaCar size={20} />,
  };

  return (
    <div className="containerRdv">
      {/* ✅ AFFICHAGE DES INFOS sélectionnées */}
      <div className="information">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#007BFF",
            }}
          >
            {" "}
            Vous avez des difficulté ?
          </p>
          <p style={{ color: "grey" }}>
            {" "}
            Contacter nos experts afin de vous aidez d'avantage{" "}
          </p>
          <div
            style={{
              width: "70%",
              textAlign: "center",
              border: "2px solid #840040",
              padding: "12.5px",
              borderRadius: "25px",
              marginTop: "20px",
              color: "#840040",
              fontWeight: "bolder",
              cursor: "pointer",
            }}
          >
            <p style={{ fontSize: "1.2rem" }}>Prendre un rdv gratuit</p>
          </div>
        </div>

        <br />
        <br />
        <br />
        {formData.secteur && (
          <>
            <h3 style={{ color: "#013a51", marginBottom: "15px" }}>
              Récapitulatif
            </h3>
            <p> Principales activités : {formData.secteur}</p>
            <p>Frome sociale : {formData.formeSociale}</p>
          </>
        )}

        {/* 
        <p>
          <strong>Forme sociale :</strong> {formData.formeSociale || "—"}
        </p>
        <p>
          <strong>Nom entreprise :</strong> {formData.nomEntreprise || "—"}
        </p>
        <p>
          <strong>Ville :</strong> {formData.ville || "—"}
        </p> */}
      </div>

      <div className="rdv-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p></p>
          <div className="step-indicator" style={{ color: "#840040" }}>
            Étape : {step} / 7
          </div>
        </div>
        <br />

        {/* ✅ CONTENU DYNAMIQUE */}
        <div className="step-content">
          {/* ✅ Étape 1 */}
          {step === 1 && (
            <>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "4%",
                  color: "#013a51",
                }}
              >
                Quel sera votre secteur d'activité ?
              </p>

              <div className="secteur-grid">
                {[
                  "Commerce / restauration",
                  "Artisan & BTP",
                  "Investissement immobilier",
                  "Médical / paramédical",
                  "Freelance",
                  "Transport",
                  "Automobile",
                  "Autre Secteur",
                ].map((item) => (
                  <label
                    key={item}
                    className={`secteur-card ${
                      formData.secteur === item ||
                      (item === "Autre Secteur" && isAutre)
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="secteur"
                      value={item}
                      checked={
                        item === "Autre Secteur"
                          ? isAutre
                          : formData.secteur === item
                      }
                      onChange={(e) => handleSecteurChange(e.target.value)}
                    />
                    <div className="secteur-icon">{secteurIcons[item]}</div>
                    <div
                      className="secteur-label"
                      style={{ marginTop: "8%", fontSize: "0.9rem" }}
                    >
                      {item}
                    </div>
                  </label>
                ))}
              </div>
              {isAutre && (
                <div style={{ width: "100%", marginTop: "2%" }}>
                  <input
                    type="text"
                    name="secteur"
                    placeholder="Précisez votre principale activité ..."
                    value={formData.secteur}
                    onChange={handleChange}
                    style={{ marginTop: "15px", width: "100%" }}
                    rows={2}
                  />
                </div>
              )}
            </>
          )}

          {/* ✅ Étape 2 */}
          {step === 2 && (
            <div>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "2%",
                  color: "#013a51",
                }}
              >
                Sélectionner votre forme sociale
              </p>
              {step > 1 && (
                <div
                  onClick={prevStep}
                  style={{
                    color: "#013a51",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  Précédent
                  <hr
                    style={{
                      width: "9%",
                      height: "3px",
                      backgroundColor: "#013a51",
                    }}
                  />
                </div>
              )}
              <br />

              <div className="grid-options">
                {[
                  "Micro",
                  "Entreprise individuelle",
                  "LMNP",
                  "EURL / SARL",
                  "SASU / SAS",
                  "SCI",
                ].map((option) => (
                  <div
                    key={option}
                    className={`option-card ${
                      formData.formeSociale === option ? "active" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, formeSociale: option })
                    }
                  >
                    {option}
                  </div>
                ))}

                <div
                  className={`option-card full-width ${
                    formData.formeSociale ===
                    "Je ne sais pas, j’ai besoin d’aide"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      formeSociale: "Je ne sais pas, j’ai besoin d’aide",
                    })
                  }
                >
                  Je ne sais pas, j’ai besoin d’aide
                </div>
              </div>
            </div>
          )}

          {/* ✅ Étape 3 */}
          {step === 3 && (
            <div>
              <h3>Identité de l’entreprise</h3>
              <input
                type="text"
                name="nomEntreprise"
                placeholder="Nom de l'entreprise"
                value={formData.nomEntreprise}
                onChange={handleChange}
              />
              <input
                type="text"
                name="ville"
                placeholder="Ville"
                value={formData.ville}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Tu pourras ajouter étapes 4 à 7 sur le même modèle */}
        </div>

        {/* ✅ BOUTONS */}
        <div className="buttons">
          <p></p>
          {step < 7 && <button onClick={nextStep}>Suivant</button>}
        </div>
      </div>
    </div>
  );
}

export default Rdv;
