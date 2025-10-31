import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_PERSONAS_LIST, URL_PERSONA, URL_PERSONA_ID, URL_DIRECCIONES_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Personas = () => {
  const [datos, setData] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [form, setForm] = useState({ cuil: '', dni: '', fecha_nacimiento: '', edad: '', id_direccion: '' });
  const [editId, setEditId] = useState(null);

  const getPersonas = async () => { try { const res = await axios.get(ENDPOINTS + URL_PERSONAS_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  const getDirecciones = async () => { try { const res = await axios.get(ENDPOINTS + URL_DIRECCIONES_LIST); setDirecciones(res.data); } catch (error) { console.log('Error dirs', error); } };

  useEffect(()=>{ getPersonas(); getDirecciones(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_PERSONA_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_PERSONA, form); } setForm({ cuil: '', dni: '', fecha_nacimiento: '', edad: '', id_direccion: '' }); setEditId(null); getPersonas(); } catch (error) { console.log('Error guardar persona', error); } };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar persona?')) { try { await axios.delete(ENDPOINTS + URL_PERSONA_ID(id)); getPersonas(); } catch (error) { console.log('Error', error); } } };
  const handleEdit = (item) => { setForm({ cuil: item.cuil, dni: item.dni, fecha_nacimiento: item.fecha_nacimiento, edad: item.edad, id_direccion: item.id_direccion }); setEditId(item.id_persona); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>CUIL</th><th>DNI</th><th>Edad</th><th>Dirección</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_persona}><td>{item.id_persona}</td><td>{item.cuil}</td><td>{item.dni}</td><td>{item.edad}</td><td>{item.calle || item.id_direccion}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_persona)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Persona' : 'Agregar Persona'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 700, marginBottom: 20 }}>
        <Form.Group><Form.Label>CUIL</Form.Label><Form.Control type="text" value={form.cuil} onChange={(e)=>setForm({...form, cuil: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>DNI</Form.Label><Form.Control type="text" value={form.dni} onChange={(e)=>setForm({...form, dni: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Fecha Nacimiento</Form.Label><Form.Control type="text" value={form.fecha_nacimiento} onChange={(e)=>setForm({...form, fecha_nacimiento: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Edad</Form.Label><Form.Control type="text" value={form.edad} onChange={(e)=>setForm({...form, edad: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Dirección</Form.Label><Form.Control as="select" value={form.id_direccion} onChange={(e)=>setForm({...form, id_direccion: e.target.value})}><option value="">Seleccione</option>{direcciones.map(d=>(<option key={d.id_direccion} value={d.id_direccion}>{d.calle} {d.numero}</option>))}</Form.Control></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ cuil: '', dni: '', fecha_nacimiento: '', edad: '', id_direccion: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Personas;
