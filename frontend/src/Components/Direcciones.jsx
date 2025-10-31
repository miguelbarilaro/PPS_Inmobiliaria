import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_DIRECCIONES_LIST, URL_DIRECCION, URL_DIRECCION_ID, URL_MUNICIPIOS_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Direcciones = () => {
  const [datos, setData] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [form, setForm] = useState({ id_municipio: '', calle: '', numero: '', ubicacion: '', observaciones: '' });
  const [editId, setEditId] = useState(null);

  const getDirecciones = async () => { try { const res = await axios.get(ENDPOINTS + URL_DIRECCIONES_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  const getMunicipios = async () => { try { const res = await axios.get(ENDPOINTS + URL_MUNICIPIOS_LIST); setMunicipios(res.data); } catch (error) { console.log('Error municipios', error); } };

  useEffect(() => { getDirecciones(); getMunicipios(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_DIRECCION_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_DIRECCION, form); } setForm({ id_municipio: '', calle: '', numero: '', ubicacion: '', observaciones: '' }); setEditId(null); getDirecciones(); } catch (error) { console.log('Error al guardar direccion', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar direccion?')) { try { await axios.delete(ENDPOINTS + URL_DIRECCION_ID(id)); getDirecciones(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ id_municipio: item.id_municipio, calle: item.calle, numero: item.numero, ubicacion: item.ubicacion, observaciones: item.observaciones }); setEditId(item.id_direccion); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Municipio</th><th>Calle</th><th>Numero</th><th>Ubicación</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item) => (<tr key={item.id_direccion}><td>{item.id_direccion}</td><td>{item.nombre_municipio || item.id_municipio}</td><td>{item.calle}</td><td>{item.numero}</td><td>{item.ubicacion}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight: 5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_direccion)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Dirección' : 'Agregar Dirección'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 700, marginBottom: 20 }}>
        <Form.Group><Form.Label>Municipio</Form.Label><Form.Control as="select" value={form.id_municipio} onChange={(e)=>setForm({...form, id_municipio: e.target.value})}><option value="">Seleccione</option>{municipios.map(m=> (<option key={m.id_municipio} value={m.id_municipio}>{m.nombre}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Calle</Form.Label><Form.Control type="text" value={form.calle} onChange={(e)=>setForm({...form, calle: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Numero</Form.Label><Form.Control type="text" value={form.numero} onChange={(e)=>setForm({...form, numero: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Ubicación</Form.Label><Form.Control type="text" value={form.ubicacion} onChange={(e)=>setForm({...form, ubicacion: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Observaciones</Form.Label><Form.Control type="text" value={form.observaciones} onChange={(e)=>setForm({...form, observaciones: e.target.value})} /></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft: 10, marginTop: 10 }} onClick={()=>{setEditId(null); setForm({ id_municipio: '', calle: '', numero: '', ubicacion: '', observaciones: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Direcciones;
