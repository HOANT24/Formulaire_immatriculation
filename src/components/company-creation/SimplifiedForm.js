import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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

const companyTypes = ["SASU", "SAS", "EURL", "SARL", "SCI", "SNC", "SA"];

const headquartersTypes = [
  { id: "owned", label: "Propriété", doc: "Taxe foncière" },
  {
    id: "rented",
    label: "Location",
    doc: "Facture EDF, eau ou Internet fixe de moins de 3 mois",
  },
  {
    id: "domiciliation",
    label: "Domiciliation",
    doc: "Aucun justificatif nécessaire",
  },
];

const banks = [
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
  "Hello bank!",
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

export default function SimplifiedForm({
  data,
  onChange,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(data);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [businessActivityInput, setBusinessActivityInput] = useState("");
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const generateBusinessActivity = async () => {
    if (!businessActivityInput.trim()) return;

    setIsGeneratingActivity(true);
    try {
      // Ici on simule juste une génération statique
      const result = `Activité simulée pour: "${businessActivityInput}"`;
      console.log("Business activity generated:", result);

      handleChange("business_activity", result);
      setBusinessActivityInput("");
    } catch (error) {
      console.error("Error generating activity:", error);
      setErrors((prev) => ({
        ...prev,
        business_activity: "Erreur lors de la génération",
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
    const addressParts = suggestion.display_name.split(",");
    handleChange("headquarters_address", addressParts[0]?.trim() || "");

    // Try to extract postal code and city
    const fullAddress = suggestion.display_name;
    const postalMatch = fullAddress.match(/\b\d{5}\b/);
    if (postalMatch) {
      handleChange("headquarters_postal_code", postalMatch[0]);
    }

    // Extract city (usually before postal code or after first comma)
    if (addressParts.length > 1) {
      const cityPart = addressParts.find(
        (part) => !part.match(/\d{5}/) && part.trim().length > 2
      );
      if (cityPart) {
        handleChange("headquarters_city", cityPart.trim());
      }
    }

    setAddressSuggestions([]);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (
        formData.headquarters_address &&
        formData.headquarters_address.length >= 3
      ) {
        searchAddress(formData.headquarters_address);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [formData.headquarters_address]);

  const handleNestedChange = (parent, index, field, value) => {
    const newData = { ...formData };
    if (!newData[parent]) newData[parent] = [];
    if (!newData[parent][index]) newData[parent][index] = {};
    newData[parent][index][field] = value;
    setFormData(newData);
    onChange(newData);
  };

  const addItem = (parent) => {
    const newData = { ...formData };
    if (!newData[parent]) newData[parent] = [];
    newData[parent].push({
      first_name: "",
      email: "",
      phone: "",
      capital_percentage: 0,
      is_manager: false,
    });
    setFormData(newData);
    onChange(newData);
  };

  const removeItem = (parent, index) => {
    const newData = { ...formData };
    newData[parent] = newData[parent].filter((_, i) => i !== index);
    setFormData(newData);
    onChange(newData);
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    setUploadingFiles((prev) => ({ ...prev, [field]: true }));
    try {
      // On simule juste une URL de fichier statique
      const file_url = `https://example.com/${file.name}`;
      console.log("File uploaded:", file_url);
      handleChange(field, file_url);
    } catch (error) {
      console.error("Upload error:", error);
      setErrors((prev) => ({ ...prev, [field]: "Erreur lors de l'upload" }));
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.company_type) newErrors.company_type = "Requis";
    if (!formData.company_name?.trim()) newErrors.company_name = "Requis";
    if (!formData.business_activity?.trim())
      newErrors.business_activity = "Requis";
    if (!formData.share_capital || formData.share_capital < 1)
      newErrors.share_capital = "Requis";
    if (!formData.headquarters_address?.trim())
      newErrors.headquarters_address = "Requis";
    if (!formData.headquarters_city?.trim())
      newErrors.headquarters_city = "Requis";
    if (!formData.headquarters_type)
      newErrors.headquarters_type = "Type de domiciliation requis";

    if (!formData.associates?.length) {
      newErrors.associates = "Au moins un associé requis";
    } else {
      formData.associates.forEach((a, i) => {
        if (!a.first_name?.trim())
          newErrors[`associate_${i}_first_name`] = "Requis";
        if (!a.email?.trim()) newErrors[`associate_${i}_email`] = "Requis";
        if (!a.phone?.trim()) newErrors[`associate_${i}_phone`] = "Requis";
        if (!a.capital_percentage || a.capital_percentage <= 0)
          newErrors[`associate_${i}_capital`] = "Requis";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    } else {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const associates = formData.associates || [];

  const getDocumentTooltip = () => {
    const type = headquartersTypes.find(
      (t) => t.id === formData.headquarters_type
    );
    return type ? type.doc : "Sélectionnez un type de domiciliation";
  };

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
            <div data-error={!!errors.company_type}>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Forme juridique *
              </Label>
              <Select
                value={formData.company_type || ""}
                onValueChange={(v) => handleChange("company_type", v)}
              >
                <SelectTrigger
                  className={cn(
                    "mt-1 h-11 border-2 transition-all duration-200 bg-white",
                    errors.company_type
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10"
                  )}
                >
                  <SelectValue placeholder="Sélectionnez la forme juridique..." />
                </SelectTrigger>
                <SelectContent>
                  {companyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_type && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.company_type}
                </p>
              )}
            </div>

            <div data-error={!!errors.company_name}>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Dénomination sociale *
              </Label>
              <Input
                value={formData.company_name || ""}
                onChange={(e) => handleChange("company_name", e.target.value)}
                onFocus={() => setFocusedField("company_name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Entrez le nom officiel de votre société"
                className={cn(
                  "mt-1 h-11 border-2 transition-all duration-200 bg-white",
                  errors.company_name
                    ? "border-red-300 focus:ring-red-100"
                    : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10",
                  focusedField === "company_name" && "shadow-lg"
                )}
              />
              {errors.company_name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.company_name}
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
                value={formData.commercial_name || ""}
                onChange={(e) =>
                  handleChange("commercial_name", e.target.value)
                }
                placeholder="Le nom que vos clients connaîtront (optionnel)"
                className="mt-1 h-11 border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div data-error={!!errors.share_capital}>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Capital social (€) *
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    value={formData.share_capital || ""}
                    onChange={(e) =>
                      handleChange("share_capital", parseFloat(e.target.value))
                    }
                    placeholder="1000"
                    className={cn(
                      "mt-1 h-11 border-2 transition-all duration-200 bg-white pr-8",
                      errors.share_capital
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10"
                    )}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                    €
                  </span>
                </div>
                {errors.share_capital && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.share_capital}
                  </motion.p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Banque
                </Label>
                <Select
                  value={formData.bank || ""}
                  onValueChange={(v) => handleChange("bank", v)}
                >
                  <SelectTrigger className="mt-1 h-11 border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 bg-white">
                    <SelectValue placeholder="Sélectionnez votre banque..." />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <div data-error={!!errors.headquarters_type}>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Type de domiciliation *
              </Label>
              <RadioGroup
                value={formData.headquarters_type || ""}
                onValueChange={(v) => handleChange("headquarters_type", v)}
                className="grid grid-cols-3 gap-3 mt-2"
              >
                {headquartersTypes.map((type) => (
                  <Label
                    key={type.id}
                    htmlFor={type.id}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden group",
                      formData.headquarters_type === type.id
                        ? "border-[#840040] bg-gradient-to-br from-[#840040]/10 to-[#840040]/5 shadow-md"
                        : "border-gray-200 hover:border-[#840040]/40 hover:shadow-sm bg-white"
                    )}
                  >
                    {formData.headquarters_type === type.id && (
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
                        formData.headquarters_type === type.id
                          ? "text-[#840040]"
                          : "text-gray-700"
                      )}
                    >
                      {type.label}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
              {errors.headquarters_type && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.headquarters_type}
                </p>
              )}
            </div>

            <div data-error={!!errors.headquarters_address}>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Adresse *
              </Label>
              <div className="relative mt-1">
                <Input
                  value={formData.headquarters_address || ""}
                  onChange={(e) =>
                    handleChange("headquarters_address", e.target.value)
                  }
                  placeholder="Commencez à saisir votre adresse..."
                  className={cn(
                    "h-11 border-2 transition-all duration-200 bg-white pr-10",
                    errors.headquarters_address
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
              {errors.headquarters_address && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.headquarters_address}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Complément d'adresse
              </Label>
              <Input
                value={formData.headquarters_complement || ""}
                onChange={(e) =>
                  handleChange("headquarters_complement", e.target.value)
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
                  value={formData.headquarters_postal_code || ""}
                  onChange={(e) =>
                    handleChange("headquarters_postal_code", e.target.value)
                  }
                  placeholder="75001"
                  className="mt-1 h-11 border-2 border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10 transition-all duration-200 bg-white"
                />
              </div>

              <div data-error={!!errors.headquarters_city}>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Ville *
                </Label>
                <Input
                  value={formData.headquarters_city || ""}
                  onChange={(e) =>
                    handleChange("headquarters_city", e.target.value)
                  }
                  placeholder="Paris"
                  className={cn(
                    "mt-1 h-11 border-2 transition-all duration-200 bg-white",
                    errors.headquarters_city
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10"
                  )}
                />
                {errors.headquarters_city && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.headquarters_city}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Justificatif adresse siège */}
            {formData.headquarters_type &&
              formData.headquarters_type !== "domiciliation" && (
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
                        handleFileUpload(
                          "headquarters_proof_document",
                          e.target.files?.[0]
                        )
                      }
                      disabled={uploadingFiles.headquarters_proof_document}
                    />
                    {uploadingFiles.headquarters_proof_document ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#840040]" />
                        <span className="text-sm font-medium text-gray-700">
                          Téléversement en cours...
                        </span>
                      </>
                    ) : formData.headquarters_proof_document ? (
                      <>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <Check className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">
                          Document téléversé avec succès
                        </span>
                      </>
                    ) : (
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
            <div data-error={!!errors.business_activity}>
              {!formData.business_activity ? (
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
                      value={formData.business_activity}
                      onChange={(e) =>
                        handleChange("business_activity", e.target.value)
                      }
                      className={cn(
                        "pr-20 border-emerald-300 bg-white/80 focus:bg-white transition-all",
                        errors.business_activity && "border-red-300"
                      )}
                      rows={4}
                    />
                    <div className="absolute top-6 right-6 flex flex-col gap-1">
                      <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                        <Check className="w-3 h-3" />
                        Validé
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-[#840040] text-xs h-6"
                        onClick={() => {
                          handleChange("business_activity", "");
                          setBusinessActivityInput("");
                        }}
                      >
                        Modifier
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              {errors.business_activity && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.business_activity}
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
                    ({associates.length})
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addItem("associates")}
                style={{ color: "white" }}
                className="gap-2 border-2 border-[#840040] text-[#840040] hover:bg-[#840040] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="font-semibold">Ajouter</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 relative">
            {errors.associates && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm font-medium text-red-700">
                  {errors.associates}
                </p>
              </motion.div>
            )}

            {associates.map((associate, index) => (
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
                    onClick={() => removeItem("associates", index)}
                  >
                    <Trash2 className="w-4 h-4" color="white" />
                  </Button>
                </div>

                {/* Informations de base - Compacte */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div data-error={!!errors[`associate_${index}_first_name`]}>
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Prénom *
                    </Label>
                    <Input
                      value={associate.first_name || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "associates",
                          index,
                          "first_name",
                          e.target.value
                        )
                      }
                      placeholder="Jean"
                      className={cn(
                        "h-9 text-sm border-2 transition-all duration-200",
                        errors[`associate_${index}_first_name`]
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-2 focus:ring-[#840040]/10"
                      )}
                    />
                  </div>

                  <div data-error={!!errors[`associate_${index}_phone`]}>
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Téléphone *
                    </Label>
                    <Input
                      type="tel"
                      value={associate.phone || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "associates",
                          index,
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="06 12 34 56 78"
                      className={cn(
                        "h-9 text-sm border-2 transition-all duration-200",
                        errors[`associate_${index}_phone`]
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-2 focus:ring-[#840040]/10"
                      )}
                    />
                  </div>

                  <div data-error={!!errors[`associate_${index}_email`]}>
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Email *
                    </Label>
                    <Input
                      type="email"
                      value={associate.email || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "associates",
                          index,
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="exemple@email.fr"
                      className={cn(
                        "h-9 text-sm border-2 transition-all duration-200",
                        errors[`associate_${index}_email`]
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-2 focus:ring-[#840040]/10"
                      )}
                    />
                  </div>

                  <div data-error={!!errors[`associate_${index}_capital`]}>
                    <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      % capital *
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={associate.capital_percentage || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "associates",
                            index,
                            "capital_percentage",
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="50"
                        className={cn(
                          "h-9 text-sm border-2 transition-all duration-200 pr-7",
                          errors[`associate_${index}_capital`]
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
                    checked={associate.is_manager || false}
                    onCheckedChange={(v) =>
                      handleNestedChange("associates", index, "is_manager", v)
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
                            "associates",
                            index,
                            "id_document_url",
                            e.target.files?.[0]
                          )
                        }
                      />
                      {associate.id_document_url ? (
                        <>
                          <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            Envoyé
                          </span>
                        </>
                      ) : (
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
                            "associates",
                            index,
                            "address_proof_url",
                            e.target.files?.[0]
                          )
                        }
                      />
                      {associate.address_proof_url ? (
                        <>
                          <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            Envoyé
                          </span>
                        </>
                      ) : (
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
                            "associates",
                            index,
                            "vitale_card_url",
                            e.target.files?.[0]
                          )
                        }
                      />
                      {associate.vitale_card_url ? (
                        <>
                          <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            Envoyé
                          </span>
                        </>
                      ) : (
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
                            "associates",
                            index,
                            "family_book_url",
                            e.target.files?.[0]
                          )
                        }
                      />
                      {associate.family_book_url ? (
                        <>
                          <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            Envoyé
                          </span>
                        </>
                      ) : (
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
              </motion.div>
            ))}

            {associates.length === 0 && (
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
                  onClick={() => addItem("associates")}
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
                                  <TooltipContent className="max-w-xs">
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
                                  <TooltipContent className="max-w-xs">
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
          disabled={isSubmitting}
          className="gap-3 bg-gradient-to-r from-[#840040] to-[#a00050] hover:from-[#6d0035] hover:to-[#840040] px-12 py-7 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold group relative overflow-hidden"
          size="lg"
          style={{ padding: "30px  150px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          {isSubmitting ? (
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
