import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import ProspectForm from "./components/ProspectForm.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route sans ID */}
          <Route path="/" element={<ProspectForm />} />

          {/* Route avec un ID en paramètre */}
          <Route path="/:id" element={<ProspectForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
