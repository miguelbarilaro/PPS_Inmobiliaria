import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_MUNICIPIOS_LIST, URL_MUNICIPIO, URL_MUNICIPIO_ID, URL_DEPARTAMENTOS_LIST } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Municipios = () => {
  const [datos, setData] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [form, setForm] = useState({ nombre: '', cp: '', id_departamento: '' });
  const [editId, setEditId] = useState(null);

  const getMunicipios = async () => { try { const res = await axios.get(ENDPOINTS + URL_MUNICIPIOS_LIST); setData(res.data); } catch (error) { console.log('Error', error); } };
  const getDepartamentos = async () => { try { const res = await axios.get(ENDPOINTS + URL_DEPARTAMENTOS_LIST); setDepartamentos(res.data); } catch (error) { console.log('Error deps', error); } };

  useEffect(()=>{ getMunicipios(); getDepartamentos(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) { await axios.put(ENDPOINTS + URL_MUNICIPIO_ID(editId), form); } else { await axios.post(ENDPOINTS + URL_MUNICIPIO, form); } setForm({ nombre: '', cp: '', id_departamento: '' }); setEditId(null); getMunicipios(); } catch (error) { console.log('Error guardar municipio', error); } };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar municipio?')) { try { await axios.delete(ENDPOINTS + URL_MUNICIPIO_ID(id)); getMunicipios(); } catch (error) { console.log('Error', error); } } };
  const handleEdit = (item) => { setForm({ nombre: item.nombre, cp: item.cp, id_departamento: item.id_departamento }); setEditId(item.id_municipio); };

  return (
    <div>
      <Table striped bordered hover>
        <thead><tr><th>id</th><th>Nombre</th><th>CP</th><th>Departamento</th><th>Acciones</th></tr></thead>
        <tbody>{datos.map((item)=>(<tr key={item.id_municipio}><td>{item.id_municipio}</td><td>{item.nombre}</td><td>{item.cp}</td><td>{item.nombre_departamento || item.id_departamento}</td><td><Button variant="warning" size="sm" onClick={()=>handleEdit(item)} style={{ marginRight:5 }}>Editar</Button><Button variant="danger" size="sm" onClick={()=>handleDelete(item.id_municipio)}>Eliminar</Button></td></tr>))}</tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Municipio' : 'Agregar Municipio'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 600, marginBottom: 20 }}>
        <Form.Group><Form.Label>Nombre</Form.Label><Form.Control type="text" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} required/></Form.Group>
        <Form.Group><Form.Label>CP</Form.Label><Form.Control type="text" value={form.cp} onChange={(e)=>setForm({...form, cp: e.target.value})} /></Form.Group>
        <Form.Group><Form.Label>Departamento</Form.Label><Form.Control as="select" value={form.id_departamento} onChange={(e)=>setForm({...form, id_departamento: e.target.value})}><option value="">Seleccione</option>{departamentos.map(d=>(<option key={d.id_departamento} value={d.id_departamento}>{d.nombre}</option>))}</Form.Control></Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop:10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft:10, marginTop:10 }} onClick={()=>{setEditId(null); setForm({ nombre: '', cp: '', id_departamento: '' });}}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Municipios;
