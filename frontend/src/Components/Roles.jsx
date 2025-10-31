import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_ROLES_LIST, URL_ROL, URL_ROL_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Roles = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ nombre_rol: '' });
  const [editId, setEditId] = useState(null);

  const getRoles = async () => { try { const res = await axios.get(ENDPOINTS + URL_ROLES_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  useEffect(()=>{ getRoles(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_ROL_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_ROL, form); } setForm({ nombre_rol: '' }); setEditId(null); getRoles(); } catch (error) { console.log('Error guardar rol', error); } };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar rol?')) { try { await axios.delete(ENDPOINTS + URL_ROL_ID(id)); getRoles(); } catch (error) { console.log('Error', error); } } };
  const handleEdit = (item) => { setForm({ nombre_rol: item.nombre_rol }); setEditId(item.id_rol); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Nombre Rol</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_rol}><td>{item.id_rol}</td><td>{item.nombre_rol}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_rol)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Rol' : 'Agregar Rol'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 20 }}>
        <Form.Group><Form.Label>Nombre Rol</Form.Label><Form.Control type="text" value={form.nombre_rol} onChange={(e)=>setForm({...form, nombre_rol: e.target.value})} required/></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ nombre_rol: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Roles;
