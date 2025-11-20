import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as API from '../Endpoints/endpoint';
import '../Css/PublicarPropiedad.css';

const AdminEditarPublicacion = () => {
  const { id } = useParams(); // id_publicacion
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Publicacion
    precio: '',
    titulo: '',
    servicios: '',

    // Inmueble
    descripcion: '',
    pileta: false,
    terraza: false,
    id_categoria: '',
    id_tipo_inmueble: '',
    id_ambiente: '',
    id_dormitorio: '',
    id_condicion: '',
    id_estacionamiento: '',

    // Direccion (campos de dirección)
    calle: '',
    numero: '',
    ubicacion: '',
    observaciones: '',
    provincia: '',
    departamento: '',
    municipio: ''
  });

  const [ids, setIds] = useState({ id_publicacion: null, id_inmueble: null, id_direccion: null });

  const [categorias, setCategorias] = useState([]);
  const [tiposInmuebles, setTiposInmuebles] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [dormitorios, setDormitorios] = useState([]);
  const [estacionamientos, setEstacionamientos] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    // Cargar listas de selects
    Promise.all([
      fetch(API.ENDPOINTS + API.URL_CATEGORIAS_LIST).then(r => r.json()).then(setCategorias).catch(() => setCategorias([])),
      fetch(API.ENDPOINTS + API.URL_TIPOINMUEBLES_LIST).then(r => r.json()).then(setTiposInmuebles).catch(() => setTiposInmuebles([])),
      fetch(API.ENDPOINTS + API.URL_AMBIENTES_LIST).then(r => r.json()).then(setAmbientes).catch(() => setAmbientes([])),
      fetch(API.ENDPOINTS + API.URL_DORMITORIOS_LIST).then(r => r.json()).then(setDormitorios).catch(() => setDormitorios([])),
      fetch(API.ENDPOINTS + API.URL_ESTACIONAMIENTOS_LIST).then(r => r.json()).then(setEstacionamientos).catch(() => setEstacionamientos([])),
      fetch(API.ENDPOINTS + API.URL_CONDICIONES_LIST).then(r => r.json()).then(setCondiciones).catch(() => setCondiciones([])),
      fetch(API.ENDPOINTS + API.URL_PROVINCIAS_LIST).then(r => r.json()).then(setProvincias).catch(() => setProvincias([])),
      fetch(API.ENDPOINTS + API.URL_DEPARTAMENTOS_LIST).then(r => r.json()).then(setDepartamentos).catch(() => setDepartamentos([])),
      fetch(API.ENDPOINTS + API.URL_MUNICIPIOS_LIST).then(r => r.json()).then(setMunicipios).catch(() => setMunicipios([]))
    ]).catch(err => console.error('Error al cargar listas:', err));
  }, []);

  useEffect(() => {
    // Cargar datos de la publicación + inmueble
    const fetchData = async () => {
      try {
        const resPub = await fetch(API.ENDPOINTS + API.URL_PUBLICACION_ID(id));
        const pub = await resPub.json();

        const id_inm = pub.id_inmueble || pub.id_inmueble; // debería venir en p.*
        setIds(prev => ({ ...prev, id_publicacion: id, id_inmueble: id_inm }));

        // Obtener inmueble completo para tener id_direccion y demás
        const resInm = await fetch(API.ENDPOINTS + API.URL_INMUEBLE_ID(id_inm));
        const inm = await resInm.json();

        setIds(prev => ({ ...prev, id_direccion: inm.id_direccion || null }));

        setFormData({
          precio: pub.precio || '',
          titulo: pub.titulo || '',
          servicios: pub.servicios || '',

          descripcion: inm.descripcion || '',
          pileta: inm.pileta === 1 || inm.pileta === true,
          terraza: inm.terraza === 1 || inm.terraza === true,
          id_categoria: inm.id_categoria || '',
          id_tipo_inmueble: inm.id_tipo_inmueble || '',
          id_ambiente: inm.id_ambiente || '',
          id_dormitorio: inm.id_dormitorio || '',
          id_condicion: inm.id_condicion || '',
          id_estacionamiento: inm.id_estacionamiento || '',

          calle: inm.calle || '',
          numero: inm.numero_direccion || inm.numero || '',
          ubicacion: inm.ubicacion || '',
          observaciones: inm.observaciones || '',
          provincia: inm.id_provincia || '',
          departamento: inm.id_departamento || '',
          municipio: inm.id_municipio || ''
        });

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar publicación/inmueble:', err);
        alert('Error al cargar datos de la publicación.');
        navigate('/admin');
      }
    };

    fetchData();
  }, [id, navigate]);

  const getDepartamentosByProvincia = () =>
    formData.provincia ? departamentos.filter(d => Number(d.id_provincia) === Number(formData.provincia)) : [];

  const getMunicipiosByDepartamento = () =>
    formData.departamento ? municipios.filter(m => Number(m.id_departamento) === Number(formData.departamento)) : [];

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    const numericFields = ['provincia', 'departamento', 'municipio', 'id_categoria', 'id_tipo_inmueble', 'id_ambiente', 'id_dormitorio', 'id_condicion', 'id_estacionamiento', 'precio'];
    if (numericFields.includes(name)) value = value === '' ? '' : Number(value);

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 0 -> Dirección: si existe id_direccion -> PATCH, sino -> POST y obtener id
      let idDireccion = ids.id_direccion;

      const direccionPayload = {
        id_municipio: Number(formData.municipio) || null,
        calle: formData.calle,
        numero: formData.numero,
        ubicacion: formData.ubicacion,
        observaciones: formData.observaciones
      };

      if (idDireccion) {
        await fetch(API.ENDPOINTS + API.URL_DIRECCION_ID(idDireccion), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(direccionPayload)
        });
      } else {
        const resDir = await fetch(API.ENDPOINTS + API.URL_DIRECCION, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(direccionPayload)
        });
        const created = await resDir.json();
        idDireccion = created.id || created.id_direccion;
      }

      // 1 -> Actualizar Inmueble
      const inmueblePayload = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        pileta: formData.pileta ? 1 : 0,
        terraza: formData.terraza ? 1 : 0,
        id_categoria: Number(formData.id_categoria) || null,
        id_tipo_inmueble: formData.id_tipo_inmueble ? Number(formData.id_tipo_inmueble) : null,
        id_ambiente: formData.id_ambiente ? Number(formData.id_ambiente) : null,
        id_dormitorio: formData.id_dormitorio ? Number(formData.id_dormitorio) : null,
        id_condicion: formData.id_condicion ? Number(formData.id_condicion) : null,
        id_estacionamiento: formData.id_estacionamiento ? Number(formData.id_estacionamiento) : null,
        id_direccion: idDireccion
      };

      await fetch(API.ENDPOINTS + API.URL_INMUEBLE_ID(ids.id_inmueble), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inmueblePayload)
      });

      // 2 -> Actualizar Publicación
      const publicacionPayload = {
        precio: Number(formData.precio) || null,
        titulo: formData.titulo,
        servicios: formData.servicios,
        id_inmueble: ids.id_inmueble
      };

      await fetch(API.ENDPOINTS + API.URL_PUBLICACION_ID(ids.id_publicacion), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publicacionPayload)
      });

      alert('Publicación actualizada correctamente ✔');
      navigate('/admin');
    } catch (err) {
      console.error('Error al actualizar publicación:', err);
      alert('Error al actualizar la publicación.');
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="publicar-page">
      <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>

      <div className="publicar-container">
        <h1>Editar Publicación</h1>

        <form className="publicar-form" onSubmit={handleSubmit}>

          <fieldset>
            <legend>Datos de la Publicación</legend>
            <input name="titulo" placeholder="Título de la propiedad" value={formData.titulo} onChange={handleChange} required />
            <textarea name="descripcion" placeholder="Descripción de la propiedad" value={formData.descripcion} onChange={handleChange} required></textarea>
            <input name="precio" type="number" placeholder="Precio" value={formData.precio} onChange={handleChange} required />
            <input name="servicios" placeholder="Servicios (opcional)" value={formData.servicios} onChange={handleChange} />
          </fieldset>

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

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-enviar" type="submit">Guardar cambios</button>
            <button type="button" onClick={() => navigate('/admin')}>Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminEditarPublicacion;
