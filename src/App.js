import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import ProspectForm from "./components/ProspectForm.js";
import PrivateForm from "./components/PrivateForm.js";
import Mandat from "./pages/Mandat/Mandat.js";
import { EtapeProvider } from "./EtatGlobal";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <EtapeProvider>
                <ProspectForm />
              </EtapeProvider>
            }
          />
          <Route
            path="/private"
            element={
              <EtapeProvider>
                <PrivateForm />
              </EtapeProvider>
            }
          />
          <Route
            path="/private/:id"
            element={
              <EtapeProvider>
                <PrivateForm />
              </EtapeProvider>
            }
          />
          <Route
            path="/customer/mandat"
            element={
              <EtapeProvider>
                <Mandat />
              </EtapeProvider>
            }
          />
          <Route
            path="/customer/mandat/:id"
            element={
              <EtapeProvider>
                <Mandat />
              </EtapeProvider>
            }
          />
          <Route
            path="/:id"
            element={
              <EtapeProvider>
                <ProspectForm />
              </EtapeProvider>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
