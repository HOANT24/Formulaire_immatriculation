import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Loader2 } from "lucide-react";
import SimplifiedForm from "./company-creation/SimplifiedForm";
import { useEtape } from "../EtatGlobal.js";

export default function CompanyCreationSimple() {
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedType = urlParams.get("type");

  const { formData, setFormData } = useEtape();
  const [isLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedType) {
      setFormData((prev) => ({ ...prev, formeSociale: preselectedType }));
    }
  }, [preselectedType, setFormData]);

  const handleDataChange = (newData) => {
    setFormData(newData);
  };

  const handleSubmit = async (finalData) => {
    setIsSubmitting(true);

    console.log("FormData submitted:", finalData);

    try {
      // Simulation d’envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demande enregistrée !
          </h1>

          <p className="text-gray-600 mb-8">
            Votre demande a bien été envoyée. Notre équipe vous recontactera
            rapidement.
          </p>

          <div className="bg-white rounded-xl border p-6 text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Prochaines étapes
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Contact sous 24h</li>
              <li>• Vérification des informations</li>
              <li>• Rédaction des statuts</li>
              <li>• Immatriculation</li>
            </ul>
          </div>

          <p className="text-sm text-gray-500">
            Un email de confirmation sera envoyé à
            <span className="font-medium"> {formData.contact_email}</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-[#840040]/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-8">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696a0410e3ae5ccac40b9b6b/4dd247098_LogoAlfa-PNG-SansCartouche.png"
              alt="Alfa"
              className="h-20"
            />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Votre création d'entreprise
              </h1>
              <p className="text-gray-600">
                Remplissez le formulaire, nous nous occupons du reste
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SimplifiedForm
          data={formData}
          onChange={handleDataChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
}
