import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_DORMITORIOS_LIST, URL_DORMITORIO, URL_DORMITORIO_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Dormitorios = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ numero: '' });
  const [editId, setEditId] = useState(null);

  const getDormitorios = async () => { try { const res = await axios.get(ENDPOINTS + URL_DORMITORIOS_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  useEffect(() => { getDormitorios(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_DORMITORIO_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_DORMITORIO, form); } setForm({ numero: '' }); setEditId(null); getDormitorios(); } catch (error) { console.log('Error al guardar dormitorio', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar dormitorio?')) { try { await axios.delete(ENDPOINTS + URL_DORMITORIO_ID(id)); getDormitorios(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ numero: item.numero }); setEditId(item.id_dormitorio); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Numero</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_dormitorio}><td>{item.id_dormitorio}</td><td>{item.numero}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_dormitorio)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Dormitorio' : 'Agregar Dormitorio'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 20 }}>
        <Form.Group><Form.Label>Numero</Form.Label><Form.Control type="text" value={form.numero} onChange={(e)=>setForm({...form, numero: e.target.value})} required/></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ numero: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Dormitorios;
