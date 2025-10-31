import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_CLIENTES_LIST, URL_CLIENTE, URL_CLIENTE_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Clientes = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ tipo: '', categoria_fiscal: '', id_usuario: '' });
  const [editId, setEditId] = useState(null);

  const getClientes = async () => {
    try { const res = await axios.get(ENDPOINTS + URL_CLIENTES_LIST); setData(res.data); } catch (error) { console.log('Error', error); }
  };
  useEffect(() => { getClientes(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_CLIENTE_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_CLIENTE, form); } setForm({ tipo: '', categoria_fiscal: '', id_usuario: '' }); setEditId(null); getClientes(); } catch (error) { console.log('Error al guardar cliente', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar cliente?')) { try { await axios.delete(ENDPOINTS + URL_CLIENTE_ID(id)); getClientes(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ tipo: item.tipo, categoria_fiscal: item.categoria_fiscal, id_usuario: item.id_usuario }); setEditId(item.id_cliente); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Tipo</th><th>Categoria Fiscal</th><th>Id Usuario</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item) => (<tr key={item.id_cliente}><td>{item.id_cliente}</td><td>{item.tipo}</td><td>{item.categoria_fiscal}</td><td>{item.id_usuario}</td><td><Button variant="warning" size="sm" onClick={() => handleEdit(item)} style={{ marginRight: 5 }}>Editar</Button><Button variant="danger" size="sm" onClick={() => handleDelete(item.id_cliente)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Cliente' : 'Agregar Cliente'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 600, marginBottom: 20 }}>
        <Form.Group><Form.Label>Tipo</Form.Label><Form.Control type="text" value={form.tipo} onChange={(e)=>setForm({...form, tipo: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Categoria Fiscal</Form.Label><Form.Control type="text" value={form.categoria_fiscal} onChange={(e)=>setForm({...form, categoria_fiscal: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Id Usuario</Form.Label><Form.Control type="text" value={form.id_usuario} onChange={(e)=>setForm({...form, id_usuario: e.target.value})}/></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft: 10, marginTop: 10 }} onClick={()=>{setEditId(null); setForm({ tipo: '', categoria_fiscal: '', id_usuario: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Clientes;
