import React, { useState } from "react";
import "../styles/global.css";
import logo from "../assets/logo.webp";
import "../App.css";
import Offre from "../pages/offre/offre";
import Rdv from "../pages/rdv/rdv";
import Lancement from "../pages/lancement/lancement";
import Status from "../pages/status/status";
import { useEtape } from "../EtatGlobal";

function ProspectForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { etape, setEtape } = useEtape();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
        <p>Jonathan Rantsa</p>
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
          {["Offre & devis", "Information & RDV", "Lancement", "Status"].map(
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
      </div>
    </div>
  );
}

export default ProspectForm;
