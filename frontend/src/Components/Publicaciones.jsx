import axios from "axios";
import { useEffect, useState } from "react";
import {
  ENDPOINTS,
  URL_PUBLICACIONES_LIST,
  URL_PUBLICACION,
  URL_PUBLICACION_ID,
  URL_INMUEBLES_LIST,
} from "../Endpoints/endpoint";

import { useNavigate, Link } from "react-router-dom";

import "../Css/Publicaciones.css";

const Publicaciones = () => {
  const navigate = useNavigate();

  const [datos, setDatos] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);

  const [form, setForm] = useState({
    precio: "",
    titulo: "",
    id_inmueble: "",
    tipo_operacion: "",
    estado_inmueble: "",
  });

  const [imagenes, setImagenes] = useState([]);
  const [previewImgs, setPreviewImgs] = useState([]);

  const [editId, setEditId] = useState(null);

  const operaciones = ["Venta", "Alquiler", "Permuta"];
  const estados = ["A estrenar", "Excelente", "Muy bueno", "Bueno", "A refaccionar"];

  // ===========================
  // Cargar datos
  // ===========================
  const getPublicaciones = async () => {
    const res = await axios.get(ENDPOINTS + URL_PUBLICACIONES_LIST);
    setDatos(res.data);
  };

  const getInmuebles = async () => {
    const res = await axios.get(ENDPOINTS + URL_INMUEBLES_LIST);
    setInmuebles(res.data);
  };

  useEffect(() => {
    getPublicaciones();
    getInmuebles();
  }, []);

  // ===========================
  // Manejar imágenes
  // ===========================
  const handleImagenes = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      alert("Máximo 4 imágenes por publicación.");
      return;
    }

    setImagenes(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImgs(previews);
  };

  const eliminarPreview = (index) => {
    const nuevasImgs = imagenes.filter((_, i) => i !== index);
    const nuevasPreviews = previewImgs.filter((_, i) => i !== index);

    setImagenes(nuevasImgs);
    setPreviewImgs(nuevasPreviews);
  };

  // ===========================
  // Guardar publicación
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editId) {
        res = await axios.put(ENDPOINTS + URL_PUBLICACION_ID(editId), form);
      } else {
        res = await axios.post(ENDPOINTS + URL_PUBLICACION, form);
      }

      const idPublicacion = editId ? editId : res.data.id_publicacion;

      // Si hay imágenes, subirlas
      if (imagenes.length > 0) {
        const formImg = new FormData();

        imagenes.forEach((img) => {
          formImg.append("imagenes", img);
        });

        const upload = await fetch(ENDPOINTS + "/api/upload", {
          method: "POST",
          body: formImg,
        });

        const uploaded = await upload.json();

        let orden = 1;
        for (let file of uploaded.files) {
          await fetch(ENDPOINTS + "/api/imagenes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: file.nombre,
              url: file.url,
              orden: orden++,
              id_publicacion: idPublicacion,
            }),
          });
        }
      }

      alert("Publicación guardada ✔");

      // Reset total
      setForm({
        precio: "",
        titulo: "",
        id_inmueble: "",
        tipo_operacion: "",
        estado_inmueble: "",
      });

      setImagenes([]);
      setPreviewImgs([]);
      setEditId(null);
      getPublicaciones();
    } catch (err) {
      console.log(err);
      alert("Error al guardar.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      precio: item.precio,
      titulo: item.titulo,
      id_inmueble: item.id_inmueble,
      tipo_operacion: item.tipo_operacion,
      estado_inmueble: item.estado_inmueble,
    });

    setPreviewImgs([]);
    setImagenes([]);
    setEditId(item.id_publicacion);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar publicación?")) {
      await axios.delete(ENDPOINTS + URL_PUBLICACION_ID(id));
      getPublicaciones();
    }
  };

  return (
    <div className="publi-container">
      
      {/* BOTÓN VOLVER */}
      <button className="btn-volver-publi" onClick={() => navigate("/admin")}>
        ← Volver
      </button>

      <h1 className="publi-title">CRUD de Publicaciones</h1>

      {/* TABLA */}
      <div className="table-wrapper">
        <table className="publi-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Operación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {datos.map((p) => (
              <tr key={p.id_publicacion}>
                <td>{p.id_publicacion}</td>
                <td>{p.titulo}</td>
                <td>${p.precio}</td>
                <td>{p.tipo_operacion}</td>
                <td>{p.estado_inmueble}</td>

                <td className="actions">
                  <Link to={`/propiedad/${p.id_publicacion}`} className="btn-view">Ver</Link>

                  <button className="btn-edit" onClick={() => handleEdit(p)}>
                    Editar
                  </button>

                  <button className="btn-delete" onClick={() => handleDelete(p.id_publicacion)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* FORMULARIO */}
      <h2 className="form-title">{editId ? "Editar Publicación" : "Agregar Publicación"}</h2>

      <form className="publi-form" onSubmit={handleSubmit}>

        <label>Precio</label>
        <input type="number" value={form.precio} onChange={(e) => setForm({...form, precio: e.target.value})} required />

        <label>Título</label>
        <input type="text" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} required />

        <label>Tipo de operación</label>
        <select value={form.tipo_operacion} onChange={(e) => setForm({...form, tipo_operacion: e.target.value})} required>
          <option value="">Seleccione</option>
          {operaciones.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>

        <label>Estado inmueble</label>
        <select value={form.estado_inmueble} onChange={(e) => setForm({...form, estado_inmueble: e.target.value})} required>
          <option value="">Seleccione</option>
          {estados.map((est) => (
            <option key={est} value={est}>{est}</option>
          ))}
        </select>

        <label>Inmueble</label>
        <select value={form.id_inmueble} onChange={(e) => setForm({...form, id_inmueble: e.target.value})} required>
          <option value="">Seleccione</option>
          {inmuebles.map((i) => (
            <option key={i.id_inmueble} value={i.id_inmueble}>{i.titulo}</option>
          ))}
        </select>

        {/* SUBIR IMÁGENES */}
        <label>Imágenes (máx 4)</label>
        <input type="file" multiple accept="image/*" onChange={handleImagenes} />

        {/* PREVIEW */}
        {previewImgs.length > 0 && (
          <div className="preview-container">
            {previewImgs.map((src, index) => (
              <div className="preview-item" key={index}>
                <img src={src} alt="prev" />
                <button className="preview-delete" onClick={() => eliminarPreview(index)}>×</button>
              </div>
            ))}
          </div>
        )}

        <button className="btn-submit" type="submit">
          {editId ? "Actualizar" : "Agregar"}
        </button>

        {editId && (
          <button className="btn-cancel" type="button" onClick={() => {
            setEditId(null);
            setForm({
              precio: "",
              titulo: "",
              id_inmueble: "",
              tipo_operacion: "",
              estado_inmueble: "",
            });
            setImagenes([]);
            setPreviewImgs([]);
          }}>
            Cancelar
          </button>
        )}

      </form>
    </div>
  );
};

export default Publicaciones;
