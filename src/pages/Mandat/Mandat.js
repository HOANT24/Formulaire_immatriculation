import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import {
  User,
  MapPin,
  Globe,
  CreditCard,
  Calendar,
  FileSignature,
  PenLine,
  Loader2,
} from "lucide-react";

function Mandat() {
  const { id } = useParams();
  const today = new Date().toISOString().split("T")[0];
  const [scanning, setScanning] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    rue: "",
    code_postal: "",
    pays: "",
    rib: "",
    ribDocument: null, // 👈 AJOUT
    dateSignature: today,
    lieu: "",
  });

  const [loading, setLoading] = useState(true); // loading fetch API
  const [signing, setSigning] = useState(false); // loading submit

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://backend-myalfa.vercel.app/api/document/${id}`
        );
        const data = await response.json();

        // On remplit uniquement le nom complet pour l'instant
        setFormData((prev) => ({
          ...prev,
          nom: `${data.prenom} ${data.nom}`,
        }));
      } catch (error) {
        console.error("Erreur fetch document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "ribDocument" && files && files[0]) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        ribDocument: file,
      }));

      // Vérifie si PDF
      if (file.type === "application/pdf") {
        setIsPdf(true);
      } else {
        setIsPdf(false);
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScanRib = async () => {
    if (!formData.ribDocument) return;

    try {
      setScanning(true);

      const formDataUpload = new FormData();
      formDataUpload.append("ribDocument", formData.ribDocument);

      const response = await fetch(
        "https://backend-myalfa.vercel.app/api/extract-rib",
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await response.json();

      if (data.success && data.rib) {
        setFormData((prev) => ({
          ...prev,
          rib: data.rib,
        }));
      } else {
        alert("Aucun IBAN trouvé dans le document.");
      }
    } catch (error) {
      console.error("Erreur scan RIB:", error);
      alert("Erreur lors du scan.");
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSigning(true);

    // Simuler envoi
    setTimeout(() => {
      console.log("Form Data:", formData);
      setSigning(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin mr-2" size={32} />
        <span>Chargement du document...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 lg:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">
          {/* FORMULAIRE */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-white">
            <div className="flex items-center gap-3 mb-8">
              <FileSignature className="text-[#8B1538]" size={32} />
              <h2 className="text-3xl font-bold text-slate-800">
                Signature du Mandat
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nom complet
                </label>
                <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                  <User className="text-slate-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Adresse
                </label>
                <div className=" mb-4 flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                  <MapPin className="text-slate-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="rue"
                    value={formData.rue}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                    placeholder="Numéro de rue"
                  />
                </div>
                <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                  <MapPin className="text-slate-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="code_postal"
                    value={formData.code_postal}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                    placeholder="Code postal et ville"
                  />
                </div>
              </div>

              {/* Pays */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Pays
                </label>
                <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                  <Globe className="text-slate-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                    placeholder="Votre pays"
                  />
                </div>
              </div>

              {/* RIB */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  RIB
                </label>

                {/* Document RIB */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Document RIB ( PDF ou Image )
                  </label>

                  <div className="flex items-center gap-3 mb-4">
                    {/* Input file */}
                    <div className=" m-0 flex items-center border rounded-xl px-3 py-2 flex-1 focus-within:ring-2 focus-within:ring-[#8B1538] transition-all duration-200">
                      <CreditCard className="text-slate-400 mr-2" size={18} />
                      <input
                        type="file"
                        name="ribDocument"
                        accept=".pdf,image/*"
                        onChange={handleChange}
                        required
                        className="w-full outline-none bg-transparent text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 hover:file:bg-slate-200"
                      />
                    </div>

                    {/* Bouton Scan */}
                    <button
                      type="button"
                      onClick={handleScanRib}
                      disabled={!isPdf || scanning}
                      className={`px-5 py-2 rounded-xl m-0 w-1/3 font-semibold transition-all duration-300 whitespace-nowrap ${
                        !isPdf || scanning
                          ? "bg-gray-300 cursor-not-allowed text-white"
                          : "bg-[#8B1538] hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {scanning ? "Scan..." : "Scanner si PDF"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                  <CreditCard className="text-slate-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="rib"
                    value={formData.rib}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                    placeholder="Votre RIB"
                  />
                </div>
              </div>

              {/* Date Signature */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Signé le
                </label>
                <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-100">
                  <Calendar className="text-slate-400 mr-2" size={18} />
                  <input
                    type="date"
                    name="dateSignature"
                    value={formData.dateSignature}
                    disabled
                    className="w-full outline-none bg-transparent cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Lieu */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Lieu
                </label>
                <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                  <PenLine className="text-slate-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="lieu"
                    value={formData.lieu}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                    placeholder="Lieu de signature"
                  />
                </div>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={signing}
                className="w-full bg-[#8B1538] hover:bg-indigo-700 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {signing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <FileSignature size={18} />
                )}
                {signing ? "Envoi..." : "Signer le Mandat"}
              </button>
            </form>
          </div>

          {/* PDF VIEWER */}
          <div className="w-full lg:w-1/2 bg-white mt-10 border-t lg:border-t-0 lg:border-l">
            <div className="relative h-[700px] lg:h-full">
              {/* PDF */}
              <div className="h-full">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl="https://nrcdumqfyl1z2bwl.public.blob.vercel-storage.com/Mandat.pdf" />
                </Worker>
              </div>

              {/* OVERLAY FIELDS */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Nom */}
                <input
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  name="nom"
                  className="
    absolute 
    bg-transparent 
    border 
    bg-red-500/40
    border-[#8B1538]/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.5rem] 
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200

  "
                  style={{
                    top: "21.2%",
                    left: "33%",
                    width: "50%",
                  }}
                />

                {/* Adresse */}
                <input
                  type="text"
                  value={formData.rue}
                  onChange={handleChange}
                  name="rue"
                  className="
    absolute 
    bg-transparent 
    border 
    bg-red-500/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.5rem] 
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                  style={{
                    top: "24%",
                    left: "33%",
                    width: "50%",
                  }}
                />

                <input
                  type="text"
                  value={formData.code_postal}
                  onChange={handleChange}
                  name="code_postal"
                  className="
    absolute 
    bg-transparent 
    border 
    bg-red-500/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.5rem] 
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                  style={{
                    top: "26.5%",
                    left: "33%",
                    width: "50%",
                  }}
                />

                <input
                  type="text"
                  value={formData.pays}
                  onChange={handleChange}
                  name="pays"
                  className="
    absolute 
    bg-transparent 
    border 
    bg-red-500/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.5rem] 
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                  style={{
                    top: "31%",
                    left: "33%",
                    width: "50%",
                  }}
                />

                <input
                  type="text"
                  value={formData.rib}
                  onChange={handleChange}
                  name="rib"
                  className="
    absolute 
    bg-transparent 
    border 
    bg-red-500/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.5rem] 
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                  style={{
                    top: "35.5%",
                    left: "33%",
                    width: "50%",
                  }}
                />

                <input
                  type="text"
                  value={formData.dateSignature}
                  name="dateSignature"
                  className="
    absolute 
    bg-transparent 
    border 
    bg-red-500/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.5rem] 
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                  style={{
                    top: "55.6%",
                    left: "33%",
                    width: "50%",
                  }}
                />

                <input
                  type="text"
                  value={formData.lieu}
                  onChange={handleChange}
                  name="lieu"
                  className="
    absolute 
    bg-transparent 
    border 
    bg-red-500/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.5rem] 
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                  style={{
                    top: "57.5%",
                    left: "33%",
                    width: "50%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mandat;
