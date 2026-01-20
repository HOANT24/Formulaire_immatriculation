// EtatGlobal.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EtapeContext = createContext();

const initialFormData = {
  loading: true, // 🔹 pour attendre la réponse de l'API
  company_type: "",
  company_name: "",
  commercial_name: "",
  share_capital: null,
  bank: "",

  headquarters_type: "",
  headquarters_address: "",
  headquarters_complement: "",
  headquarters_postal_code: "",
  headquarters_city: "",
  headquarters_proof_document: null,

  business_activity: "",

  associates: [],

  client_notes: "",

  custom_clauses: {},
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

  const parseFrenchNumber = (value) => {
    if (!value) return null;

    return Number(
      value
        .replace(/\s/g, "") // enlève les espaces
        .replace("€", "") // enlève €
        .replace(",", ".") // virgule → point
    );
  };

  /* ======================
     API Fetch
  ====================== */
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
          company_type: data.formeSociale === "N/A" ? "" : data.formeSociale,
          company_name: data.nomSociete || "",
          share_capital: parseFrenchNumber(data.capital),
          bank: data.banque || "",
          headquarters_type: data.typeSocial || "",
          headquarters_address: data.siegeSocial || "",
          associates:
            data.associes?.map((associe) => ({
              first_name: associe.nomAssocie || "",
              email: "",
              phone: "",
              capital_percentage: associe.pourcentage || 0,
              is_manager: associe.dirigeant || false,
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

  // Champ imbriqué (associates)
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
    addItem("associates", {
      first_name: "",
      email: "",
      phone: "",
      capital_percentage: 0,
      is_manager: false,
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
