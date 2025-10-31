import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_IMAGENES_LIST, URL_IMAGEN, URL_IMAGEN_ID, URL_PUBLICACIONES_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Imagenes = () => {
  const [datos, setData] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [form, setForm] = useState({ nombre: '', url: '', orden: '', id_publicacion: '' });
  const [editId, setEditId] = useState(null);

  const getImagenes = async () => { try { const res = await axios.get(ENDPOINTS + URL_IMAGENES_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  const getPublicaciones = async () => { try { const res = await axios.get(ENDPOINTS + URL_PUBLICACIONES_LIST); setPublicaciones(res.data); } catch (error) { console.log('Error publicaciones', error); } };

  useEffect(() => { getImagenes(); getPublicaciones(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_IMAGEN_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_IMAGEN, form); } setForm({ nombre: '', url: '', orden: '', id_publicacion: '' }); setEditId(null); getImagenes(); } catch (error) { console.log('Error al guardar imagen', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar imagen?')) { try { await axios.delete(ENDPOINTS + URL_IMAGEN_ID(id)); getImagenes(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ nombre: item.nombre, url: item.url, orden: item.orden, id_publicacion: item.id_publicacion }); setEditId(item.id_imagen); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Nombre</th><th>URL</th><th>Orden</th><th>Id Publicación</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_imagen}><td>{item.id_imagen}</td><td>{item.nombre}</td><td>{item.url}</td><td>{item.orden}</td><td>{item.id_publicacion}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_imagen)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Imagen' : 'Agregar Imagen'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 700, marginBottom: 20 }}>
        <Form.Group><Form.Label>Nombre</Form.Label><Form.Control type="text" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>URL</Form.Label><Form.Control type="text" value={form.url} onChange={(e)=>setForm({...form, url: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Orden</Form.Label><Form.Control type="text" value={form.orden} onChange={(e)=>setForm({...form, orden: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Publicación</Form.Label><Form.Control as="select" value={form.id_publicacion} onChange={(e)=>setForm({...form, id_publicacion: e.target.value})}><option value="">Seleccione</option>{publicaciones.map(p=>(<option key={p.id_publicacion} value={p.id_publicacion}>{p.titulo}</option>))}</Form.Control></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ nombre: '', url: '', orden: '', id_publicacion: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Imagenes;
