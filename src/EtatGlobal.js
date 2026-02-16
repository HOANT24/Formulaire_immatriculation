// EtatGlobal.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EtapeContext = createContext();

const initialFormData = {
  loading: true, // 🔹 pour attendre la réponse de l'API
  formeSociale: "",
  nomSociete: "",
  siegeSocial: "",
  typeSocial: "",
  capital: "",
  banque: "",
  clauseAgreement: false,
  clauseExclusion: false,
  clauseInalienabilite: false,
  clausePreemption: false,
  clauseSortie: false,
  autresClauses: false,
  commentaire: "",
  existenceAction: false,
  quorum: false,
  limitation: false,
  autresClauses2: false,
  commentaire2: "",
  secteurActivite: "",
  secteurActiviteCommentaire: "",
  activite: "",
  //
  regimeFiscal: "",
  regimeTVA: "",
  dateCloture: "",
  acteAnterieur: false,
  commentaire3: "",
  dueDate: "",
  priority: "classique",
  coefficient: "",
  //
  emailLead: "",
  nomCommercial: "",
  adresse_complement: "",
  codePostal: "",
  ville: "",

  associes: [],

  client_notes: "",

  custom_clauses: {},

  adressse: null,
  avisImposition: null,
  dernierAvisImposition: null,
  pieceIdHebergeur: null,
};

export function EtapeProvider({ children }) {
  const mapCustomClausesFromApi = (data) => {
    const clauses = {};

    if (data.clauseAgreement) clauses.agrement = { enabled: true, comment: "" };

    if (data.clauseExclusion)
      clauses.exclusion = { enabled: true, comment: "" };

    if (data.clauseInalienabilite)
      clauses.inalienabilite = { enabled: true, comment: "" };

    if (data.clausePreemption)
      clauses.preemption = { enabled: true, comment: "" };

    if (data.clauseSortie) clauses.sortie = { enabled: true, comment: "" };

    if (data.autresClauses)
      clauses.autres_associes = { enabled: true, comment: "" };

    if (data.existenceAction)
      clauses.actions_preference = { enabled: true, comment: "" };

    if (data.quorum) clauses.quorum = { enabled: true, comment: "" };

    if (data.limitation)
      clauses.limitation_pouvoirs = { enabled: true, comment: "" };

    if (data.autresClauses2)
      clauses.autres_gouvernance = { enabled: true, comment: "" };

    return clauses;
  };

  // 🔹 Étapes
  const [etape, setEtape] = useState(0);
  // 0 = Offre, 1 = RDV, 2 = Lancement, 3 = Status

  // 🔹 Formulaire global
  const [formData, setFormData] = useState(initialFormData);

  // 🔹 Récupération de l'id depuis la route
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setFormData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchData = async () => {
      console.log(`🔹 Récupération des données pour l'ID : ${id} en cours...`);
      try {
        const response = await fetch(
          `https://backend-myalfa.vercel.app/api/creation-sct/${id}`
        );
        const data = await response.json();

        const mappedData = {
          ...formData,
          loading: false,
          emailLead: data.formLead.mail || "",
          formeSociale: data.formeSociale === "N/A" ? "" : data.formeSociale,
          nomSociete: data.nomSociete || "",
          siegeSocial: data.siegeSocial || "",
          typeSocial: data.typeSocial || "",
          capital: data.capital || "",
          banque: data.banque || "",
          nomCommercial: data.nomCommercial || "",
          adresse_complement: data.adresse_complement || "",
          codePostal: data.codePostal || "",
          ville: data.ville || "",
          regimeFiscal: data.regimeFiscal || "",
          regimeTVA: data.regimeTVA || "",
          adressse: data.adressse || null,
          associes:
            data.associes?.map((associe) => ({
              nomAssocie: associe.nomAssocie || "",
              emailAssocie: associe.emailAssocie || "",
              telephoneAssocie: associe.telephoneAssocie || "",
              pourcentage: associe.pourcentage || 0,
              dirigeant: associe.dirigeant || false,
              pieceId: data.pieceId || null,
              livretFamille: data.livretFamille || null,
              carteSecurite: data.carteSecurite || null,
              adressePerso: data.adressePerso || null,
            })) || [],
          custom_clauses: mapCustomClausesFromApi(data),
        };

        setFormData(mappedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setFormData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ======================
     Étapes
  ====================== */
  const nextEtape = () => setEtape((prev) => Math.min(prev + 1, 3));
  const prevEtape = () => setEtape((prev) => Math.max(prev - 1, 0));

  /* ======================
     FormData helpers
  ====================== */

  // Champ simple
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Champ imbriqué (associes)
  const updateNestedField = (arrayName, index, field, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value,
      };
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  // Ajouter un élément (ex: associate)
  const addItem = (arrayName, defaultValue = {}) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultValue],
    }));
  };

  // Ajouter un associé facilement
  const addAssociate = () => {
    addItem("associes", {
      nomAssocie: "",
      emailAssocie: "",
      telephoneAssocie: "",
      pourcentage: 0,
      dirigeant: false,
    });
  };

  // Supprimer un élément
  const removeItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  // Reset formulaire
  const resetForm = () => setFormData(initialFormData);

  return (
    <EtapeContext.Provider
      value={{
        // Étapes
        etape,
        setEtape,
        nextEtape,
        prevEtape,

        // Formulaire
        formData,
        setFormData,
        updateField,
        updateNestedField,
        addItem,
        addAssociate,
        removeItem,
        resetForm,
      }}
    >
      {children}
    </EtapeContext.Provider>
  );
}

export function useEtape() {
  return useContext(EtapeContext);
}
