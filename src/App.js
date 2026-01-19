import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import ProspectForm from "./components/ProspectForm.js";
import PrivateForm from "./components/PrivateForm.js";
import { EtapeProvider } from "./EtatGlobal";

function App() {
  return (
    <EtapeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ProspectForm />} />
            <Route path="/private" element={<PrivateForm />} />
            <Route path="/:id" element={<ProspectForm />} />
          </Routes>
        </div>
      </Router>
    </EtapeProvider>
  );
}

export default App;
