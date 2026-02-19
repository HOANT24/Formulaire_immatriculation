import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SimpleSelect } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Building2,
  Users,
  Upload,
  Send,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  MapPin,
  FileText,
  Sparkles,
  Check,
  //   Home,
  //   FileCheck,
  ChevronDown,
  Settings,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../lib/utils";
import { useEtape } from "../../EtatGlobal.js";
import { useParams } from "react-router-dom";

const companyTypes = [
  "E.I",
  "E.I.R.L",
  "EARL",
  "EURL",
  "SARL",
  "SASU",
  "SAS",
  "SCI",
  "SCCV",
  "LMNP",
  "GFA",
  "SC",
  "SCP",
  "SEL",
  "N/A",
  "Je ne sais pas, j'ai besoin d'aide",
];

const headquartersTypes = [
  { id: "Propriétaire", label: "Propriété", doc: "Taxe foncière" },
  {
    id: "Locataire",
    label: "Location",
    doc: "Facture EDF, eau ou Internet fixe de moins de 3 mois",
  },
  {
    id: "Domiciliation",
    label: "Domiciliation",
    doc: "Aucun justificatif nécessaire",
  },
];

const banques = [
  "Crédit Agricole",
  "BNP Paribas",
  "Société Générale",
  "LCL",
  "Caisse d'Épargne",
  "Banque Populaire",
  "CIC",
  "Crédit Mutuel",
  "La Banque Postale",
  "HSBC",
  "Boursorama",
  "Fortuneo",
  "Hello banque!",
  "N26",
  "Revolut",
  "Qonto",
  "Shine",
  "Autre",
];

const advancedClauses = {
  associates: [
    {
      id: "agrement",
      label: "Clause d'agrément",
      tooltip:
        "Obligation d'obtenir l'accord des autres associés pour céder ses parts",
    },
    {
      id: "exclusion",
      label: "Clause d'exclusion",
      tooltip: "Possibilité d'exclure un associé dans certaines conditions",
    },
    {
      id: "inalienabilite",
      label: "Clause d'inaliénabilité",
      tooltip: "Interdiction temporaire de céder ses parts",
    },
    {
      id: "preemption",
      label: "Clause de préemption",
      tooltip: "Droit de priorité des associés pour racheter les parts",
    },
    {
      id: "sortie",
      label: "Clause de sortie",
      tooltip: "Conditions et modalités de sortie d'un associé",
    },
    {
      id: "autres_associes",
      label: "Autres",
      tooltip: "Autres clauses personnalisées relatives aux associés",
    },
  ],
  governance: [
    {
      id: "actions_preference",
      label: "Existence d'action de préférence",
      tooltip:
        "Actions avec droits particuliers (vote double, dividende prioritaire...)",
    },
    {
      id: "quorum",
      label: "Quorum ou majorité renforcée",
      tooltip: "Conditions de vote plus strictes pour certaines décisions",
    },
    {
      id: "limitation_pouvoirs",
      label: "Limitation des pouvoirs du dirigeant",
      tooltip:
        "Restrictions sur les décisions que peut prendre seul le dirigeant",
    },
    {
      id: "autres_gouvernance",
      label: "Autres",
      tooltip: "Autres clauses personnalisées relatives à la gouvernance",
    },
  ],
};

const regimeFiscal = [
  "IS RS",
  "IS RN",
  "IR BIC Micro",
  "IR BIC RS",
  "IR BIC RN",
  "IR BNC micro",
  "IR BNC réel",
  "IR RF",
  "IR LMNP",
  "Je ne sais pas, j'ai besoin d'aide",
];

const regimeTVAs = [
  "N/A",
  "Franchise",
  "RSI",
  "RN",
  "Mini réel",
  "Je ne sais pas, j'ai besoin d'aide",
];

