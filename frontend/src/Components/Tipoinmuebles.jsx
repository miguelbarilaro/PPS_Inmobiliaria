import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_TIPOINMUEBLES_LIST, URL_TIPOINMUEBLE, URL_TIPOINMUEBLE_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Tipoinmuebles = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ tipo_inmueble: '' });
  const [editId, setEditId] = useState(null);

  const getTipos = async () => { try { const res = await axios.get(ENDPOINTS + URL_TIPOINMUEBLES_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  useEffect(()=>{ getTipos(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_TIPOINMUEBLE_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_TIPOINMUEBLE, form); } setForm({ tipo_inmueble: '' }); setEditId(null); getTipos(); } catch (error) { console.log('Error guardar tipo', error); } };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar tipo?')) { try { await axios.delete(ENDPOINTS + URL_TIPOINMUEBLE_ID(id)); getTipos(); } catch (error) { console.log('Error', error); } } };
  const handleEdit = (item) => { setForm({ tipo_inmueble: item.tipo_inmueble }); setEditId(item.id_tipo_inmueble); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Tipo Inmueble</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_tipo_inmueble}><td>{item.id_tipo_inmueble}</td><td>{item.tipo_inmueble}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_tipo_inmueble)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Tipo' : 'Agregar Tipo'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 20 }}>
        <Form.Group><Form.Label>Tipo Inmueble</Form.Label><Form.Control type="text" value={form.tipo_inmueble} onChange={(e)=>setForm({...form, tipo_inmueble: e.target.value})} required/></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ tipo_inmueble: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Tipoinmuebles;
