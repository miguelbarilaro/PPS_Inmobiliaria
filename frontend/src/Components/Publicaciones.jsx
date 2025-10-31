import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_PUBLICACIONES_LIST, URL_PUBLICACION, URL_PUBLICACION_ID, URL_INMUEBLES_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Publicaciones = () => {
  const [datos, setData] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);
  const [form, setForm] = useState({ precio: '', titulo: '', servicios: '', id_inmueble: '' });
  const [editId, setEditId] = useState(null);

  const getPublicaciones = async () => { try { const res = await axios.get(ENDPOINTS + URL_PUBLICACIONES_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  const getInmuebles = async () => { try { const res = await axios.get(ENDPOINTS + URL_INMUEBLES_LIST); setInmuebles(res.data); } catch (error) { console.log('Error inmuebles', error); } };

  useEffect(()=>{ getPublicaciones(); getInmuebles(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_PUBLICACION_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_PUBLICACION, form); } setForm({ precio: '', titulo: '', servicios: '', id_inmueble: '' }); setEditId(null); getPublicaciones(); } catch (error) { console.log('Error guardar publicacion', error); } };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar publicación?')) { try { await axios.delete(ENDPOINTS + URL_PUBLICACION_ID(id)); getPublicaciones(); } catch (error) { console.log('Error', error); } } };
  const handleEdit = (item) => { setForm({ precio: item.precio, titulo: item.titulo, servicios: item.servicios, id_inmueble: item.id_inmueble }); setEditId(item.id_publicacion); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Titulo</th><th>Precio</th><th>Servicios</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_publicacion}><td>{item.id_publicacion}</td><td>{item.titulo}</td><td>{item.precio}</td><td>{item.servicios}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_publicacion)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Publicación' : 'Agregar Publicación'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 700, marginBottom: 20 }}>
        <Form.Group><Form.Label>Precio</Form.Label><Form.Control type="text" value={form.precio} onChange={(e)=>setForm({...form, precio: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Título</Form.Label><Form.Control type="text" value={form.titulo} onChange={(e)=>setForm({...form, titulo: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Servicios</Form.Label><Form.Control type="text" value={form.servicios} onChange={(e)=>setForm({...form, servicios: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Inmueble</Form.Label><Form.Control as="select" value={form.id_inmueble} onChange={(e)=>setForm({...form, id_inmueble: e.target.value})}><option value="">Seleccione</option>{inmuebles.map(i=>(<option key={i.id_inmueble} value={i.id_inmueble}>{i.titulo}</option>))}</Form.Control></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ precio: '', titulo: '', servicios: '', id_inmueble: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Publicaciones;
