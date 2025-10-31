import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_CITAS_LIST, URL_CITA, URL_CITA_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Citas = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ mensaje: '', estado: '', id_publicacion: '', id_cliente: '' });
  const [editId, setEditId] = useState(null);

  const getCitas = async () => {
    try {
      const response = await axios.get(ENDPOINTS + URL_CITAS_LIST);
      setData(response.data);
    } catch (error) {
      console.log('Error al obtener las citas', error);
    }
  };

  useEffect(() => { getCitas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(ENDPOINTS + URL_CITA_ID(editId), form);
      } else {
        await axios.post(ENDPOINTS + URL_CITA, form);
      }
      setForm({ mensaje: '', estado: '', id_publicacion: '', id_cliente: '' });
      setEditId(null);
      getCitas();
    } catch (error) { console.log('Error al guardar la cita', error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta cita?')) {
      try { await axios.delete(ENDPOINTS + URL_CITA_ID(id)); getCitas(); } catch (error) { console.log('Error al eliminar la cita', error); }
    }
  };

  const handleEdit = (item) => { setForm({ mensaje: item.mensaje, estado: item.estado, id_publicacion: item.id_publicacion, id_cliente: item.id_cliente }); setEditId(item.id_cita); };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr><th>id</th><th>Mensaje</th><th>Estado</th><th>Id Publicación</th><th>Id Cliente</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {datos.map((item) => (
            <tr key={item.id_cita}>
              <td>{item.id_cita}</td>
              <td>{item.mensaje}</td>
              <td>{item.estado}</td>
              <td>{item.id_publicacion}</td>
              <td>{item.id_cliente}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)} style={{ marginRight: 5 }}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id_cita)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr />
      <h3>{editId ? 'Editar Cita' : 'Agregar Cita'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 600, marginBottom: 20 }}>
        <Form.Group>
          <Form.Label>Mensaje</Form.Label>
          <Form.Control type="text" value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Estado</Form.Label>
          <Form.Control type="text" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Id Publicación</Form.Label>
          <Form.Control type="text" value={form.id_publicacion} onChange={(e) => setForm({ ...form, id_publicacion: e.target.value })} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Id Cliente</Form.Label>
          <Form.Control type="text" value={form.id_cliente} onChange={(e) => setForm({ ...form, id_cliente: e.target.value })} />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>{editId ? 'Actualizar' : 'Agregar'}</Button>
        {editId && (<Button variant="secondary" style={{ marginLeft: 10, marginTop: 10 }} onClick={() => { setEditId(null); setForm({ mensaje: '', estado: '', id_publicacion: '', id_cliente: '' }); }}>Cancelar</Button>)}
      </Form>
    </div>
  );
};

export default Citas;
