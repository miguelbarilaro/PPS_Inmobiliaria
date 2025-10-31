import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_PROVINCIAS_LIST, URL_PROVINCIA, URL_PROVINCIA_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Provincias = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ nombre: '' });
  const [editId, setEditId] = useState(null);

  const getProvincias = async () => { try { const res = await axios.get(ENDPOINTS + URL_PROVINCIAS_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  useEffect(()=>{ getProvincias(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_PROVINCIA_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_PROVINCIA, form); } setForm({ nombre: '' }); setEditId(null); getProvincias(); } catch (error) { console.log('Error guardar provincia', error); } };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar provincia?')) { try { await axios.delete(ENDPOINTS + URL_PROVINCIA_ID(id)); getProvincias(); } catch (error) { console.log('Error', error); } } };
  const handleEdit = (item) => { setForm({ nombre: item.nombre }); setEditId(item.id_provincia); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Nombre</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_provincia}><td>{item.id_provincia}</td><td>{item.nombre}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_provincia)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Provincia' : 'Agregar Provincia'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 20 }}>
        <Form.Group><Form.Label>Nombre</Form.Label><Form.Control type="text" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} required/></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ nombre: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Provincias;
