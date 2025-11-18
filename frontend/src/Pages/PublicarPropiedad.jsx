import React, { useState, useEffect } from "react";
import "../Css/PublicarPropiedad.css";
import * as API from "../Endpoints/endpoint";
import { useNavigate } from "react-router-dom";

const PublicarPropiedad = () => {
  const navigate = useNavigate();

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
    imagenes: []
  });

  const [categorias, setCategorias] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "imagenes") {
      setFormData({ ...formData, imagenes: e.target.files });
      return;
    }

    const numericFields = ["provincia", "municipio", "categoria", "condicion", "ambientes", "dormitorios", "precio"];
    if (numericFields.includes(name)) value = Number(value);

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 0 — Crear dirección
      const resDir = await fetch(API.ENDPOINTS + "/api/direcciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_municipio: formData.municipio,
          calle: formData.titulo,
          numero: "0",
          ubicacion: "",
          observaciones: ""
        })
      });

      const direccion = await resDir.json();
      const idDireccion = direccion.id;

      // 1 — Crear inmueble
      const resInm = await fetch(API.ENDPOINTS + API.URL_INMUEBLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          pileta: false,
          terraza: false,
          id_categoria: Number(formData.categoria),
          id_condicion: Number(formData.condicion),
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
          servicios: "",
          id_inmueble: inmueble.id
        })
      });

      const publicacion = await resPub.json();
      const idPub = publicacion.id_publicacion;

      // 3 — Subir imágenes
      if (formData.imagenes.length > 0) {
        const formImg = new FormData();
        for (let img of formData.imagenes) formImg.append("imagenes", img);

        const uploadRes = await fetch(API.ENDPOINTS + "/api/upload", {
          method: "POST",
          body: formImg
        });

        const uploaded = await uploadRes.json();

        let orden = 1;
        for (let file of uploaded.files) {
          await fetch(API.ENDPOINTS + "/api/imagenes", {
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

    } catch (err) {
      console.error(err);
      alert("Error al cargar propiedad.");
    }
  };

  useEffect(() => {
    fetch(API.ENDPOINTS + API.URL_CATEGORIAS_LIST).then(r => r.json()).then(setCategorias);
    fetch(API.ENDPOINTS + API.URL_CONDICIONES_LIST).then(r => r.json()).then(setCondiciones);
    fetch(API.ENDPOINTS + API.URL_PROVINCIAS_LIST).then(r => r.json()).then(setProvincias);
    fetch(API.ENDPOINTS + API.URL_DEPARTAMENTOS_LIST).then(r => r.json()).then(setDepartamentos);
    fetch(API.ENDPOINTS + API.URL_MUNICIPIOS_LIST).then(r => r.json()).then(setMunicipios);
  }, []);

  const municipiosByProv = () => {
    if (!formData.provincia) return [];
    const deptIds = departamentos
      .filter(d => Number(d.id_provincia) === Number(formData.provincia))
      .map(d => d.id_departamento);
    return municipios.filter(m => deptIds.includes(m.id_departamento));
  };

  return (
    <div className="publicar-page">

      <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>

      <div className="publicar-container">
        <h1>Publicar Propiedad</h1>

        <form className="publicar-form" onSubmit={handleSubmit}>
          <input name="titulo" placeholder="Título" onChange={handleChange} required />
          <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} required></textarea>
          <input name="precio" type="number" placeholder="Precio" onChange={handleChange} required />

          <select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">Seleccionar categoría</option>
            {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>

          <select name="provincia" value={formData.provincia} onChange={handleChange} required>
            <option value="">Seleccionar provincia</option>
            {provincias.map(p => <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>)}
          </select>

          <select name="municipio" value={formData.municipio} disabled={!formData.provincia} onChange={handleChange} required>
            <option value="">Seleccionar municipio</option>
            {municipiosByProv().map(m => <option key={m.id_municipio} value={m.id_municipio}>{m.nombre}</option>)}
          </select>

          <select name="condicion" value={formData.condicion} onChange={handleChange} required>
            <option value="">Seleccionar condición</option>
            {condiciones.map(c => <option key={c.id_condicion} value={c.id_condicion}>{c.estado}</option>)}
          </select>

          <input type="file" name="imagenes" multiple accept="image/*" onChange={handleChange} />

          <button className="btn-enviar" type="submit">Publicar</button>
        </form>
      </div>
    </div>
  );
};

export default PublicarPropiedad;
