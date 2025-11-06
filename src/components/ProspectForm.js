import React, { useState } from "react";
import logo from "../assets/logo.webp";
import "../styles/global.css";
import "../App.css";

function ProspectForm() {
  const [setProspectType] = useState("");
  const [formStep, setFormStep] = useState(1); // Étape du formulaire (1 = première, 2 = deuxième)
  const [formData, setFormData] = useState({
    secteurActivite: "",
    activitePrincipale: "",
    formeSociale: "",
    denominationSociale: "",
    nomCommercial: "",
    sigle: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  // Gère les changements dans tous les champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Passer à l'étape suivante
  const handleNext = () => {
    if (formData.secteurActivite && formData.formeSociale) {
      setFormStep(2);
    } else {
      alert("Veuillez remplir les champs obligatoires avant de continuer.");
    }
  };

  // Revenir à l'étape précédente
  const handlePrevious = () => {
    setFormStep(1);
  };

  // Soumission finale du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🚀 Envoi du formulaire avec les données :", formData);

    try {
      setMessage("Formulaire envoyé avec succès !");
      setFormData({
        secteurActivite: "",
        activitePrincipale: "",
        formeSociale: "",
        denominationSociale: "",
        nomCommercial: "",
        sigle: "",
      });
      setProspectType("");
      setFormStep(1);
      setShowDialog(true);
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi :", err);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all">
      <br />
      <div className="form-container">
        <div className="header">
          <div className="text-img">
            <img src={logo} alt="Logo" className="logoImage" />
            <h3>CREATION DE SOCIETE</h3>
            <p>
              Remplissez ce formulaire afin de préparer efficacement
              l’immatriculation de votre société !
            </p>
          </div>

          <form onSubmit={handleSubmit} className="prospect-form">
            {formStep === 1 && (
              <>
                <p>
                  Quel sera le secteur d’activité :{" "}
                  <span style={{ color: "red" }}>*</span>
                </p>
                <select
                  name="secteurActivite"
                  value={formData.secteurActivite}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""></option>
                  <option value="commerce_restauration">
                    Commerce / restauration
                  </option>
                  <option value="artisan_btp">Artisan & BTP</option>
                  <option value="investissement_immobilier">
                    Investissement immobilier
                  </option>
                  <option value="medical_paramedical">
                    Médical / paramédical
                  </option>
                  <option value="freelance">Freelance</option>
                  <option value="transport">Transport</option>
                  <option value="automobile">Automobile</option>
                  <option value="autre">Autre (à préciser)</option>
                </select>

                <p>Principales activités :</p>
                <input
                  type="text"
                  name="activitePrincipale"
                  value={formData.activitePrincipale}
                  onChange={handleInputChange}
                />
                <br />
                <p>
                  Sélectionner votre forme sociale :{" "}
                  <span style={{ color: "red" }}>*</span>
                </p>
                <select
                  name="formeSociale"
                  value={formData.formeSociale}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""></option>
                  <option value="micro">Micro</option>
                  <option value="entreprise_individuelle">
                    Entreprise individuelle
                  </option>
                  <option value="lmnp">LMNP</option>
                  <option value="eurl_sarl">EURL / SARL</option>
                  <option value="sasu_sas">SASU / SAS</option>
                  <option value="sci">SCI</option>
                  <option value="aide">
                    Je ne sais pas, j’ai besoin d’aide
                  </option>
                </select>

                <div style={{ marginTop: "20px" }}>
                  <button type="button" onClick={handleNext}>
                    Suivant
                  </button>
                </div>
              </>
            )}

            {formStep === 2 && (
              <>
                <h3>Identité de l’entreprise</h3>
                <p>Dénomination sociale :</p>
                <input
                  type="text"
                  name="denominationSociale"
                  value={formData.denominationSociale}
                  onChange={handleInputChange}
                  required
                />

                <p>Nom commercial :</p>
                <input
                  type="text"
                  name="nomCommercial"
                  value={formData.nomCommercial}
                  onChange={handleInputChange}
                  required
                />

                <p>Sigle :</p>
                <input
                  type="text"
                  name="sigle"
                  value={formData.sigle}
                  onChange={handleInputChange}
                />

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    gap: "8%",
                  }}
                >
                  <button type="button" onClick={handlePrevious}>
                    Précédent
                  </button>{" "}
                  <button type="submit" disabled={loading}>
                    {loading ? "Envoi..." : "Soumettre"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{message}</p>
            <button onClick={() => setShowDialog(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProspectForm;
