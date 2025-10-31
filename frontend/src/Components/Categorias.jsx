import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_CATEGORIAS_LIST, URL_CATEGORIA, URL_CATEGORIA_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Categorias = () => {
  const [datos, setData] = useState([]);
  const [form, setForm] = useState({ nombre: '' });
  const [editId, setEditId] = useState(null);

  const getCategorias = async () => {
    try {
      const response = await axios.get(ENDPOINTS + URL_CATEGORIAS_LIST);
      setData(response.data);
    } catch (error) {
      console.log('Error al obtener las categorias', error);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(ENDPOINTS + URL_CATEGORIA_ID(editId), { nombre: form.nombre });
      } else {
        await axios.post(ENDPOINTS + URL_CATEGORIA, { nombre: form.nombre });
      }
      setForm({ nombre: '' });
      setEditId(null);
      getCategorias();
    } catch (error) {
      console.log('Error al guardar la categoria', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
      try {
        await axios.delete(ENDPOINTS + URL_CATEGORIA_ID(id));
        getCategorias();
      } catch (error) {
        console.log('Error al eliminar la categoria', error);
      }
    }
  };

  const handleEdit = (categoria) => {
    setForm({ nombre: categoria.nombre });
    setEditId(categoria.id_categoria);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>id</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => (
            <tr key={item.id_categoria}>
              <td>{item.id_categoria}</td>
              <td>{item.nombre}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)} style={{ marginRight: 5 }}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id_categoria)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr />

      <h3>{editId ? 'Editar Categoría' : 'Agregar Categoría'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 20 }}>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>
          {editId ? 'Actualizar' : 'Agregar'}
        </Button>
        {editId && (
          <Button variant="secondary" style={{ marginLeft: 10, marginTop: 10 }} onClick={() => { setEditId(null); setForm({ nombre: '' }); }}>
            Cancelar
          </Button>
        )}
      </Form>
    </div>
  );
};

export default Categorias;
