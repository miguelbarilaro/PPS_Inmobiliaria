import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_DEPARTAMENTOS_LIST, URL_DEPARTAMENTO, URL_DEPARTAMENTO_ID, URL_PROVINCIAS_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Departamentos = () => {
  const [datos, setData] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [form, setForm] = useState({ nombre: '', id_provincia: '' });
  const [editId, setEditId] = useState(null);

  const getDepartamentos = async () => { try { const res = await axios.get(ENDPOINTS + URL_DEPARTAMENTOS_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  const getProvincias = async () => { try { const res = await axios.get(ENDPOINTS + URL_PROVINCIAS_LIST); setProvincias(res.data); } catch (error) { console.log('Error provincias', error); } };

  useEffect(() => { getDepartamentos(); getProvincias(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_DEPARTAMENTO_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_DEPARTAMENTO, form); } setForm({ nombre: '', id_provincia: '' }); setEditId(null); getDepartamentos(); } catch (error) { console.log('Error al guardar departamento', error); } };

  const handleDelete = async (id) => { if (window.confirm('¿Eliminar departamento?')) { try { await axios.delete(ENDPOINTS + URL_DEPARTAMENTO_ID(id)); getDepartamentos(); } catch (error) { console.log('Error', error); } } };

  const handleEdit = (item) => { setForm({ nombre: item.nombre, id_provincia: item.id_provincia || '' }); setEditId(item.id_departamento); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Nombre</th><th>Provincia</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item) => (<tr key={item.id_departamento}><td>{item.id_departamento}</td><td>{item.nombre}</td><td>{item.nombre_provincia || item.id_provincia}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight: 5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_departamento)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Departamento' : 'Agregar Departamento'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 600, marginBottom: 20 }}>
        <Form.Group><Form.Label>Nombre</Form.Label><Form.Control type="text" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>Provincia</Form.Label><Form.Control as="select" value={form.id_provincia} onChange={(e)=>setForm({...form, id_provincia: e.target.value})}>
          <option value="">Seleccione</option>
          {provincias.map(p => (<option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>))}
        </Form.Control></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft: 10, marginTop: 10 }} onClick={()=>{setEditId(null); setForm({ nombre: '', id_provincia: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Departamentos;
