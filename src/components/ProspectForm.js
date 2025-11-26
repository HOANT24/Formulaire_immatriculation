import React, { useState } from "react";
import "../styles/global.css";
import logo from "../assets/logo.webp";
import "../App.css";

function ProspectForm() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <p>Profile</p>
        <br />
        <br />
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
        <div>
          <p>Liste des étapes</p>
        </div>
        <br />
        <br />
        <br />
        <div className="display">
          <p>test</p>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default ProspectForm;
