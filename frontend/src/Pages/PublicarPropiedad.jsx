import React, { useState, useEffect } from "react";
import "../Css/PublicarPropiedad.css";
import * as API from "../Endpoints/endpoint";
import { useNavigate } from "react-router-dom";

const PublicarPropiedad = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Publicaciones
    precio: "",
    titulo: "",
    servicios: "",
    
    // Inmuebles
    descripcion: "",
    pileta: false,
    terraza: false,
    id_categoria: "",
    id_tipo_inmueble: "",
    id_ambiente: "",
    id_dormitorio: "",
    id_condicion: "",
    id_estacionamiento: "",
    
    // Direcciones
    calle: "",
    numero: "",
    ubicacion: "",
    observaciones: "",
    provincia: "",
    departamento: "",
    municipio: "",
    
    // Imagenes
    imagenes: []
  });

  const [categorias, setCategorias] = useState([]);
  const [tiposInmuebles, setTiposInmuebles] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [dormitorios, setDormitorios] = useState([]);
  const [estacionamientos, setEstacionamientos] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "imagenes") {
      const files = Array.from(e.target.files || []);
      if (files.length > 10) {
        alert('Solo puede subir un máximo de 10 imágenes. Se tomarán las primeras 10.');
      }
      const selected = files.slice(0, 10);
      setFormData({ ...formData, imagenes: selected });
      return;
    }

    // Campos booleanos
    if (name === "pileta" || name === "terraza") {
      value = e.target.checked;
      setFormData({ ...formData, [name]: value });
      return;
    }

    // Campos numéricos o IDs
    const numericFields = ["provincia", "departamento", "municipio", "id_categoria", "id_tipo_inmueble", "id_ambiente", "id_dormitorio", "id_condicion", "id_estacionamiento", "precio"];
    if (numericFields.includes(name)) value = Number(value);

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 0 — Crear dirección
      const resDir = await fetch(API.ENDPOINTS + API.URL_DIRECCION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_municipio: Number(formData.municipio),
          calle: formData.calle,
          numero: formData.numero,
          ubicacion: formData.ubicacion,
          observaciones: formData.observaciones
        })
      });

      const direccion = await resDir.json();
      const idDireccion = direccion.id || direccion.id_direccion;

      // 1 — Crear inmueble
      const resInm = await fetch(API.ENDPOINTS + API.URL_INMUEBLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          pileta: formData.pileta ? 1 : 0,
          terraza: formData.terraza ? 1 : 0,
          id_categoria: Number(formData.id_categoria),
          id_tipo_inmueble: formData.id_tipo_inmueble ? Number(formData.id_tipo_inmueble) : undefined,
          id_ambiente: formData.id_ambiente ? Number(formData.id_ambiente) : undefined,
          id_dormitorio: formData.id_dormitorio ? Number(formData.id_dormitorio) : undefined,
          id_condicion: formData.id_condicion ? Number(formData.id_condicion) : undefined,
          id_estacionamiento: formData.id_estacionamiento ? Number(formData.id_estacionamiento) : undefined,
          id_direccion: idDireccion
        })
      });

      const inmueble = await resInm.json();

      // 2 — Crear publicación
      const resPub = await fetch(API.ENDPOINTS + API.URL_PUBLICACION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          precio: formData.precio,
          titulo: formData.titulo,
          servicios: formData.servicios,
          id_inmueble: inmueble.id || inmueble.id_inmueble
        })
      });

      const publicacion = await resPub.json();
      const idPub = publicacion.id_publicacion || publicacion.id;

      // 3 — Subir imágenes
      if (formData.imagenes && formData.imagenes.length > 0) {
        const formImg = new FormData();
        const filesToUpload = formData.imagenes.slice(0, 10);
        for (let img of filesToUpload) formImg.append("imagenes", img);

        const uploadRes = await fetch(API.ENDPOINTS + "/api/upload", {
          method: "POST",
          body: formImg
        });

        const uploaded = await uploadRes.json();

        let orden = 1;
        for (let file of (uploaded.files || [])) {
          await fetch(API.ENDPOINTS + API.URL_IMAGEN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: file.nombre,
              url: file.url,
              orden: orden++,
              id_publicacion: idPub
            })
          });
        }
      }

      alert("Propiedad cargada correctamente ✔");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Error al cargar propiedad.");
    }
  };

  useEffect(() => {
    Promise.all([
      fetch(API.ENDPOINTS + API.URL_CATEGORIAS_LIST).then(r => r.json()).then(setCategorias),
      fetch(API.ENDPOINTS + API.URL_TIPOINMUEBLES_LIST).then(r => r.json()).then(setTiposInmuebles).catch(() => setTiposInmuebles([])),
      fetch(API.ENDPOINTS + API.URL_AMBIENTES_LIST).then(r => r.json()).then(setAmbientes).catch(() => setAmbientes([])),
      fetch(API.ENDPOINTS + API.URL_DORMITORIOS_LIST).then(r => r.json()).then(setDormitorios).catch(() => setDormitorios([])),
      fetch(API.ENDPOINTS + API.URL_ESTACIONAMIENTOS_LIST).then(r => r.json()).then(setEstacionamientos).catch(() => setEstacionamientos([])),
      fetch(API.ENDPOINTS + API.URL_CONDICIONES_LIST).then(r => r.json()).then(setCondiciones),
      fetch(API.ENDPOINTS + API.URL_PROVINCIAS_LIST).then(r => r.json()).then(setProvincias),
      fetch(API.ENDPOINTS + API.URL_DEPARTAMENTOS_LIST).then(r => r.json()).then(setDepartamentos),
      fetch(API.ENDPOINTS + API.URL_MUNICIPIOS_LIST).then(r => r.json()).then(setMunicipios)
    ]).catch(err => console.error("Error al cargar datos:", err));
  }, []);

  const getDepartamentosByProvincia = () =>
    formData.provincia
      ? departamentos.filter(d => Number(d.id_provincia) === Number(formData.provincia))
      : [];

  const getMunicipiosByDepartamento = () =>
    formData.departamento
      ? municipios.filter(m => Number(m.id_departamento) === Number(formData.departamento))
      : [];

  return (
    <div className="publicar-page">

      <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>

      <div className="publicar-container">
        <h1>Publicar Propiedad</h1>

        <form className="publicar-form" onSubmit={handleSubmit}>
          
          {/* ========== PUBLICACIÓN ========== */}
          <fieldset>
            <legend>Datos de la Publicación</legend>
            <input name="titulo" placeholder="Título de la propiedad" value={formData.titulo} onChange={handleChange} required />
            <textarea name="descripcion" placeholder="Descripción de la propiedad" value={formData.descripcion} onChange={handleChange} required></textarea>
            <input name="precio" type="number" placeholder="Precio" value={formData.precio} onChange={handleChange} required />
            <input name="servicios" placeholder="Servicios (opcional)" value={formData.servicios} onChange={handleChange} />
          </fieldset>

          {/* ========== INMUEBLE ========== */}
          <fieldset>
            <legend>Características del Inmueble</legend>
            
            <select name="id_categoria" value={formData.id_categoria} onChange={handleChange} required>
              <option value="">Seleccionar categoría</option>
              {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
            </select>

            <select name="id_tipo_inmueble" value={formData.id_tipo_inmueble} onChange={handleChange}>
              <option value="">Tipo de inmueble</option>
              {tiposInmuebles.map(t => <option key={t.id_tipo_inmueble} value={t.id_tipo_inmueble}>{t.tipo_inmueble}</option>)}
            </select>

            <select name="id_condicion" value={formData.id_condicion} onChange={handleChange}>
              <option value="">Seleccionar condición</option>
              {condiciones.map(c => <option key={c.id_condicion} value={c.id_condicion}>{c.estado}</option>)}
            </select>

            <select name="id_ambiente" value={formData.id_ambiente} onChange={handleChange}>
              <option value="">Cantidad de ambientes</option>
              {ambientes.map(a => <option key={a.id_ambiente} value={a.id_ambiente}>{a.numero}</option>)}
            </select>

            <select name="id_dormitorio" value={formData.id_dormitorio} onChange={handleChange}>
              <option value="">Cantidad de dormitorios</option>
              {dormitorios.map(d => <option key={d.id_dormitorio} value={d.id_dormitorio}>{d.numero}</option>)}
            </select>

            <select name="id_estacionamiento" value={formData.id_estacionamiento} onChange={handleChange}>
              <option value="">Estacionamiento</option>
              {estacionamientos.map(e => <option key={e.id_estacionamiento} value={e.id_estacionamiento}>{e.numero} - {e.entrada_exclusiva}</option>)}
            </select>

            <label>
              <input type="checkbox" name="pileta" checked={formData.pileta} onChange={handleChange} />
              ¿Tiene pileta?
            </label>

            <label>
              <input type="checkbox" name="terraza" checked={formData.terraza} onChange={handleChange} />
              ¿Tiene terraza?
            </label>
          </fieldset>

          {/* ========== DIRECCIÓN ========== */}
          <fieldset>
            <legend>Ubicación</legend>
            
            <select name="provincia" value={formData.provincia} onChange={handleChange} required>
              <option value="">Seleccionar provincia</option>
              {provincias.map(p => <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>)}
            </select>

            <select name="departamento" value={formData.departamento} onChange={handleChange} disabled={!formData.provincia} required={!!formData.provincia}>
              <option value="">Seleccionar departamento</option>
              {getDepartamentosByProvincia().map(d => <option key={d.id_departamento} value={d.id_departamento}>{d.nombre}</option>)}
            </select>

            <select name="municipio" value={formData.municipio} onChange={handleChange} disabled={!formData.departamento} required={!!formData.departamento}>
              <option value="">Seleccionar municipio</option>
              {getMunicipiosByDepartamento().map(m => <option key={m.id_municipio} value={m.id_municipio}>{m.nombre}</option>)}
            </select>

            <input name="calle" placeholder="Calle" value={formData.calle} onChange={handleChange} required />
            <input name="numero" placeholder="Número" value={formData.numero} onChange={handleChange} required />
            <input name="ubicacion" placeholder="Ubicación adicional (esquina, entre calles, etc.)" value={formData.ubicacion} onChange={handleChange} />
            <textarea name="observaciones" placeholder="Observaciones sobre la dirección" value={formData.observaciones} onChange={handleChange}></textarea>
          </fieldset>

          {/* ========== IMÁGENES ========== */}
          <fieldset>
            <legend>Imágenes (Máximo 10)</legend>
            <input type="file" name="imagenes" multiple accept="image/*" onChange={handleChange} />
          </fieldset>

          <button className="btn-enviar" type="submit">Publicar Propiedad</button>
        </form>
      </div>
    </div>
  );
};

export default PublicarPropiedad;
