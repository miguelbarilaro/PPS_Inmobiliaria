import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_CONDICIONES_LIST, URL_CONDICION, URL_CONDICION_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Condiciones = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ estado: '' });
  const [editId, setEditId] = useState(null);

  const getCondiciones = async () => { try { const res = await axios.get(ENDPOINTS + URL_CONDICIONES_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  useEffect(() => { getCondiciones(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_CONDICION_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_CONDICION, form); } setForm({ estado: '' }); setEditId(null); getCondiciones(); } catch (error) { console.log('Error al guardar condicion', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar condición?')) { try { await axios.delete(ENDPOINTS + URL_CONDICION_ID(id)); getCondiciones(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ estado: item.estado }); setEditId(item.id_condicion); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item) => (<tr key={item.id_condicion}><td>{item.id_condicion}</td><td>{item.estado}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight: 5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_condicion)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Condición' : 'Agregar Condición'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 20 }}>
        <Form.Group><Form.Label>Estado</Form.Label><Form.Control type="text" value={form.estado} onChange={(e)=>setForm({...form, estado: e.target.value})} required/></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft: 10, marginTop: 10 }} onClick={()=>{setEditId(null); setForm({ estado: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Condiciones;
