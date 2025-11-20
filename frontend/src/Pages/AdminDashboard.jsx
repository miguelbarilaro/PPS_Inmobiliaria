import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  ENDPOINTS,
  URL_PUBLICACIONES_PENDIENTES,
  URL_PUBLICACION_APROBAR,
  URL_PUBLICACION_RECHAZAR,
  URL_INMUEBLES_LIST
} from "../Endpoints/endpoint";

import "../Css/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [pendientes, setPendientes] = useState([]);
  const [allInmuebles, setAllInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const datos = localStorage.getItem("usuario");
    if (!datos) return navigate("/login");

    const user = JSON.parse(datos);
    if (user.rol !== "admin") navigate("/login");
  }, [navigate]);

  const cargarPendientes = () => {
    fetch(ENDPOINTS + URL_PUBLICACIONES_PENDIENTES)
      .then((res) => res.json())
      .then((data) => {
        setPendientes(data);
        setLoading(false);
      });
  };

  const cargarInmuebles = () => {
    fetch(ENDPOINTS + URL_INMUEBLES_LIST)
      .then((res) => res.json())
      .then((data) => setAllInmuebles(data));
  };

  useEffect(() => {
    cargarPendientes();
    cargarInmuebles();
  }, []);

  const aprobar = (idPublicacion) => {
    fetch(ENDPOINTS + URL_PUBLICACION_APROBAR(idPublicacion), { method: "PATCH" })
      .then(() => cargarPendientes())
      .catch(err => console.error('Error al aprobar publicación:', err));
  };

  const rechazar = (idPublicacion) => {
    fetch(ENDPOINTS + URL_PUBLICACION_RECHAZAR(idPublicacion), { method: "DELETE" })
      .then(() => cargarPendientes())
      .catch(err => console.error('Error al rechazar publicación:', err));
  };

  return (
    <div className="admin-dashboard-wrapper">

      {/* 🔵 BARRA SUPERIOR */}
      <header className="admin-header">
        <h1>Panel Administrativo</h1>

        <div className="header-user">
          <i className="fas fa-user-shield"></i>
          <span>Admin</span>
          <button className="logout-btn" onClick={() => { 
            localStorage.removeItem("usuario");
            navigate("/");
          }}>
            Salir
          </button>
        </div>
      </header>

      <div className="admin-layout">
        
        {/* 🔵 SIDEBAR */}
          <div className="admin-sidebar">
          <h2>Menú</h2>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/publicaciones">CRUD Publicaciones</Link>
          <Link to="/">Volver al Inicio</Link>
        </div>

        {/* 🔵 CONTENIDO */}
        <div className="admin-content">

          {/* 🔥 TARJETAS DE MÉTRICAS */}
          <div className="admin-stats">

            <div className="stat-card pending">
              <h3>{pendientes.length}</h3>
              <p>Pendientes</p>
            </div>

            <div className="stat-card approved">
              <h3>{allInmuebles.length}</h3>
              <p>Inmuebles totales</p>
            </div>

            <div className="stat-card users">
              <h3>1</h3>
              <p>Administradores</p>
            </div>

            <div className="stat-card views">
              <h3>+320</h3>
              <p>Visitas del sitio</p>
            </div>

          </div>

          <h2 className="sub-title">Publicaciones Pendientes</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : pendientes.length === 0 ? (
            <p className="no-data">No hay publicaciones pendientes.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Inmueble</th>
                  <th>Título</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {pendientes.map((p) => (
                  <tr key={p.id_publicacion}>
                    <td>{p.id_publicacion}</td>
                    <td>{p.titulo_inmueble || p.titulo || "—"}</td>
                    <td>{p.titulo || "—"}</td>
                    <td>${p.precio || "—"}</td>
                    <td>{p.categoria_inmueble || "—"}</td>
                    <td>{p.tipo_inmueble || "—"}</td>

                    <td className="actions-cell">
                      <button className="btn-preview" onClick={() => setPreviewData(p)}>Ver</button>
                      <button className="btn-edit" onClick={() => navigate(`/admin/publicaciones/editar/${p.id_publicacion}`)}>Editar</button>
                      <button className="btn-approve" onClick={() => aprobar(p.id_publicacion)}>Aprobar</button>
                      <button className="btn-reject" onClick={() => rechazar(p.id_publicacion)}>Rechazar</button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>
      </div>

      {/* 🔥 MODAL DE PREVIEW */}
      {previewData && (
        <div className="preview-modal">
          <div className="preview-window">
            <h2>{previewData.titulo}</h2>

            <p><strong>Precio:</strong> ${previewData.precio || "—"}</p>
            <p><strong>Categoría:</strong> {previewData.categoria_inmueble || "—"}</p>
            <p><strong>Tipo:</strong> {previewData.tipo_inmueble || "—"}</p>
            <p><strong>Estado:</strong> {previewData.estado}</p>

            <div className="modal-actions">
              <button onClick={() => setPreviewData(null)}>Cerrar</button>
              <button onClick={() => { navigate(`/admin/publicaciones/editar/${previewData.id_publicacion}`); setPreviewData(null); }}>Editar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
