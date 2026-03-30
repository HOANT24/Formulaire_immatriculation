import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { Helmet } from "react-helmet-async";

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
  const [ribMessage, setRibMessage] = useState("");
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0"); // HH
  const minutes = String(now.getMinutes()).padStart(2, "0"); // mm
  const currentTime = `${hours}:${minutes}`; // HH:mm
  const [signingLink, setSigningLink] = useState(null);

  const [formData, setFormData] = useState({
    rum: "",
    nom: "",
    email: "",
    rue: "",
    code_postal: "",
    pays: "",
    bic: "",
    rib: "",
    ribDocument: null, // 👈 AJOUT
    dateSignature: today,
    heureSignature: currentTime,
    lieu: "",
  });

  console.log("pdf", isPdf);

  const [loading, setLoading] = useState(true); // loading fetch API
  const [signing, setSigning] = useState(false); // loading submit

  const generateDate = () => {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}${month}${year}`;
  };

  useEffect(() => {
    const generateRum = async () => {
      try {
        const response = await fetch(
          "https://backend-myalfa.vercel.app/api/mandats/last"
        );
        const data = await response.json();

        const nextNumber = String(data.nextNumber).padStart(6, "0");

        const rumGenerated = `REF${generateDate()}${nextNumber}`;

        setFormData((prev) => ({
          ...prev,
          rum: rumGenerated,
        }));
      } catch (error) {
        console.error("Erreur génération RUM :", error);
      }
    };

    generateRum();
  }, []);

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
          nom: `${data.emailSubject.split(" - ")[0] || ""}`, // extraction du nom depuis emailSubject
          email: data.email, // si tu as l'email client remplace ici
        }));
      } catch (error) {
        console.error("Erreur fetch document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const scanRibAutomatically = async (file) => {
    try {
      setScanning(true);
      setRibMessage("");

      const formDataUpload = new FormData();
      formDataUpload.append("ribDocument", file);

      const response = await fetch(
        "https://backend-myalfa.vercel.app/api/extract-rib",
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await response.json();

      const ribValide = data.rib && data.rib.trim() !== "";
      const bicValide = data.bic && data.bic.trim() !== "";

      if (ribValide && bicValide) {
        setFormData((prev) => ({
          ...prev,
          rib: data.rib,
          bic: data.bic,
        }));

        setRibMessage(
          "Veuillez vérifier les informations récupérées avant de signer"
        );
      } else if (!ribValide && !bicValide) {
        setRibMessage(
          "Les informations n'ont pu être récupérées.\nMerci de saisir ci-dessous l'IBAN et le code BIC."
        );
      } else if (!ribValide) {
        setRibMessage(
          "L'IBAN n'a pas pu être récupéré.\nMerci de le saisir ci-dessous."
        );
      } else if (!bicValide) {
        setRibMessage(
          "Le code BIC n'a pas pu être récupéré.\nMerci de le saisir ci-dessous."
        );
      }
    } catch (error) {
      console.error("Erreur scan RIB:", error);

      setRibMessage(
        "Les informations n'ont pu être récupérées.\nMerci de saisir ci-dessous l'IBAN et le code BIC."
      );
    } finally {
      setScanning(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "ribDocument" && files && files[0]) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        ribDocument: file,
      }));

      if (file.type === "application/pdf") {
        setIsPdf(true);

        // Scan automatique
        scanRibAutomatically(file);
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

  const formatDateFR = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSigning(true);

      // 1️⃣ Charger le template Word depuis /public
      const response = await fetch("/Mandat.docx");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier Word");
      }

      const arrayBuffer = await response.arrayBuffer();

      // 2️⃣ Charger le zip
      const zip = new PizZip(arrayBuffer);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // 3️⃣ Remplir les variables avec formData
      doc.render({
        ...formData,
        dateSignature: formatDateFR(formData.dateSignature),
      });

      // 4️⃣ Générer le Word rempli
      const output = doc.getZip().generate({ type: "blob" });

      // 5️⃣ Préparer l'envoi à l'API
      const formDataToSend = new FormData();
      formDataToSend.append("file", output, "Mandat.docx");

      // 6️⃣ Envoyer à l'API pour conversion PDF
      const uploadResponse = await fetch(
        "https://backend-myalfa.vercel.app/api/upload",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Erreur lors de l'envoi du fichier ");
      }

      // 7️⃣ Récupération de l'URL du PDF
      const { pdfUrl } = await uploadResponse.json();

      // 6️⃣ Préparer le FormData pour DocuSign
      const payloadFormData = new FormData();
      payloadFormData.append("pdfUrl", pdfUrl);
      payloadFormData.append(
        "emailSubject",
        `Signature du mandat - ${formData.nom}`
      );
      payloadFormData.append("leadId", parseInt(id));
      payloadFormData.append("clientId", null);
      payloadFormData.append("rum", formData.rum);
      payloadFormData.append("nom", formData.nom);
      payloadFormData.append("rue", formData.rue);
      payloadFormData.append("code_postal", formData.code_postal);
      payloadFormData.append("pays", formData.pays);
      payloadFormData.append("bic", formData.bic);
      payloadFormData.append("rib", formData.rib);
      payloadFormData.append("dateSignature", formData.dateSignature);
      payloadFormData.append("lieu", formData.lieu);
      payloadFormData.append(
        "signers",
        JSON.stringify([
          {
            name: formData.nom,
            email: formData.email,
            signatures: [{ pageNumber: 1, xPosition: 150, yPosition: 625 }],
          },
        ])
      );

      // 7️⃣ Ajouter le fichier RIB si présent
      if (formData.ribDocument) {
        payloadFormData.append("document", formData.ribDocument);
      }

      const signResponse = await fetch(
        "https://backend-myalfa.vercel.app/api/mandat/send",
        { method: "POST", body: payloadFormData } // FormData gère multipart/form-data automatiquement
      );

      const signData = await signResponse.json();

      if (signData.signingLinks && signData.signingLinks.length > 0) {
        const url = signData.signingLinks[0].url;

        setSigningLink(url);

        // redirection immédiate
        window.location.href = url;

        console.log("URL de signature DocuSign :", signingLink);
      }
    } catch (error) {
      console.error("Erreur génération mandat:", error);
      alert("Une erreur est survenue : " + error.message);
    } finally {
      setSigning(false);
    }
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
    <>
      <Helmet>
        <title>Mandat - Alfa Comptabilité</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 lg:p-10 relative">
        {/* Logo */}
        <img
          src="https://nrcdumqfyl1z2bwl.public.blob.vercel-storage.com/4dd247098_LogoAlfa-PNG-SansCartouche.png"
          alt="Logo Alfa"
          className="hidden lg:block absolute top-[5%] left-[4%] w-28 h-auto"
        />
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
                    Nom complet ( {formData.email} )
                  </label>
                  <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                    <User className="text-slate-400 mr-2" size={18} />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full outline-none "
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
                      className="w-full outline-none "
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
                      className="w-full outline-none "
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
                      className="w-full outline-none "
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
                    <div className="flex items-center gap-3 mb-4">
                      {/* Input file */}
                      <div className=" m-0 flex items-center border rounded-xl px-3 py-2 flex-1 focus-within:ring-2 focus-within:ring-[#8B1538] transition-all duration-200">
                        <CreditCard className="text-slate-400 mr-2" size={18} />
                        <input
                          type="file"
                          name="ribDocument"
                          accept=".pdf,image/*"
                          onChange={handleChange}
                          className="w-full outline-none  text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 hover:file:bg-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                  {scanning && (
                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Analyse du document...
                    </p>
                  )}
                  {ribMessage && (
                    <p className="text-sm mt-2 mb-2 text-slate-600 whitespace-pre-line">
                      {ribMessage}
                    </p>
                  )}
                  <div className="flex items-center w-full mb-4">
                    <p className="w-1/6 text-slate-400">IBAN : </p>
                    <div className="w-full flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                      <CreditCard className="text-slate-400 mr-2" size={18} />
                      <input
                        type="text"
                        name="rib"
                        value={formData.rib}
                        onChange={handleChange}
                        required
                        className="w-full outline-none "
                        placeholder="Votre RIB"
                      />
                    </div>
                  </div>
                  <div className="flex items-center w-full">
                    <p className="w-1/6 text-slate-400">BIC : </p>
                    <div className="w-full flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B1538]">
                      <CreditCard className="text-slate-400 mr-2" size={18} />
                      <input
                        type="text"
                        name="bic"
                        value={formData.bic}
                        onChange={handleChange}
                        required
                        className="w-full outline-none "
                        placeholder="Code BIC"
                      />
                    </div>
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
                      className="w-full outline-none  cursor-not-allowed"
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
                      className="w-full outline-none "
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
                  {signing ? "Création du Mandat..." : "Signer le Mandat"}
                </button>
                {/* {pdfUrl && ( */}
              </form>
            </div>

            {/* PDF VIEWER */}
            <div className="relative w-full lg:w-1/2 mt-2 border lg:border-l">
              <div className="relative w-full lg:aspect-[210/297]">
                {" "}
                {/* ratio A4 */}
                {/* PDF */}
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl="https://nrcdumqfyl1z2bwl.public.blob.vercel-storage.com/Mandat0503.pdf" />
                </Worker>
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
     
    border 
    bg-red-500/20
    border-[#8B1538]/40
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.2rem] sm:text-[0.5rem]   
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200

  "
                    style={{
                      top: window.innerWidth < 640 ? "27%" : "21%", // mobile <640px
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
     
    border 
    bg-red-500/20
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.2rem] sm:text-[0.5rem]   
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                    style={{
                      top: window.innerWidth < 640 ? "30%" : "23.5%", // mobile <640px
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
     
    border 
    bg-red-500/20
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.2rem] sm:text-[0.5rem]   
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                    style={{
                      top: window.innerWidth < 640 ? "33.5%" : "26%", // mobile <640px
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
     
    border 
    bg-red-500/20
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.2rem] sm:text-[0.5rem]     
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                    style={{
                      top: window.innerWidth < 640 ? "38.5%" : "30%", // mobile <640px
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
     
    border 
    bg-red-500/20
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.2rem] sm:text-[0.5rem]     
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                    style={{
                      top: window.innerWidth < 640 ? "43%" : "33.6%", // mobile <640px
                      left: "33%",
                      width: "50%",
                    }}
                  />

                  <input
                    type="text"
                    value={formData.bic}
                    onChange={handleChange}
                    name="bic"
                    className="
    absolute 
     
    border 
    bg-red-500/20
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.2rem] sm:text-[0.5rem]     
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                    style={{
                      top: window.innerWidth < 640 ? "45%" : "35.5%", // mobile <640px
                      left: "33%",
                      width: "50%",
                    }}
                  />

                  <input
                    type="text"
                    value={formatDateFR(formData.dateSignature)}
                    name="dateSignature"
                    className="
    absolute 
     
    border 
    bg-red-500/20
    focus:border-[#8B1538]
    focus:outline-none
    text-[0.2rem] sm:text-[0.5rem]     
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
  "
                    style={{
                      top: window.innerWidth < 640 ? "69%" : "54.6%", // mobile <640px
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
    border 
    bg-red-500/20
    focus:border-[#8B1538]
    focus:outline-none
    font-bold
    text-slate-800
    pointer-events-auto
    transition-all
    duration-200
    text-[0.2rem] sm:text-[0.5rem]     
  "
                    style={{
                      top: window.innerWidth < 640 ? "71.5%" : "56.5%", // mobile <640px
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
    </>
  );
}

export default Mandat;
