import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import PublicarPropiedad from "./Pages/PublicarPropiedad";
import VerPropiedades from "./Pages/VerPropiedades";
import Login from "./Pages/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publicar" element={<PublicarPropiedad />} />
        <Route path="/propiedades" element={<VerPropiedades />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;