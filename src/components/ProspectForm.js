import React, { useState, useEffect } from "react";
import logo from "../assets/logo.webp";
import "../styles/global.css";
import "../App.css";
import { useParams } from "react-router-dom";

function ProspectForm() {
  const { id } = useParams();
  const [setProspectType] = useState("");
  const [formData, setFormData] = useState({
    nomComplet: "",
    email: "",
    telephone: "",
    adresse: "",
    documents: {
      bilanDocument: [],
      identityDocument: [],
      kbisDocument: [],
      statusDocument: [],
      pieceIdentite: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false); // Contrôle l'affichage du dialog

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchFormLead = async () => {
      try {
        const response = await fetch(
          `https://backend-myalfa.vercel.app/api/formleads/${id}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const result = await response.json();
        const data = result.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          nomComplet: `${data.nom} ${data.prenom}`,
          email: data.mail || "",
          telephone: data.tel || "",
        }));
      } catch (error) {
        console.error("Erreur lors du chargement du formulaire :", error);
      }
    };

    if (id) {
      fetchFormLead();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- 🔹 5. Réinitialisation
      setMessage("Formulaire envoyé avec succès !");
      setFormData({
        nomComplet: "",
        email: "",
        telephone: "",
        adresse: "",
        documents: {
          bilanDocument: [],
          identityDocument: [],
          kbisDocument: [],
          statusDocument: [],
          pieceIdentite: [],
        },
      });
      setProspectType("");
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
      <div className="header">
        <div className="text-img">
          <img src={logo} alt="Logo" className="logoImage" />
          <h3>DOCUMENT DE CREATION DE SOCIETE</h3>
          <p>
            Remplissez ce formulaire afin de préparer efficacement les documents
            nécessaires à la création ou à l’immatriculation de votre société !
          </p>
        </div>
        <form onSubmit={handleSubmit} className="prospect-form">
          <p>Nom complet:</p>
          <input
            type="text"
            name="nomComplet"
            value={formData.nomComplet}
            onChange={handleInputChange}
            required
          />
          <p>Email:</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <p>Téléphone:</p>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            required
          />
          <p>Adresse:</p>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleInputChange}
            required
          />
        </form>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>
            Veuillez patienter, l'importation des fichiers et l'envoi du mail
            sont en cours...
          </p>
        </div>
      ) : (
        <button type="button" onClick={handleSubmit}>
          Envoyer
        </button>
      )}

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
