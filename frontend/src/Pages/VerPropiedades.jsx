import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ENDPOINTS,
  URL_PUBLICACIONES_APROBADAS,
  URL_CATEGORIAS_LIST,
  URL_PROVINCIAS_LIST,
  URL_DEPARTAMENTOS_LIST,
  URL_MUNICIPIOS_LIST
} from '../Endpoints/endpoint';
import Carousel from 'react-bootstrap/Carousel';

import '../Css/VerPropiedades.css';

const VerPropiedades = () => {
  const navigate = useNavigate();

  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categorias, setCategorias] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const [filtros, setFiltros] = useState({
    categoria: "",
    provincia: "",
    departamento: "",
    municipio: ""
  });

  const fetchPropiedades = useCallback(() => {
    setLoading(true);

    // Use publicaciones aprobadas (estado = aprobada)
    fetch(`${ENDPOINTS}${URL_PUBLICACIONES_APROBADAS}`)
      .then(res => res.json())
      .then(async (data) => {
        for (let p of data) {
          const resImgs = await fetch(`${ENDPOINTS}/api/imagenes?id_publicacion=${p.id_publicacion}`);
          const imgs = await resImgs.json().catch(() => []);
          p.imagenes = Array.isArray(imgs) ? imgs : [];
          p.portada = p.imagenes[0] ? p.imagenes[0].url : "/sin-foto.png";
        }

        let filtered = data;
        
        // Filtrar por categoría
        if (filtros.categoria) {
          filtered = filtered.filter(p => String(p.id_categoria) === String(filtros.categoria));
        }

        // Filtrar por provincia (si está disponible en la propiedad)
        if (filtros.provincia) {
          filtered = filtered.filter(p => String(p.id_provincia) === String(filtros.provincia));
        }

        // Filtrar por departamento
        if (filtros.departamento) {
          filtered = filtered.filter(p => String(p.id_departamento) === String(filtros.departamento));
        }

        // Filtrar por municipio
        if (filtros.municipio) {
          filtered = filtered.filter(p => String(p.id_municipio) === String(filtros.municipio));
        }

        setPropiedades(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener propiedades:", err);
        setLoading(false);
      });
  }, [filtros]);

  useEffect(() => {
    Promise.all([
      fetch(`${ENDPOINTS}${URL_CATEGORIAS_LIST}`).then(r => r.json()),
      fetch(`${ENDPOINTS}${URL_PROVINCIAS_LIST}`).then(r => r.json()),
      fetch(`${ENDPOINTS}${URL_DEPARTAMENTOS_LIST}`).then(r => r.json()),
      fetch(`${ENDPOINTS}${URL_MUNICIPIOS_LIST}`).then(r => r.json()),
    ]).then(([cats, provs, deps, muns]) => {
      setCategorias(cats);
      setProvincias(provs);
      setDepartamentos(deps);
      setMunicipios(muns);
    });

    fetchPropiedades();
  }, [fetchPropiedades]);

  const getDepartamentosByProvincia = () =>
    filtros.provincia
      ? departamentos.filter(d => String(d.id_provincia) === filtros.provincia)
      : [];

  const getMunicipiosByDepartamento = () =>
    filtros.departamento
      ? municipios.filter(m => String(m.id_departamento) === filtros.departamento)
      : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFiltros(prev => {
      const updated = { ...prev, [name]: value };

      if (name === "provincia") {
        updated.departamento = "";
        updated.municipio = "";
      }
      if (name === "departamento") {
        updated.municipio = "";
      }
      return updated;
    });
  };

  return (
    <div className="ver-propiedades-container">

      {/* 🔥 BOTÓN VOLVER 🔥 */}
      <button className="btn-volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h1>Propiedades Disponibles</h1>

      {/* Filtros */}
      <div className="filtros-container">

        <select name="categoria" value={filtros.categoria} onChange={handleChange}>
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option value={c.id_categoria} key={c.id_categoria}>{c.nombre}</option>
          ))}
        </select>

        <select name="provincia" value={filtros.provincia} onChange={handleChange}>
          <option value="">Todas las provincias</option>
          {provincias.map(p => (
            <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
          ))}
        </select>

        <select name="departamento" value={filtros.departamento} onChange={handleChange} disabled={!filtros.provincia}>
          <option value="">Todos los departamentos</option>
          {getDepartamentosByProvincia().map(d => (
            <option key={d.id_departamento} value={d.id_departamento}>{d.nombre}</option>
          ))}
        </select>

        <select name="municipio" value={filtros.municipio} onChange={handleChange} disabled={!filtros.departamento}>
          <option value="">Todos los municipios</option>
          {getMunicipiosByDepartamento().map(m => (
            <option key={m.id_municipio} value={m.id_municipio}>{m.nombre}</option>
          ))}
        </select>

        <button onClick={fetchPropiedades}>Buscar</button>
      </div>

      {/* CARD GRID */}
      <div className="propiedades-grid">
        {loading ? (
          <p>Cargando...</p>
        ) : propiedades.length === 0 ? (
          <p>No hay propiedades con esos filtros.</p>
        ) : (
          propiedades.map((p) => (
              <div className="propiedad-card" key={p.id_publicacion}>
                {p.imagenes && p.imagenes.length > 0 ? (
                  <Carousel variant="dark" className="mini-carousel" interval={3000} indicators={false} controls={p.imagenes.length>1}>
                    {p.imagenes.map(img => (
                      <Carousel.Item key={img.id_imagen}>
                        <img src={img.url} className="propiedad-portada" style={{ height: 200, objectFit: 'cover', borderRadius: 8 }} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <img src={p.portada} className="propiedad-portada" />
                )}

                <h2>{p.titulo}</h2>
                <p className="descripcion">{p.descripcion_inmueble || p.descripcion || ''}</p>

              <Link className="btn-vermas" to={`/propiedad/${p.id_publicacion}`}>
                Ver más →
              </Link>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default VerPropiedades;
