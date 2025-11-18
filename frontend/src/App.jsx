import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import PublicarPropiedad from "./Pages/PublicarPropiedad";
import VerPropiedades from "./Pages/VerPropiedades";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";


// Componentes CRUD
import Ambientes from "./Components/Ambientes";
import Autorizadas from "./Components/Autorizadas";
import Categorias from "./Components/Categorias";
import Citas from "./Components/Citas";
import Clientes from "./Components/Clientes";
import Condiciones from "./Components/Condiciones";
import Departamentos from "./Components/Departamentos";
import Direcciones from "./Components/Direcciones";
import Dormitorios from "./Components/Dormitorios";
import Estacionamientos from "./Components/Estacionamientos";
import Imagenes from "./Components/Imagenes";
import Inmuebles from "./Components/Inmuebles";
import Municipios from "./Components/Municipios";
import Personas from "./Components/Personas";
import Propiedades from "./Components/Propiedades";
import Provincias from "./Components/Provincias";
import Publicaciones from "./Components/Publicaciones";
import Roles from "./Components/Roles";
import Tipoinmuebles from "./Components/Tipoinmuebles";
import Usuarios from "./Components/Usuarios";
import PropiedadDetalle from "./Pages/PropiedadDetalle";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/publicar" element={<PublicarPropiedad />} />
        <Route path="/propiedades" element={<VerPropiedades />} />
        <Route path="/login" element={<Login />} />
        <Route path="/propiedad/:id" element={<PropiedadDetalle />} />


        <Route path="/admin" element={<AdminDashboard />} />


        {/* Rutas administrativas / CRUD */}

        <Route path="/admin/ambientes" element={<Ambientes />} />
        <Route path="/admin/autorizadas" element={<Autorizadas />} />
        <Route path="/admin/categorias" element={<Categorias />} />
        <Route path="/admin/citas" element={<Citas />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/condiciones" element={<Condiciones />} />
        <Route path="/admin/departamentos" element={<Departamentos />} />
        <Route path="/admin/direcciones" element={<Direcciones />} />
        <Route path="/admin/dormitorios" element={<Dormitorios />} />
        <Route path="/admin/estacionamientos" element={<Estacionamientos />} />
        <Route path="/admin/imagenes" element={<Imagenes />} />
        <Route path="/admin/inmuebles" element={<Inmuebles />} />
        <Route path="/admin/municipios" element={<Municipios />} />
        <Route path="/admin/personas" element={<Personas />} />
        <Route path="/admin/propiedades" element={<Propiedades />} />
        <Route path="/admin/provincias" element={<Provincias />} />
        <Route path="/admin/publicaciones" element={<Publicaciones />} />
        <Route path="/admin/roles" element={<Roles />} />
        <Route path="/admin/tipoinmuebles" element={<Tipoinmuebles />} />
        <Route path="/admin/usuarios" element={<Usuarios />} />
      </Routes>
    </Router>
  );
};

export default App;
