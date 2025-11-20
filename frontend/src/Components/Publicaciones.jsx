import axios from "axios";
import { useEffect, useState } from "react";
import {
  ENDPOINTS,
  URL_PUBLICACIONES_LIST,
  URL_PUBLICACION,
  URL_PUBLICACION_ID,
  URL_INMUEBLES_LIST,
  URL_CATEGORIAS_LIST,
  URL_TIPOINMUEBLES_LIST,
  URL_AMBIENTES_LIST,
  URL_DORMITORIOS_LIST,
  URL_ESTACIONAMIENTOS_LIST,
  URL_CONDICIONES_LIST,
  URL_PROVINCIAS_LIST,
  URL_DEPARTAMENTOS_LIST,
  URL_MUNICIPIOS_LIST,
  URL_DIRECCION,
  URL_DIRECCION_ID,
  URL_INMUEBLE,
  URL_INMUEBLE_ID,
} from "../Endpoints/endpoint";

import { useNavigate, Link } from "react-router-dom";

import "../Css/Publicaciones.css";

const Publicaciones = () => {
  const navigate = useNavigate();

  const [datos, setDatos] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposInmuebles, setTiposInmuebles] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [dormitorios, setDormitorios] = useState([]);
  const [estacionamientos, setEstacionamientos] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const [form, setForm] = useState({
    // Publicacion
    precio: "",
    titulo: "",
    servicios: "",

    // Inmueble
    descripcion: "",
    pileta: false,
    terraza: false,
    id_categoria: "",
    id_tipo_inmueble: "",
    id_ambiente: "",
    id_dormitorio: "",
    id_condicion: "",
    id_estacionamiento: "",

    // Direccion
    calle: "",
    numero: "",
    ubicacion: "",
    observaciones: "",
    provincia: "",
    departamento: "",
    municipio: "",
  });

  const [ids, setIds] = useState({ id_inmueble: null, id_direccion: null });
  const [imagenes, setImagenes] = useState([]);
  const [previewImgs, setPreviewImgs] = useState([]);
  const [editId, setEditId] = useState(null);

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
    
    // Cargar listas de selects
    Promise.all([
      fetch(ENDPOINTS + URL_CATEGORIAS_LIST).then(r => r.json()).then(setCategorias).catch(() => setCategorias([])),
      fetch(ENDPOINTS + URL_TIPOINMUEBLES_LIST).then(r => r.json()).then(setTiposInmuebles).catch(() => setTiposInmuebles([])),
      fetch(ENDPOINTS + URL_AMBIENTES_LIST).then(r => r.json()).then(setAmbientes).catch(() => setAmbientes([])),
      fetch(ENDPOINTS + URL_DORMITORIOS_LIST).then(r => r.json()).then(setDormitorios).catch(() => setDormitorios([])),
      fetch(ENDPOINTS + URL_ESTACIONAMIENTOS_LIST).then(r => r.json()).then(setEstacionamientos).catch(() => setEstacionamientos([])),
      fetch(ENDPOINTS + URL_CONDICIONES_LIST).then(r => r.json()).then(setCondiciones).catch(() => setCondiciones([])),
      fetch(ENDPOINTS + URL_PROVINCIAS_LIST).then(r => r.json()).then(setProvincias).catch(() => setProvincias([])),
      fetch(ENDPOINTS + URL_DEPARTAMENTOS_LIST).then(r => r.json()).then(setDepartamentos).catch(() => setDepartamentos([])),
      fetch(ENDPOINTS + URL_MUNICIPIOS_LIST).then(r => r.json()).then(setMunicipios).catch(() => setMunicipios([]))
    ]).catch(err => console.error('Error al cargar listas:', err));
  }, []);

  // ===========================
  // Manejar cambios en el formulario
  // ===========================
  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (name === "imagenes") {
      const files = Array.from(e.target.files || []);
      if (files.length > 4) {
        alert('Máximo 4 imágenes.');
        return;
      }
      setImagenes(files);
      setPreviewImgs(files.map(f => URL.createObjectURL(f)));
      return;
    }

    const numericFields = ["provincia", "departamento", "municipio", "id_categoria", "id_tipo_inmueble", "id_ambiente", "id_dormitorio", "id_condicion", "id_estacionamiento", "precio"];
    if (numericFields.includes(name)) value = value === '' ? '' : Number(value);

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const getDepartamentosByProvincia = () =>
    form.provincia ? departamentos.filter(d => Number(d.id_provincia) === Number(form.provincia)) : [];

  const getMunicipiosByDepartamento = () =>
    form.departamento ? municipios.filter(m => Number(m.id_departamento) === Number(form.departamento)) : [];

  // ===========================
  // Manejar imágenes
  // ===========================
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
      // 0 -> Dirección: actualizar o crear
      let idDireccion = ids.id_direccion;
      const direccionPayload = {
        id_municipio: Number(form.municipio) || null,
        calle: form.calle,
        numero: form.numero,
        ubicacion: form.ubicacion,
        observaciones: form.observaciones
      };

      if (editId && idDireccion) {
        await fetch(ENDPOINTS + URL_DIRECCION_ID(idDireccion), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(direccionPayload)
        });
      } else if (!editId) {
        const resDir = await fetch(ENDPOINTS + URL_DIRECCION, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(direccionPayload)
        });
        const created = await resDir.json();
        idDireccion = created.id || created.id_direccion;
      }

      // 1 -> Inmueble: actualizar o crear
      let id_inmueble = ids.id_inmueble;
      const inmueblePayload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        pileta: form.pileta ? 1 : 0,
        terraza: form.terraza ? 1 : 0,
        id_categoria: Number(form.id_categoria) || null,
        id_tipo_inmueble: form.id_tipo_inmueble ? Number(form.id_tipo_inmueble) : null,
        id_ambiente: form.id_ambiente ? Number(form.id_ambiente) : null,
        id_dormitorio: form.id_dormitorio ? Number(form.id_dormitorio) : null,
        id_condicion: form.id_condicion ? Number(form.id_condicion) : null,
        id_estacionamiento: form.id_estacionamiento ? Number(form.id_estacionamiento) : null,
        id_direccion: idDireccion
      };

      if (editId && id_inmueble) {
        await fetch(ENDPOINTS + URL_INMUEBLE_ID(id_inmueble), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inmueblePayload)
        });
      } else if (!editId) {
        const resInm = await fetch(ENDPOINTS + URL_INMUEBLE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inmueblePayload)
        });
        const created = await resInm.json();
        id_inmueble = created.id || created.id_inmueble;
      }

      // 2 -> Publicación: actualizar o crear
      const publicacionPayload = {
        precio: Number(form.precio) || null,
        titulo: form.titulo,
        servicios: form.servicios,
        id_inmueble: id_inmueble
      };

      let idPublicacion = editId;
      if (editId) {
        await fetch(ENDPOINTS + URL_PUBLICACION_ID(editId), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(publicacionPayload)
        });
      } else {
        const resPub = await fetch(ENDPOINTS + URL_PUBLICACION, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(publicacionPayload)
        });
        const created = await resPub.json();
        idPublicacion = created.id_publicacion || created.id;
      }

      // 3 -> Subir imágenes
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
        for (let file of (uploaded.files || [])) {
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

      // Reset
      setForm({
        precio: "",
        titulo: "",
        servicios: "",
        descripcion: "",
        pileta: false,
        terraza: false,
        id_categoria: "",
        id_tipo_inmueble: "",
        id_ambiente: "",
        id_dormitorio: "",
        id_condicion: "",
        id_estacionamiento: "",
        calle: "",
        numero: "",
        ubicacion: "",
        observaciones: "",
        provincia: "",
        departamento: "",
        municipio: "",
      });

      setIds({ id_inmueble: null, id_direccion: null });
      setImagenes([]);
      setPreviewImgs([]);
      setEditId(null);
      getPublicaciones();
    } catch (err) {
      console.error(err);
      alert("Error al guardar.");
    }
  };

  const handleEdit = async (item) => {
    // Cargar datos del inmueble para obtener id_direccion y demás
    try {
      const resInm = await fetch(ENDPOINTS + URL_INMUEBLE_ID(item.id_inmueble));
      const inm = await resInm.json();

      setIds({ id_inmueble: item.id_inmueble, id_direccion: inm.id_direccion || null });

      setForm({
        precio: item.precio || "",
        titulo: item.titulo || "",
        servicios: item.servicios || "",

        descripcion: inm.descripcion || "",
        pileta: inm.pileta === 1 || inm.pileta === true,
        terraza: inm.terraza === 1 || inm.terraza === true,
        id_categoria: inm.id_categoria || "",
        id_tipo_inmueble: inm.id_tipo_inmueble || "",
        id_ambiente: inm.id_ambiente || "",
        id_dormitorio: inm.id_dormitorio || "",
        id_condicion: inm.id_condicion || "",
        id_estacionamiento: inm.id_estacionamiento || "",

        calle: inm.calle || "",
        numero: inm.numero_direccion || inm.numero || "",
        ubicacion: inm.ubicacion || "",
        observaciones: inm.observaciones || "",
        provincia: inm.id_provincia || "",
        departamento: inm.id_departamento || "",
        municipio: inm.id_municipio || ""
      });

      setPreviewImgs([]);
      setImagenes([]);
      setEditId(item.id_publicacion);
    } catch (err) {
      console.error('Error al cargar inmueble:', err);
      alert('Error al cargar datos.');
    }
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

        {/* ========== PUBLICACIÓN ========== */}
        <fieldset>
          <legend>Datos de la Publicación</legend>
          <label>Título</label>
          <input name="titulo" placeholder="Título de la propiedad" value={form.titulo} onChange={handleChange} required />

          <label>Descripción</label>
          <textarea name="descripcion" placeholder="Descripción de la propiedad" value={form.descripcion} onChange={handleChange} required></textarea>

          <label>Precio</label>
          <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required />

          <label>Servicios (opcional)</label>
          <input name="servicios" placeholder="Servicios" value={form.servicios} onChange={handleChange} />
        </fieldset>

        {/* ========== INMUEBLE ========== */}
        <fieldset>
          <legend>Características del Inmueble</legend>

          <label>Categoría</label>
          <select name="id_categoria" value={form.id_categoria} onChange={handleChange} required>
            <option value="">Seleccionar categoría</option>
            {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>

          <label>Tipo de inmueble</label>
          <select name="id_tipo_inmueble" value={form.id_tipo_inmueble} onChange={handleChange}>
            <option value="">Tipo de inmueble</option>
            {tiposInmuebles.map(t => <option key={t.id_tipo_inmueble} value={t.id_tipo_inmueble}>{t.tipo_inmueble}</option>)}
          </select>

          <label>Condición</label>
          <select name="id_condicion" value={form.id_condicion} onChange={handleChange}>
            <option value="">Seleccionar condición</option>
            {condiciones.map(c => <option key={c.id_condicion} value={c.id_condicion}>{c.estado}</option>)}
          </select>

          <label>Cantidad de ambientes</label>
          <select name="id_ambiente" value={form.id_ambiente} onChange={handleChange}>
            <option value="">Cantidad de ambientes</option>
            {ambientes.map(a => <option key={a.id_ambiente} value={a.id_ambiente}>{a.numero}</option>)}
          </select>

          <label>Cantidad de dormitorios</label>
          <select name="id_dormitorio" value={form.id_dormitorio} onChange={handleChange}>
            <option value="">Cantidad de dormitorios</option>
            {dormitorios.map(d => <option key={d.id_dormitorio} value={d.id_dormitorio}>{d.numero}</option>)}
          </select>

          <label>Estacionamiento</label>
          <select name="id_estacionamiento" value={form.id_estacionamiento} onChange={handleChange}>
            <option value="">Estacionamiento</option>
            {estacionamientos.map(e => <option key={e.id_estacionamiento} value={e.id_estacionamiento}>{e.numero} - {e.entrada_exclusiva}</option>)}
          </select>

          <label>
            <input type="checkbox" name="pileta" checked={form.pileta} onChange={handleChange} />
            ¿Tiene pileta?
          </label>

          <label>
            <input type="checkbox" name="terraza" checked={form.terraza} onChange={handleChange} />
            ¿Tiene terraza?
          </label>
        </fieldset>

        {/* ========== UBICACIÓN ========== */}
        <fieldset>
          <legend>Ubicación</legend>

          <label>Provincia</label>
          <select name="provincia" value={form.provincia} onChange={handleChange} required>
            <option value="">Seleccionar provincia</option>
            {provincias.map(p => <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>)}
          </select>

          <label>Departamento</label>
          <select name="departamento" value={form.departamento} onChange={handleChange} disabled={!form.provincia} required={!!form.provincia}>
            <option value="">Seleccionar departamento</option>
            {getDepartamentosByProvincia().map(d => <option key={d.id_departamento} value={d.id_departamento}>{d.nombre}</option>)}
          </select>

          <label>Municipio</label>
          <select name="municipio" value={form.municipio} onChange={handleChange} disabled={!form.departamento} required={!!form.departamento}>
            <option value="">Seleccionar municipio</option>
            {getMunicipiosByDepartamento().map(m => <option key={m.id_municipio} value={m.id_municipio}>{m.nombre}</option>)}
          </select>

          <label>Calle</label>
          <input name="calle" placeholder="Calle" value={form.calle} onChange={handleChange} required />

          <label>Número</label>
          <input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required />

          <label>Ubicación adicional</label>
          <input name="ubicacion" placeholder="Ubicación adicional (esquina, entre calles, etc.)" value={form.ubicacion} onChange={handleChange} />

          <label>Observaciones</label>
          <textarea name="observaciones" placeholder="Observaciones sobre la dirección" value={form.observaciones} onChange={handleChange}></textarea>
        </fieldset>

        {/* ========== IMÁGENES ========== */}
        <fieldset>
          <legend>Imágenes (Máximo 4)</legend>
          <input type="file" name="imagenes" multiple accept="image/*" onChange={handleChange} />

          {previewImgs.length > 0 && (
            <div className="preview-container">
              {previewImgs.map((src, index) => (
                <div className="preview-item" key={index}>
                  <img src={src} alt="prev" />
                  <button className="preview-delete" type="button" onClick={() => eliminarPreview(index)}>×</button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-submit" type="submit">
            {editId ? "Actualizar" : "Agregar"}
          </button>

          {editId && (
            <button className="btn-cancel" type="button" onClick={() => {
              setEditId(null);
              setForm({
                precio: "",
                titulo: "",
                servicios: "",
                descripcion: "",
                pileta: false,
                terraza: false,
                id_categoria: "",
                id_tipo_inmueble: "",
                id_ambiente: "",
                id_dormitorio: "",
                id_condicion: "",
                id_estacionamiento: "",
                calle: "",
                numero: "",
                ubicacion: "",
                observaciones: "",
                provincia: "",
                departamento: "",
                municipio: "",
              });
              setIds({ id_inmueble: null, id_direccion: null });
              setImagenes([]);
              setPreviewImgs([]);
            }}>
              Cancelar
            </button>
          )}
        </div>

      </form>
    </div>
  );
};

export default Publicaciones;
