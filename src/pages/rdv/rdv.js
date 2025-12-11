import React, { useState } from "react";
import "./rdv.css";
import {
  FaStore,
  FaUtensils,
  FaHammer,
  FaBuilding,
  FaHome,
  FaStethoscope,
  FaBriefcase,
  FaHandsHelping,
  FaChalkboardTeacher,
  FaLaptopCode,
  FaCity,
  FaTruck,
  FaCar,
  FaUser,
  FaUsers,
} from "react-icons/fa";

function Rdv() {
  const [step, setStep] = useState(1);

  // ✅ FormData global
  const [formData, setFormData] = useState({
    secteur: "",
    formeSociale: "",
    formeGroupe: "",
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    motdepasse: "",
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
    Commerce: <FaStore size={20} />, // plus adapté qu'une fourchette
    "Hôtellerie / restauration": <FaUtensils size={20} />,

    "Artisan & BTP": <FaHammer size={20} />,

    "Investissement immobilier": <FaCity size={20} />,
    "Agent immobilier": <FaHome size={20} />,

    "Médical / paramédical": <FaStethoscope size={20} />,

    "Services / tertiaire": <FaBriefcase size={20} />,
    "Services à la personne": <FaHandsHelping size={20} />,

    "Consulting / formation": <FaChalkboardTeacher size={20} />,
    Freelance: <FaLaptopCode size={20} />,

    "Digital / tech": <FaLaptopCode size={20} />,

    Holding: <FaBuilding size={20} />,

    Transport: <FaTruck size={20} />,
    Automobile: <FaCar size={20} />,
  };

  const getFormesSociales = () => {
    const s = formData.secteur;
    const g = formData.formeGroupe;

    if (!g) return [];

    if (s === "Médical / paramédical") {
      return g === "Seul"
        ? ["EI BNC", "EI IS", "SELARLU", "SELASU"]
        : ["SELARL", "SELAS", "SELAFA", "SELCA", "SCP", "SCM"];
    }

    if (s === "Investissement immobilier") {
      return g === "Seul"
        ? ["LMNP", "EURL", "SASU"]
        : ["SCI", "SAS", "SARL IS", "SARL de famille"];
    }

    // Autres cas
    return g === "Seul"
      ? ["Micro", "Entreprise individuelle", "LMNP", "EURL", "SASU"]
      : ["SARL", "SAS", "SCI"];
  };

  return (
    <div className="containerRdv">
      {/* ✅ AFFICHAGE DES INFOS sélectionnées */}
      <div className="information">
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
          <p style={{ color: "grey", textAlign: "center" }}>
            {" "}
            Contacter nos experts afin de vous aidez d'avantage{" "}
          </p>
          <div
            style={{
              width: "80%",
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
            <p style={{ fontSize: "1rem" }}>Prendre un rdv gratuit</p>
          </div>
        </div>

        <br />
        <br />
        <div
          style={{
            border: "2px solid #ccc",
            padding: "25px 15px",
            height: "auto",
            borderRadius: "10px",
            margin: "1% 2%",
          }}
        >
          <h4 style={{ color: "#013a51", marginBottom: "10px" }}>
            Récapitulatif de vos informations :
          </h4>
          <hr style={{ color: "#013a51", marginBottom: "20px" }} />
          {formData.secteur && (
            <p>
              {" "}
              Principales activités :{" "}
              <strong style={{ color: "#013a51" }}>{formData.secteur}</strong>
            </p>
          )}
          {formData.formeGroupe && (
            <p style={{ marginTop: "8px" }}>
              Entreprenariat :{" "}
              <strong style={{ color: "#013a51" }}>
                {formData.formeGroupe}
              </strong>
            </p>
          )}
          {formData.formeSociale && (
            <p style={{ marginTop: "8px" }}>
              Frome sociale :{" "}
              <strong style={{ color: "#013a51" }}>
                {formData.formeSociale}
              </strong>
            </p>
          )}
        </div>
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
                  "Commerce",
                  "Hôtellerie / restauration",
                  "Artisan & BTP",
                  "Investissement immobilier",
                  "Agent immobilier",
                  "Médical / paramédical",
                  "Services / tertiaire",
                  "Services à la personne",
                  "Consulting / formation",
                  "Freelance",
                  "Digital / tech",
                  "Holding",
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
                  color: "#013a51",
                  marginBottom: "10px",
                }}
              >
                Entreprenez-vous seul ou à plusieurs ?
              </p>

              <div
                onClick={prevStep}
                style={{
                  cursor: "pointer",
                  color: " #11abec",
                  textDecoration: "underline",
                }}
              >
                Précédent
              </div>
              <br />
              <br />
              {/* 🔥 Étape 2.1 : deux tuiles */}
              <div className="grid-options-container">
                {[
                  { label: "Seul", icon: FaUser },
                  { label: "A plusieurs", icon: FaUsers },
                ].map((v) => {
                  const isActive = formData.formeGroupe === v.label;
                  const IconComponent = v.icon;
                  return (
                    <div
                      key={v.label}
                      className={`option-card ${isActive ? "active" : ""}`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          formeGroupe: v.label,
                          formeSociale: "",
                        })
                      }
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <IconComponent
                          size={20}
                          color={isActive ? "#fff" : "#840040"}
                        />
                      </div>
                      {v.label}
                    </div>
                  );
                })}
              </div>
              <br />
              {/* 🔥 Étape 2.2 : Formes sociales selon conditions */}
              {formData.formeGroupe && (
                <>
                  <p
                    style={{
                      marginTop: "25px",
                      fontWeight: "bold",
                      color: "#013a51",
                    }}
                  >
                    Sélectionner votre forme sociale :
                  </p>
                  <br />
                  <div className="grid-options">
                    {getFormesSociales().map((option) => (
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
                  </div>
                </>
              )}
            </div>
          )}

          {/* ✅ Étape 3 */}
          {step === 3 && (
            <div className="step-three-form">
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#013a51",
                  marginBottom: "10px",
                }}
              >
                L'identité de votre entreprise
              </p>
              <div
                onClick={prevStep}
                style={{
                  cursor: "pointer",
                  color: " #11abec",
                  textDecoration: "underline",
                }}
              >
                Précédent
              </div>
              <br />
              <br />
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ margin: 0 }}>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ margin: 0 }}>Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div style={{ marginTop: "20px" }}>
                <label style={{ margin: 0 }}>Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  placeholder="Numéro Téléphone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <label style={{ margin: 0 }}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <label style={{ margin: 0 }}>
                  Mot de passe ( 6 caratères minimum )
                </label>
                <input
                  type="password"
                  name="motdepasse"
                  placeholder="******"
                  value={formData.motdepasse}
                  onChange={handleChange}
                />
              </div>
              <br />
              <p style={{ color: "#840040", fontWeight: "bold" }}>
                * Ces informations vont servir à créer un votre compte dans
                notre cabinet
              </p>
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
