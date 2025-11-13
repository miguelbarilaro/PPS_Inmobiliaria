import React, { useState, useEffect } from "react";
import { ENDPOINTS, URL_INMUEBLE, URL_CATEGORIAS_LIST, URL_CONDICIONES_LIST, URL_PROVINCIAS_LIST, URL_DEPARTAMENTOS_LIST, URL_MUNICIPIOS_LIST } from '../Endpoints/endpoint';


const PublicarPropiedad = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    ambientes: "",
    dormitorios: "",
    provincia: "",
    municipio: "",
    condicion: "",
    categoria: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map formData to the fields expected by crearInmueble in Backend/Controllers/Inmuebles.js
    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      pileta: false,
      terraza: false,
      id_categoria: formData.categoria ? Number(formData.categoria) : null,
      id_autorizada: null,
      id_tipo_inmueble: null,
      id_ambiente: null,
      id_dormitorio: null,
      id_condicion: formData.condicion ? Number(formData.condicion) : null,
      id_estacionamiento: null,
      id_direccion: null,
      id_cliente: null,
    };

    fetch(ENDPOINTS + URL_INMUEBLE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        alert("✅ Propiedad publicada exitosamente (ID: " + data.id + ")");
        console.log("Respuesta del servidor:", data);
        // Limpiar el formulario
        setFormData({
          titulo: "",
          descripcion: "",
          precio: "",
          ambientes: "",
          dormitorios: "",
          provincia: "",
          municipio: "",
          condicion: "",
          categoria: "",
        });
      })
      .catch((error) => {
        alert("❌ Error al publicar: " + error.message);
        console.error("Error al enviar los datos:", error);
      });
  };

  useEffect(() => {
    // cargar listas necesarias para selects
    fetch(ENDPOINTS + URL_CATEGORIAS_LIST).then(r => r.json()).then(setCategorias).catch(err => console.error(err));
    fetch(ENDPOINTS + URL_CONDICIONES_LIST).then(r => r.json()).then(setCondiciones).catch(err => console.error(err));
    fetch(ENDPOINTS + URL_PROVINCIAS_LIST).then(r => r.json()).then(setProvincias).catch(err => console.error(err));
    fetch(ENDPOINTS + URL_DEPARTAMENTOS_LIST).then(r => r.json()).then(setDepartamentos).catch(err => console.error(err));
    fetch(ENDPOINTS + URL_MUNICIPIOS_LIST).then(r => r.json()).then(setMunicipios).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Publicar Propiedad</h1>
      <form onSubmit={handleSubmit}>
        <input name="titulo" placeholder="Título" onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} required />
        <input name="precio" placeholder="Precio" type="number" onChange={handleChange} required />
        <input name="ambientes" placeholder="Ambientes" type="number" onChange={handleChange} required />
        <input name="dormitorios" placeholder="Dormitorios" type="number" onChange={handleChange} required />
        <label>
          Categoría
          <select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">Seleccionar categoría</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          Provincia
          <select name="provincia" value={formData.provincia} onChange={handleChange} required>
            <option value="">Seleccionar provincia</option>
            {provincias.map(p => (
              <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          Municipio
          <select name="municipio" value={formData.municipio} onChange={handleChange} required disabled={!formData.provincia}>
            <option value="">Seleccionar municipio</option>
            {(() => {
              const deptIds = departamentos.filter(d => Number(d.id_provincia) === Number(formData.provincia)).map(d => d.id_departamento);
              const visibles = municipios.filter(m => deptIds.includes(m.id_departamento));
              return visibles.map(m => (
                <option key={m.id_municipio} value={m.id_municipio}>{m.nombre}</option>
              ));
            })()}
          </select>
        </label>

        <label>
          Condición
          <select name="condicion" value={formData.condicion} onChange={handleChange} required>
            <option value="">Seleccionar condición</option>
            {condiciones.map(c => (
              <option key={c.id_condicion} value={c.id_condicion}>{c.estado}</option>
            ))}
          </select>
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default PublicarPropiedad;