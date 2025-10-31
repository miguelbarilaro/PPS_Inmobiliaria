import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_ESTACIONAMIENTOS_LIST, URL_ESTACIONAMIENTO, URL_ESTACIONAMIENTO_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Estacionamientos = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ numero: '', entrada_exclusiva: '' });
  const [editId, setEditId] = useState(null);

  const getEstacionamientos = async () => { try { const res = await axios.get(ENDPOINTS + URL_ESTACIONAMIENTOS_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  useEffect(() => { getEstacionamientos(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_ESTACIONAMIENTO_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_ESTACIONAMIENTO, form); } setForm({ numero: '', entrada_exclusiva: '' }); setEditId(null); getEstacionamientos(); } catch (error) { console.log('Error al guardar estacionamiento', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar estacionamiento?')) { try { await axios.delete(ENDPOINTS + URL_ESTACIONAMIENTO_ID(id)); getEstacionamientos(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ numero: item.numero, entrada_exclusiva: item.entrada_exclusiva }); setEditId(item.id_estacionamiento); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Numero</th><th>Entrada Exclusiva</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_estacionamiento}><td>{item.id_estacionamiento}</td><td>{item.numero}</td><td>{item.entrada_exclusiva}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_estacionamiento)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Estacionamiento' : 'Agregar Estacionamiento'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 500, marginBottom: 20 }}>
        <Form.Group><Form.Label>Numero</Form.Label><Form.Control type="text" value={form.numero} onChange={(e)=>setForm({...form, numero: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Entrada Exclusiva</Form.Label><Form.Control type="text" value={form.entrada_exclusiva} onChange={(e)=>setForm({...form, entrada_exclusiva: e.target.value})} /></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ numero: '', entrada_exclusiva: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Estacionamientos;
