import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_INMUEBLES_LIST, URL_INMUEBLE, URL_INMUEBLE_ID, URL_CATEGORIAS_LIST, URL_TIPOINMUEBLES_LIST, URL_AMBIENTES_LIST, URL_DORMITORIOS_LIST, URL_CONDICIONES_LIST, URL_ESTACIONAMIENTOS_LIST, URL_DIRECCIONES_LIST, URL_CLIENTES_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Inmuebles = () => {
  const [datos, setData] = useState([]);
  const [catalogos, setCatalogos] = useState({ categorias: [], tipos: [], ambientes: [], dormitorios: [], condiciones: [], estacionamientos: [], direcciones: [], clientes: [] });
  const [form, setForm] = useState({ titulo: '', descripcion: '', pileta: '', terraza: '', id_categoria: '', id_tipo_inmueble: '', id_ambiente: '', id_dormitorio: '', id_condicion: '', id_estacionamiento: '', id_direccion: '', id_cliente: '' });
  const [editId, setEditId] = useState(null);

  const getInmuebles = async () => { try { const res = await axios.get(ENDPOINTS + URL_INMUEBLES_LIST); setData(res.data); } catch (error) { console.log('Error inmuebles', error); } };
  const getCatalogos = async () => {
    try {
      const [c1,c2,c3,c4,c5,c6,c7,c8] = await Promise.all([
        axios.get(ENDPOINTS + URL_CATEGORIAS_LIST),
        axios.get(ENDPOINTS + URL_TIPOINMUEBLES_LIST),
        axios.get(ENDPOINTS + URL_AMBIENTES_LIST),
        axios.get(ENDPOINTS + URL_DORMITORIOS_LIST),
        axios.get(ENDPOINTS + URL_CONDICIONES_LIST),
        axios.get(ENDPOINTS + URL_ESTACIONAMIENTOS_LIST),
        axios.get(ENDPOINTS + URL_DIRECCIONES_LIST),
        axios.get(ENDPOINTS + URL_CLIENTES_LIST)
      ]);
      setCatalogos({ categorias: c1.data, tipos: c2.data, ambientes: c3.data, dormitorios: c4.data, condiciones: c5.data, estacionamientos: c6.data, direcciones: c7.data, clientes: c8.data });
    } catch (error) { console.log('Error catalogos', error); }
  };

  useEffect(() => { getInmuebles(); getCatalogos(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_INMUEBLE_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_INMUEBLE, form); } setForm({ titulo: '', descripcion: '', pileta: '', terraza: '', id_categoria: '', id_tipo_inmueble: '', id_ambiente: '', id_dormitorio: '', id_condicion: '', id_estacionamiento: '', id_direccion: '', id_cliente: '' }); setEditId(null); getInmuebles(); } catch (error) { console.log('Error al guardar inmueble', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar inmueble?')) { try { await axios.delete(ENDPOINTS + URL_INMUEBLE_ID(id)); getInmuebles(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ titulo: item.titulo, descripcion: item.descripcion, pileta: item.pileta, terraza: item.terraza, id_categoria: item.id_categoria, id_tipo_inmueble: item.id_tipo_inmueble, id_ambiente: item.id_ambiente, id_dormitorio: item.id_dormitorio, id_condicion: item.id_condicion, id_estacionamiento: item.id_estacionamiento, id_direccion: item.id_direccion, id_cliente: item.id_cliente }); setEditId(item.id_inmueble); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Título</th><th>Descripción</th><th>Categoría</th><th>Cliente</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_inmueble}><td>{item.id_inmueble}</td><td>{item.titulo}</td><td>{item.descripcion}</td><td>{item.categoria}</td><td>{item.tipo_cliente}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_inmueble)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Inmueble' : 'Agregar Inmueble'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 900, marginBottom: 20 }}>
        <Form.Group><Form.Label>Título</Form.Label><Form.Control type="text" value={form.titulo} onChange={(e)=>setForm({...form, titulo: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Descripción</Form.Label><Form.Control type="text" value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Pileta</Form.Label><Form.Control type="text" value={form.pileta} onChange={(e)=>setForm({...form, pileta: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Terraza</Form.Label><Form.Control type="text" value={form.terraza} onChange={(e)=>setForm({...form, terraza: e.target.value})} /></Form.Group>

        <Form.Group><Form.Label>Categoría</Form.Label><Form.Control as="select" value={form.id_categoria} onChange={(e)=>setForm({...form, id_categoria: e.target.value})}><option value="">Seleccione</option>{catalogos.categorias.map(c=>(<option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Tipo de Inmueble</Form.Label><Form.Control as="select" value={form.id_tipo_inmueble} onChange={(e)=>setForm({...form, id_tipo_inmueble: e.target.value})}><option value="">Seleccione</option>{catalogos.tipos.map(t=>(<option key={t.id_tipo_inmueble} value={t.id_tipo_inmueble}>{t.tipo_inmueble}</option>))}</Form.Control></Form.Group>

        <Form.Group><Form.Label>Ambiente</Form.Label><Form.Control as="select" value={form.id_ambiente} onChange={(e)=>setForm({...form, id_ambiente: e.target.value})}><option value="">Seleccione</option>{catalogos.ambientes.map(am=>(<option key={am.id_ambiente} value={am.id_ambiente}>{am.numero}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Dormitorio</Form.Label><Form.Control as="select" value={form.id_dormitorio} onChange={(e)=>setForm({...form, id_dormitorio: e.target.value})}><option value="">Seleccione</option>{catalogos.dormitorios.map(d=>(<option key={d.id_dormitorio} value={d.id_dormitorio}>{d.numero}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Condición</Form.Label><Form.Control as="select" value={form.id_condicion} onChange={(e)=>setForm({...form, id_condicion: e.target.value})}><option value="">Seleccione</option>{catalogos.condiciones.map(c=> (<option key={c.id_condicion} value={c.id_condicion}>{c.estado}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Estacionamiento</Form.Label><Form.Control as="select" value={form.id_estacionamiento} onChange={(e)=>setForm({...form, id_estacionamiento: e.target.value})}><option value="">Seleccione</option>{catalogos.estacionamientos.map(es=>(<option key={es.id_estacionamiento} value={es.id_estacionamiento}>{es.numero}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Dirección</Form.Label><Form.Control as="select" value={form.id_direccion} onChange={(e)=>setForm({...form, id_direccion: e.target.value})}><option value="">Seleccione</option>{catalogos.direcciones.map(dir=>(<option key={dir.id_direccion} value={dir.id_direccion}>{dir.calle} {dir.numero}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Cliente</Form.Label><Form.Control as="select" value={form.id_cliente} onChange={(e)=>setForm({...form, id_cliente: e.target.value})}><option value="">Seleccione</option>{catalogos.clientes.map(cl=>(<option key={cl.id_cliente} value={cl.id_cliente}>{cl.tipo}</option>))}</Form.Control></Form.Group>

        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft: 10, marginTop: 10 }} onClick={()=>{setEditId(null); setForm({ titulo: '', descripcion: '', pileta: '', terraza: '', id_categoria: '', id_tipo_inmueble: '', id_ambiente: '', id_dormitorio: '', id_condicion: '', id_estacionamiento: '', id_direccion: '', id_cliente: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Inmuebles;
