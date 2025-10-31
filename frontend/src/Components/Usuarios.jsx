import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_USUARIOS_LIST, URL_USUARIO, URL_USUARIO_ID, URL_PERSONAS_LIST, URL_ROLES_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Usuarios = () => {
  const [datos, setData] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ email: '', contrasena: '', id_persona: '', id_rol: '' });
  const [editId, setEditId] = useState(null);

  const getUsuarios = async () => { try { const res = await axios.get(ENDPOINTS + URL_USUARIOS_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  const getPersonas = async () => { try { const res = await axios.get(ENDPOINTS + URL_PERSONAS_LIST); setPersonas(res.data); } catch (error) { console.log('Error personas', error); } };
  const getRoles = async () => { try { const res = await axios.get(ENDPOINTS + URL_ROLES_LIST); setRoles(res.data); } catch (error) { console.log('Error roles', error); } };

  useEffect(()=>{ getUsuarios(); getPersonas(); getRoles(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_USUARIO_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_USUARIO, form); } setForm({ email: '', contrasena: '', id_persona: '', id_rol: '' }); setEditId(null); getUsuarios(); } catch (error) { console.log('Error guardar usuario', error); } };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar usuario?')) { try { await axios.delete(ENDPOINTS + URL_USUARIO_ID(id)); getUsuarios(); } catch (error) { console.log('Error', error); } } };
  const handleEdit = (item) => { setForm({ email: item.email, contrasena: item.contrasena, id_persona: item.id_persona, id_rol: item.id_rol }); setEditId(item.id_usuario); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Email</th><th>Persona</th><th>Rol</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_usuario}><td>{item.id_usuario}</td><td>{item.email}</td><td>{item.cuil || item.id_persona}</td><td>{item.nombre_rol || item.id_rol}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_usuario)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 600, marginBottom: 20 }}>
        <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Contraseña</Form.Label><Form.Control type="text" value={form.contrasena} onChange={(e)=>setForm({...form, contrasena: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Persona</Form.Label><Form.Control as="select" value={form.id_persona} onChange={(e)=>setForm({...form, id_persona: e.target.value})}><option value="">Seleccione</option>{personas.map(p=>(<option key={p.id_persona} value={p.id_persona}>{p.cuil}</option>))}</Form.Control></Form.Group>
        <Form.Group><Form.Label>Rol</Form.Label><Form.Control as="select" value={form.id_rol} onChange={(e)=>setForm({...form, id_rol: e.target.value})}><option value="">Seleccione</option>{roles.map(r=>(<option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>))}</Form.Control></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ email: '', contrasena: '', id_persona: '', id_rol: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Usuarios;
