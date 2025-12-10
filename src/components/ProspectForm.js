import React, { useState } from "react";
import "../styles/global.css";
import logo from "../assets/logo.webp";
import "../App.css";
import Offre from "../pages/offre/offre";
import Rdv from "../pages/rdv/rdv";
import Lancement from "../pages/lancement/lancement";
import Status from "../pages/status/status";
import { useEtape } from "../EtatGlobal";

const phrases = [
  "Demandez à notre assistant IA si vous avez besoin d'aide.",
  "Bloqué ? Questionnez notre assistant IA.",
  "Notre assistant IA peut vous guider.",
  "Une question ? L’IA est là pour vous aider.",
];

function ProspectForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { etape, setEtape } = useEtape();
  const [chatOpen, setChatOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setTooltipText(randomPhrase);

      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 15000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* Hamburger menu pour tablettes et mobiles */}
      <div className="topBar">
        <div className="hamburger" onClick={toggleMenu}>
          &#9776;
        </div>
      </div>

      {/* Overlay cliquable */}
      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

      <div className={`navBar ${menuOpen ? "open" : ""}`}>
        <br />
        <p>J'ai un compte &nbsp; {">"}</p>
        <hr style={{ margin: "25px 1px" }} />
        <br />
        <p>Création d'entreprise</p>
        <div className="logoContainer">
          {" "}
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </div>

      <div className="content">
        <br />
        <br />
        <div className="stepper">
          {["Bienvenue", "Information & RDV", "Lancement", "Status"].map(
            (label, index) => (
              <div
                className={`step-item ${etape > index ? "active" : ""}`}
                key={index}
                onClick={() => setEtape(index)}
              >
                <div
                  className={`circle ${etape >= index ? "active" : ""}`}
                ></div>
                <span className="label">{label}</span>
              </div>
            )
          )}
        </div>

        <br />
        <br />

        <div className="display">
          {etape === 0 && <Offre />}
          {etape === 1 && <Rdv />}
          {etape === 2 && <Lancement />}
          {etape === 3 && <Status />}
        </div>
        <br />
        <br />
        <br />
        <div className="chat-button" onClick={() => setChatOpen(!chatOpen)}>
          💬
        </div>
        {showTooltip && <div className="chat-tooltip">{tooltipText}</div>}

        {/* Overlay Chat */}
        <div className={`chat-overlay ${chatOpen ? "open" : ""}`}>
          <div className="chat-header">
            <span>Assistant IA</span>
            <button className="close-chat" onClick={() => setChatOpen(false)}>
              ×
            </button>
          </div>
          <div className="chat-body">
            <p className="placeholder"> Ici il y aura l’IA </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProspectForm;