export default function SimplifiedForm({ onSubmit }) {
  const { id } = useParams();
  console.log("ID from params:", id);
  const {
    formData,
    setFormData,
    updateField,
    updateNestedField,
    addItem,
    removeItem,
  } = useEtape();
  const [errors, setErrors] = useState({});
  const [businessActivityInput, setBusinessActivityInput] = useState("");
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleChange = (field, value, type = "text") => {
    let finalValue = value;

    // ✅ Checkbox → true/false
    if (type === "checkbox") {
      finalValue = !!value;
    }

    // ✅ Nombre → parseFloat
    if (type === "number") {
      finalValue = value === "" ? "" : parseFloat(value);
    }

    // ✅ Si le champ est custom_clauses, on met à jour les booléens associés
    let extraFields = {};
    if (field === "custom_clauses") {
      const clauses = finalValue || {};
      extraFields = {
        clauseAgreement: !!clauses.agrement?.enabled,
        clauseExclusion: !!clauses.exclusion?.enabled,
        clauseInalienabilite: !!clauses.inalienabilite?.enabled,
        clausePreemption: !!clauses.preemption?.enabled,
        clauseSortie: !!clauses.sortie?.enabled,
        autresClauses: !!clauses.autres_associes?.enabled,
        existenceAction: !!clauses.actions_preference?.enabled,
        quorum: !!clauses.quorum?.enabled,
        limitation: !!clauses.limitation_pouvoirs?.enabled,
        autresClauses2: !!clauses.autres_gouvernance?.enabled,
      };
    }

    // 🔹 Update générique pour tous les champs
    updateField(field, finalValue);

    // 🔹 Reset error si existant
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }

    // 🔹 Mise à jour formData (avec extraFields si custom_clauses)
    setFormData((prev) => ({
      ...prev,
      [field]: finalValue,
      ...extraFields,
    }));
  };

  const generateBusinessActivity = async () => {
    if (!businessActivityInput.trim()) return;

    setIsGeneratingActivity(true);

    try {
      const response = await fetch(
        "https://backend-myalfa.vercel.app/api/business-activity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessActivityInput,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur API");
      }

      handleChange("activite", data.result);
      setBusinessActivityInput("");
    } catch (error) {
      console.error("Error generating activity:", error);
      setErrors((prev) => ({
        ...prev,
        activite: "Erreur lors de la génération",
      }));
    } finally {
      setIsGeneratingActivity(false);
    }
  };

  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=fr&limit=5`
      );
      const data = await response.json();
      setAddressSuggestions(data);
    } catch (error) {
      console.error("Error searching address:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const selectAddress = (suggestion) => {
    const displayName = suggestion.display_name;
    const userInput = formData.siegeSocial; // garder le texte saisi

    // 1️⃣ Extraire le code postal
    const postalMatch = displayName.match(/\b\d{5}\b/);
    const postalCode = postalMatch ? postalMatch[0] : "";

    // 2️⃣ Extraire la ville
    let city = "";
    const parts = displayName.split(",").map((p) => p.trim());

    // Parcours des parties après l'adresse pour trouver la première qui n'est ni code postal ni région
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (!/\d{5}/.test(part) && part.toLowerCase() !== "la réunion") {
        city = part;
        break;
      }
    }

    // 3️⃣ Adresse = texte saisi
    const address = userInput;

    // 4️⃣ Remplir les champs
    handleChange("siegeSocial", address);
    handleChange("codePostal", postalCode);
    handleChange("ville", city);

    // 5️⃣ Vider les suggestions
    setAddressSuggestions([]);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (formData.siegeSocial && formData.siegeSocial.length >= 3) {
        searchAddress(formData.siegeSocial);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [formData.siegeSocial]);

  const handleNestedChange = (parent, index, field, value) => {
    updateNestedField(parent, index, field, value);
  };

  const addAssociate = () => {
    addItem("associes", {
      nomAssocie: "",
      emailAssocie: "",
      telephoneAssocie: "",
      pourcentage: 0,
      dirigeant: false,

      pieceId: null,
      livretFamille: null,
      carteSecurite: null,
      adressePerso: null,
    });
  };

  const removeAssociate = (index) => {
    removeItem("associes", index);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.formeSociale) newErrors.formeSociale = "Requis";
    if (!formData.banque) newErrors.banque = "Requis";
    if (!formData.nomSociete?.trim()) newErrors.nomSociete = "Requis";

    if (!formData.associes?.length) {
      newErrors.associes = "Au moins un associé requis";
    } else {
      formData.associes.forEach((a, i) => {
        if (!a.nomAssocie?.trim())
          newErrors[`associate_${i}_nomAssocie`] = "Requis";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loadingSubmit) return;

    if (!validate()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      setLoadingSubmit(true);

      const formDataToSend = new FormData();

      // -----------------------
      // 1️⃣ Champs normaux (texte, booléens…)
      // -----------------------
      Object.keys(formData).forEach((key) => {
        if (
          key !== "associes" &&
          key !== "adressse" &&
          key !== "avisImposition" &&
          key !== "dernierAvisImposition" &&
          key !== "pieceIdHebergeur"
        ) {
          formDataToSend.append(key, formData[key] ?? "");
        }
      });

      // -----------------------
      // 2️⃣ Associes (JSON)
      // -----------------------
      formDataToSend.append(
        "associes",
        JSON.stringify(formData.associes || [])
      );

      // -----------------------
      // 3️⃣ Documents société
      // -----------------------
      if (formData.adressse)
        formDataToSend.append("adressse", formData.adressse);

      if (formData.avisImposition)
        formDataToSend.append("avisImposition", formData.avisImposition);

      if (formData.dernierAvisImposition)
        formDataToSend.append(
          "dernierAvisImposition",
          formData.dernierAvisImposition
        );

      if (formData.pieceIdHebergeur)
        formDataToSend.append("pieceIdHebergeur", formData.pieceIdHebergeur);

      // -----------------------
      // 4️⃣ Documents dirigeants
      // -----------------------
      formData.associes?.forEach((associate) => {
        if (associate.dirigeant) {
          if (associate.pieceId)
            formDataToSend.append("pieceId", associate.pieceId);

          if (associate.livretFamille)
            formDataToSend.append("livretFamille", associate.livretFamille);

          if (associate.carteSecurite)
            formDataToSend.append("carteSecurite", associate.carteSecurite);

          if (associate.adressePerso)
            formDataToSend.append("adressePerso", associate.adressePerso);
        }
      });

      const response = await fetch(
        `https://backend-myalfa.vercel.app/api/creation-sct/${id}`,
        {
          method: "PUT",
          body: formDataToSend, // ⚠️ PAS DE headers
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      await fetch(
        "https://backend-myalfa.vercel.app/api/email-imm-client-post-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }), // on envoie uniquement l'id
        }
      );

      if (onSubmit) onSubmit(data);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Erreur serveur",
      }));
    } finally {
      setLoadingSubmit(false);
    }
  };

  const associes = formData.associes || [];

  const getDocumentTooltip = () => {
    const type = headquartersTypes.find((t) => t.id === formData.typeSocial);
    return type ? type.doc : "Sélectionnez un type de domiciliation";
  };

  if (formData.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin text-slate-400"
          color="#981845"
        />
      </div>
    );
  }

  console.log("Submitting formData:", formData);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Société + Siège côte à côte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Société */}
        <Card className="relative border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#840040]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="bg-gradient-to-r from-[#840040]/10 via-[#840040]/5 to-transparent relative z-10">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building2 className="w-5 h-5 text-[#840040]" />
              </div>
              <span className="text-lg">Informations société</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6 relative z-10">
            <div data-error={!!errors.formeSociale}>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Forme juridique *
              </Label>

              <SimpleSelect
                value={formData.formeSociale}
                onChange={(v) => handleChange("formeSociale", v.trim())}
                options={companyTypes}
                placeholder="Sélectionnez la forme juridique..."
                error={errors.formeSociale}
              />
            </div>
            <div data-error={!!errors.nomSociete}>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Dénomination sociale *
              </Label>
              <Input
                value={formData.nomSociete || ""}
                onChange={(e) => handleChange("nomSociete", e.target.value)}
                onFocus={() => setFocusedField("nomSociete")}
                onBlur={() => setFocusedField(null)}
                placeholder="Entrez le nom officiel de votre société"
                className={cn(
                  "mt-1 h-11 border-2 transition-all duration-200 bg-white",
                  errors.nomSociete
                    ? "border-red-300 focus:ring-red-100"
                    : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10",
                  focusedField === "nomSociete" && "shadow-lg"
                )}
              />
              {errors.nomSociete && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.nomSociete}
                </motion.p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Nom commercial
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#840040]/10 hover:bg-[#840040]/20 transition-colors cursor-help">
                        <Info className="w-3 h-3 text-[#840040]" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm bg-white border-2 border-[#840040]/20 shadow-xl p-4">
                      <p className="text-sm">
                        <strong className="text-[#840040]">
                          Dénomination sociale :
                        </strong>{" "}
                        nom officiel et juridique de votre société.
                      </p>
                      <p className="text-sm mt-2">
                        <strong className="text-[#840040]">
                          Nom commercial :
                        </strong>{" "}
                        nom sous lequel vous exercez votre activité (optionnel,
                        peut être identique).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                value={formData.nomCommercial || ""}
                onChange={(e) => handleChange("nomCommercial", e.target.value)}
                placeholder="Le nom que vos clients connaîtront (optionnel)"
                className="mt-1 h-11 border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div data-error={!!errors.capital}>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Capital social (€) *
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    value={formData.capital || ""}
                    onChange={(e) =>
                      handleChange("capital", parseFloat(e.target.value))
                    }
                    placeholder="1000"
                    className={cn(
                      "mt-1 h-11 border-2 transition-all duration-200 bg-white pr-8",
                      errors.capital
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10"
                    )}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                    €
                  </span>
                </div>
                {errors.capital && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.capital}
                  </motion.p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Banque *
                </Label>

                <SimpleSelect
                  value={formData.banque}
                  onChange={(v) => handleChange("banque", v)}
                  options={banques}
                  placeholder="Sélectionnez votre banque..."
                  error={errors.banque}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div data-error={!!errors.capital}>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Régime fiscal
                </Label>
                <SimpleSelect
                  value={formData.regimeFiscal}
                  onChange={(v) => handleChange("regimeFiscal", v.trim())}
                  options={regimeFiscal}
                  placeholder="Sélectionnez le Régime fiscal..."
                  error={errors.regimeFiscal}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  TVA
                </Label>

                <SimpleSelect
                  value={formData.regimeTVA}
                  onChange={(v) => handleChange("regimeTVA", v)}
                  options={regimeTVAs}
                  placeholder="Sélectionnez votre TVA..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Siège */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#840040]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="bg-gradient-to-r from-[#840040]/10 via-[#840040]/5 to-transparent relative z-10">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-[#840040]" />
              </div>
              <span className="text-lg">Siège social</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6 relative z-10">
            <div data-error={!!errors.typeSocial}>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Type de domiciliation *
              </Label>
              <RadioGroup
                value={formData.typeSocial || ""}
                onValueChange={(v) => handleChange("typeSocial", v)}
                className="grid grid-cols-3 gap-3 mt-2"
              >
                {headquartersTypes.map((type) => (
                  <Label
                    key={type.id}
                    htmlFor={type.id}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden group",
                      formData.typeSocial === type.id
                        ? "border-[#840040] bg-gradient-to-br from-[#840040]/10 to-[#840040]/5 shadow-md"
                        : "border-gray-200 hover:border-[#840040]/40 hover:shadow-sm bg-white"
                    )}
                  >
                    {formData.typeSocial === type.id && (
                      <motion.div
                        layoutId="selectedType"
                        className="absolute inset-0 bg-gradient-to-br from-[#840040]/5 to-transparent"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <RadioGroupItem
                      value={type.id}
                      id={type.id}
                      className="relative z-10 mt-0"
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold relative z-10 transition-colors",
                        formData.typeSocial === type.id
                          ? "text-[#840040]"
                          : "text-gray-700"
                      )}
                    >
                      {type.label}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
              {errors.typeSocial && (
                <p className="text-sm text-red-500 mt-1">{errors.typeSocial}</p>
              )}
            </div>

            <div data-error={!!errors.siegeSocial}>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Adresse *
              </Label>
              <div className="relative mt-1">
                <Input
                  value={formData.siegeSocial || ""}
                  onChange={(e) => handleChange("siegeSocial", e.target.value)}
                  placeholder="Commencez à saisir votre adresse..."
                  className={cn(
                    "h-11 border-2 transition-all duration-200 bg-white pr-10",
                    errors.siegeSocial
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10"
                  )}
                />
                {isLoadingAddress && (
                  <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                )}
                {addressSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-2 bg-white border-2 border-[#840040]/20 rounded-xl shadow-2xl max-h-60 overflow-auto"
                  >
                    {addressSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectAddress(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-[#840040]/5 border-b last:border-b-0 text-sm transition-colors duration-150 flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-[#840040]" />
                        <span>{suggestion.display_name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              {errors.siegeSocial && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.siegeSocial}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Complément d'adresse
              </Label>
              <Input
                value={formData.adresse_complement || ""}
                onChange={(e) =>
                  handleChange("adresse_complement", e.target.value)
                }
                placeholder="Bâtiment, Étage, Appartement... (optionnel)"
                className="mt-1 h-11 border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Code postal
                </Label>
                <Input
                  value={formData.codePostal || ""}
                  onChange={(e) => handleChange("codePostal", e.target.value)}
                  placeholder="75001"
                  className="mt-1 h-11 border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 bg-white"
                />
              </div>

              <div data-error={!!errors.ville}>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Ville *
                </Label>
                <Input
                  value={formData.ville || ""}
                  onChange={(e) => handleChange("ville", e.target.value)}
                  placeholder="Paris"
                  className={cn(
                    "mt-1 h-11 border-2 transition-all duration-200 bg-white",
                    errors.ville
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10"
                  )}
                />
                {errors.ville && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.ville}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Justificatif adresse siège */}
            {formData.typeSocial && formData.typeSocial !== "domiciliation" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Justificatif d'adresse du siège *
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#840040]/10 hover:bg-[#840040]/20 transition-colors cursor-help">
                          <Info className="w-3 h-3 text-[#840040]" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm bg-white border-2 border-[#840040]/20 shadow-xl p-4">
                        <p className="text-sm font-semibold text-[#840040] mb-1">
                          Document requis :
                        </p>
                        <p className="text-sm">{getDocumentTooltip()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <label className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#840040] hover:bg-[#840040]/5 cursor-pointer transition-all duration-200 group bg-white">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adressse: e.target.files?.[0] || null,
                      }))
                    }
                  />

                  {/* 1️⃣ Si nouveau fichier sélectionné */}
                  {formData.adressse instanceof File ? (
                    <>
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-700">
                        {formData.adressse.name}
                      </span>
                    </>
                  ) : /* 2️⃣ Si URL existante venant API */
                  typeof formData.adressse === "string" &&
                    formData.adressse !== "" ? (
                    <div className="flex flex-col items-center justify-center text-center gap-2 w-full">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>

                      <span className="text-sm font-semibold text-blue-700">
                        Document existant
                      </span>

                      <div className="flex items-center justify-center gap-3">
                        <a
                          href={formData.adressse}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#840040] underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Consulter
                        </a>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormData((prev) => ({
                              ...prev,
                              adressse: null,
                            }));
                          }}
                          className="text-xs text-white-500 underline w-full"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 3️⃣ Aucun fichier */
                    <>
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#840040]/10 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#840040] transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-[#840040] transition-colors">
                        Cliquez pour téléverser le justificatif
                      </span>
                    </>
                  )}
                </label>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Objet social */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#840040]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="bg-gradient-to-r from-[#840040]/10 via-[#840040]/5 to-transparent relative z-10">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="w-5 h-5 text-[#840040]" />
              </div>
              <span className="text-lg">Objet social</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <div data-error={!!errors.activite}>
              {!formData.activite ? (
                <div className="space-y-3 ">
                  <div className="flex items-center gap-3">
                    <Input
                      value={businessActivityInput}
                      onChange={(e) => setBusinessActivityInput(e.target.value)}
                      placeholder="Ex: conseil en marketing digital, vente de produits bio..."
                      className="flex-1 h-12 border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 bg-white text-base"
                      onKeyDown={(e) =>
                        e.key === "Enter" && generateBusinessActivity()
                      }
                    />
                    <Button
                      type="button"
                      onClick={generateBusinessActivity}
                      disabled={
                        !businessActivityInput.trim() || isGeneratingActivity
                      }
                      className="gap-2 bg-gradient-to-r from-[#840040] to-[#a00050] hover:from-[#6d0035] hover:to-[#840040] shadow-md hover:shadow-lg transition-all duration-200 px-6 h-12 mt-0"
                    >
                      {isGeneratingActivity ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-semibold">Génération...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span className="font-semibold">Générer avec IA</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      <strong>Astuce :</strong> Décrivez simplement votre
                      activité, notre IA rédigera un objet social professionnel
                      et juridiquement conforme.
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4">
                    <Textarea
                      value={formData.activite}
                      onChange={(e) => handleChange("activite", e.target.value)}
                      className={cn(
                        "pr-20 border-emerald-300 bg-white/80 focus:bg-white transition-all",
                        errors.activite && "border-red-300"
                      )}
                      rows={4}
                    />
                    <div className="absolute top-6 right-6 gap-10">
                      <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                        <Check className="w-3 h-3" />
                        Validé
                      </div>
                      <button
                        type="button"
                        variant="ghost"
                        className="text-gray-500 hover:text-[#840040] text-xs "
                        style={{
                          color: "white",
                          fontSize: "0.75rem",
                          width: "100%",
                          marginTop: "10px",
                        }}
                        onClick={() => {
                          handleChange("activite", "");
                          setBusinessActivityInput("");
                        }}
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {errors.activite && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.activite}
                </motion.p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Associés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#840040]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="bg-gradient-to-r from-[#840040]/10 via-[#840040]/5 to-transparent relative z-10">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Users className="w-5 h-5 text-[#840040]" />
                </div>
                <div>
                  <span className="text-lg">Associés</span>
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({associes.length})
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addAssociate("associes")}
                style={{ color: "white" }}
                className="gap-2 border-2 border-[#840040] text-[#840040] hover:bg-[#840040] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="font-semibold">Ajouter</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 relative">
            {errors.associes && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm font-medium text-red-700">
                  {errors.associes}
                </p>
              </motion.div>
            )}

            {associes.map((associate, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 border-2 border-gray-200 rounded-xl space-y-4 relative bg-white hover:shadow-lg hover:border-[#840040]/30 transition-all duration-300 group/card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#840040] to-[#a00050] flex items-center justify-center shadow-md">
                      <span className="text-base font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      Associé {index + 1}
                    </h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    onClick={() => removeAssociate(index)} // <-- juste index
                  >
                    <Trash2 className="w-4 h-4" color="white" />
                  </Button>
                </div>

                {/* Informations de base - Compacte */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div data-error={!!errors[`associate_${index}_nomAssocie`]}>
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Prénom *
                    </Label>
                    <Input
                      value={associate.nomAssocie || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "associes",
                          index,
                          "nomAssocie",
                          e.target.value
                        )
                      }
                      placeholder="Jean"
                      className={cn(
                        "h-9 text-sm border-2 transition-all duration-200",
                        errors[`associate_${index}_nomAssocie`]
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-2 focus:ring-[#840040]/10"
                      )}
                    />
                  </div>

                  <div
                    data-error={!!errors[`associate_${index}_telephoneAssocie`]}
                  >
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Téléphone *
                    </Label>
                    <Input
                      type="tel"
                      value={associate.telephoneAssocie || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "associes",
                          index,
                          "telephoneAssocie",
                          e.target.value
                        )
                      }
                      placeholder="06 12 34 56 78"
                      className={cn(
                        "h-9 text-sm border-2 transition-all duration-200",
                        errors[`associate_${index}_telephoneAssocie`]
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-2 focus:ring-[#840040]/10"
                      )}
                    />
                  </div>

                  <div data-error={!!errors[`associate_${index}_emailAssocie`]}>
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Email *
                    </Label>
                    <Input
                      type="emailAssocie"
                      value={associate.emailAssocie || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "associes",
                          index,
                          "emailAssocie",
                          e.target.value
                        )
                      }
                      placeholder="exemple@email.fr"
                      className={cn(
                        "h-9 text-sm border-2 transition-all duration-200",
                        errors[`associate_${index}_emailAssocie`]
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-2 focus:ring-[#840040]/10"
                      )}
                    />
                  </div>

                  <div data-error={!!errors[`associate_${index}_pourcentage`]}>
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      % capital *
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={associate.pourcentage || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "associes",
                            index,
                            "pourcentage",
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="50"
                        className={cn(
                          "h-9 text-sm border-2 transition-all duration-200 pr-7",
                          errors[`associate_${index}_pourcentage`]
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-2 focus:ring-[#840040]/10"
                        )}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dirigeant */}
                <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Switch
                    className="mt-0"
                    id={`associate-manager-${index}`}
                    checked={associate.dirigeant || false}
                    onCheckedChange={(v) =>
                      handleNestedChange("associes", index, "dirigeant", v)
                    }
                  />
                  <Label
                    htmlFor={`associate-manager-${index}`}
                    className="cursor-pointer text-sm font-medium text-gray-700 flex-1"
                  >
                    Est dirigeant de la société
                  </Label>
                </div>

                {/* Documents */}
                {associate.dirigeant && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t-2 border-gray-100">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        CNI/Passeport
                      </Label>
                      <label className="flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#840040] hover:bg-[#840040]/5 cursor-pointer transition-all duration-200 group bg-white">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleNestedChange(
                              "associes",
                              index,
                              "pieceId",
                              e.target.files?.[0] || null
                            )
                          }
                        />

                        {/* 1️⃣ Nouveau fichier sélectionné */}
                        {associate.pieceId instanceof File ? (
                          <>
                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                              <Check className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-700 text-center break-all">
                              {associate.pieceId.name}
                            </span>
                          </>
                        ) : /* 2️⃣ URL venant API */
                        typeof associate.pieceId === "string" &&
                          associate.pieceId !== "" ? (
                          <div className="flex flex-col items-center justify-center text-center gap-2 w-full">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>

                            <span className="text-[10px] font-semibold text-blue-700">
                              Document existant
                            </span>

                            <div className="flex items-center gap-2">
                              <a
                                href={associate.pieceId}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#840040] underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Consulter
                              </a>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleNestedChange(
                                    "associes",
                                    index,
                                    "pieceId",
                                    null
                                  );
                                }}
                                className="text-[10px] text-white-500 underline w-full"
                              >
                                Modifier
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* 3️⃣ Aucun fichier */
                          <>
                            <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#840040] transition-colors" />
                            <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#840040] transition-colors">
                              Ajouter
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Justif. adresse
                      </Label>
                      <label className="flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#840040] hover:bg-[#840040]/5 cursor-pointer transition-all duration-200 group bg-white">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleNestedChange(
                              "associes",
                              index,
                              "adressePerso",
                              e.target.files?.[0] || null
                            )
                          }
                        />

                        {/* 1️⃣ Nouveau fichier sélectionné */}
                        {associate.adressePerso instanceof File ? (
                          <>
                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                              <Check className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-700 text-center break-all">
                              {associate.adressePerso.name}
                            </span>
                          </>
                        ) : /* 2️⃣ URL venant API */
                        typeof associate.adressePerso === "string" &&
                          associate.adressePerso !== "" ? (
                          <div className="flex flex-col items-center justify-center text-center gap-2 w-full">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>

                            <span className="text-[10px] font-semibold text-blue-700">
                              Document existant
                            </span>

                            <div className="flex items-center gap-2">
                              <a
                                href={associate.adressePerso}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#840040] underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Consulter
                              </a>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleNestedChange(
                                    "associes",
                                    index,
                                    "pieceId",
                                    null
                                  );
                                }}
                                className="text-[10px] text-white-500 underline w-full"
                              >
                                Modifier
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* 3️⃣ Aucun fichier */
                          <>
                            <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#840040] transition-colors" />
                            <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#840040] transition-colors">
                              Ajouter
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Carte vitale
                      </Label>
                      <label className="flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#840040] hover:bg-[#840040]/5 cursor-pointer transition-all duration-200 group bg-white">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleNestedChange(
                              "associes",
                              index,
                              "carteSecurite",
                              e.target.files?.[0] || null
                            )
                          }
                        />

                        {/* 1️⃣ Nouveau fichier sélectionné */}
                        {associate.carteSecurite instanceof File ? (
                          <>
                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                              <Check className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-700 text-center break-all">
                              {associate.carteSecurite.name}
                            </span>
                          </>
                        ) : /* 2️⃣ URL venant API */
                        typeof associate.carteSecurite === "string" &&
                          associate.carteSecurite !== "" ? (
                          <div className="flex flex-col items-center justify-center text-center gap-2 w-full">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>

                            <span className="text-[10px] font-semibold text-blue-700">
                              Document existant
                            </span>

                            <div className="flex items-center gap-2">
                              <a
                                href={associate.carteSecurite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#840040] underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Consulter
                              </a>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleNestedChange(
                                    "associes",
                                    index,
                                    "pieceId",
                                    null
                                  );
                                }}
                                className="text-[10px] text-white-500 underline w-full"
                              >
                                Modifier
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* 3️⃣ Aucun fichier */
                          <>
                            <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#840040] transition-colors" />
                            <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#840040] transition-colors">
                              Ajouter
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Livret famille
                      </Label>
                      <label className="flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#840040] hover:bg-[#840040]/5 cursor-pointer transition-all duration-200 group bg-white">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleNestedChange(
                              "associes",
                              index,
                              "livretFamille",
                              e.target.files?.[0] || null
                            )
                          }
                        />

                        {/* 1️⃣ Nouveau fichier sélectionné */}
                        {associate.livretFamille instanceof File ? (
                          <>
                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                              <Check className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-700 text-center break-all">
                              {associate.livretFamille.name}
                            </span>
                          </>
                        ) : /* 2️⃣ URL venant API */
                        typeof associate.livretFamille === "string" &&
                          associate.livretFamille !== "" ? (
                          <div className="flex flex-col items-center justify-center text-center gap-2 w-full">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>

                            <span className="text-[10px] font-semibold text-blue-700">
                              Document existant
                            </span>

                            <div className="flex items-center gap-2">
                              <a
                                href={associate.livretFamille}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#840040] underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Consulter
                              </a>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleNestedChange(
                                    "associes",
                                    index,
                                    "pieceId",
                                    null
                                  );
                                }}
                                className="text-[10px] text-white-500 underline w-full"
                              >
                                Modifier
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* 3️⃣ Aucun fichier */
                          <>
                            <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#840040] transition-colors" />
                            <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#840040] transition-colors">
                              Ajouter
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {associes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
              >
                <div className="w-16 h-16 bg-[#840040]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#840040]" />
                </div>
                <p className="text-base font-medium text-gray-700 mb-2">
                  Aucun associé ajouté
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Commencez par ajouter les associés de votre société
                </p>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => addItem("associes")}
                  style={{ color: "white" }}
                  className="gap-2 border-2 border-[#840040] text-[#840040] hover:bg-[#840040] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Ajouter un associé</span>
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#840040]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="bg-gradient-to-r from-[#840040]/10 via-[#840040]/5 to-transparent relative">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="w-5 h-5 text-[#840040]" />
              </div>
              <span className="text-lg">Notes ou demandes particulières</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              value={formData.client_notes || ""}
              onChange={(e) => handleChange("client_notes", e.target.value)}
              placeholder="Partagez-nous vos questions, précisions sur votre projet, délais souhaités ou toute information utile..."
              rows={4}
              className="border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 resize-none bg-white"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Clauses avancées */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#840040]/10 transition-all duration-200 bg-gradient-to-r from-[#840040]/10 via-[#840040]/5 to-transparent relative group">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <Settings className="w-5 h-5 text-[#840040]" />
                    </div>
                    <div>
                      <span className="text-lg">Clauses personnalisées</span>
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        (Avancé)
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: advancedOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-[#840040]" />
                  </motion.div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6 pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 font-medium">
                    💡 Souhaitez-vous personnaliser certaines clauses de vos
                    statuts ? Cochez les options qui vous intéressent et ajoutez
                    vos commentaires.
                  </p>
                </div>

                {/* Clauses associés */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                    <div className="w-1 h-6 bg-[#840040] rounded-full" />
                    Clauses relatives aux associés
                  </h4>
                  <div className="space-y-3">
                    {advancedClauses.associates.map((clause) => {
                      const isChecked =
                        !!formData.custom_clauses?.[clause.id]?.enabled;
                      return (
                        <div key={clause.id} className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              className="mt-0"
                              id={clause.id}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newClauses = {
                                  ...(formData.custom_clauses || {}),
                                };
                                newClauses[clause.id] = {
                                  enabled: checked,
                                  comment: newClauses[clause.id]?.comment || "",
                                };
                                handleChange("custom_clauses", newClauses);
                              }}
                            />
                            <div className="flex-1 flex items-center gap-2">
                              <Label
                                htmlFor={clause.id}
                                className="cursor-pointer font-normal"
                              >
                                {clause.label}
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-sm bg-white border-2 border-[#840040]/20 shadow-xl p-4">
                                    <p className="text-sm">{clause.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          {isChecked && (
                            <Textarea
                              placeholder="Précisions ou demandes particulières pour cette clause..."
                              value={
                                formData.custom_clauses?.[clause.id]?.comment ||
                                ""
                              }
                              onChange={(e) => {
                                const newClauses = {
                                  ...(formData.custom_clauses || {}),
                                };
                                newClauses[clause.id] = {
                                  enabled: true,
                                  comment: e.target.value,
                                };
                                handleChange("custom_clauses", newClauses);
                              }}
                              className="ml-7 text-sm"
                              rows={2}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Clauses gouvernance */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                    <div className="w-1 h-6 bg-[#840040] rounded-full" />
                    Clauses relatives à la gouvernance
                  </h4>
                  <div className="space-y-3">
                    {advancedClauses.governance.map((clause) => {
                      const isChecked =
                        formData.custom_clauses?.[clause.id]?.enabled;
                      return (
                        <div key={clause.id} className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              className="mt-0"
                              id={clause.id}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newClauses = {
                                  ...(formData.custom_clauses || {}),
                                };
                                newClauses[clause.id] = {
                                  enabled: checked,
                                  comment: newClauses[clause.id]?.comment || "",
                                };
                                handleChange("custom_clauses", newClauses);
                              }}
                            />
                            <div className="flex-1 flex items-center gap-2">
                              <Label
                                htmlFor={clause.id}
                                className="cursor-pointer font-normal"
                              >
                                {clause.label}
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-sm bg-white border-2 border-[#840040]/20 shadow-xl p-4">
                                    <p className="text-sm">{clause.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          {isChecked && (
                            <Textarea
                              placeholder="Précisions ou demandes particulières pour cette clause..."
                              value={
                                formData.custom_clauses?.[clause.id]?.comment ||
                                ""
                              }
                              onChange={(e) => {
                                const newClauses = {
                                  ...(formData.custom_clauses || {}),
                                };
                                newClauses[clause.id] = {
                                  enabled: true,
                                  comment: e.target.value,
                                };
                                handleChange("custom_clauses", newClauses);
                              }}
                              className="ml-7 text-sm"
                              rows={2}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-end pt-0"
      >
        <Button
          onClick={handleSubmit}
          disabled={loadingSubmit}
          className="gap-3 bg-gradient-to-r from-[#840040] to-[#a00050] hover:from-[#6d0035] hover:to-[#840040] px-12 py-7 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold group relative overflow-hidden"
          size="lg"
          style={{ padding: "30px  150px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          {loadingSubmit ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              <span>Envoyer ma demande</span>
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
