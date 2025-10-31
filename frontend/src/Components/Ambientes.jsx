import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENDPOINTS, URL_AMBIENTES_LIST, URL_AMBIENTE, URL_AMBIENTE_ID } from '../Endpoints/endpoint';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const Ambientes = () => {
    const [datos, setData] = useState([]);
    const [form, setForm] = useState({ nombre: '', email: '' });
    const [editId, setEditId] = useState(null);

    const getAmbientes = async () => {
        try {
            const response = await axios.get(ENDPOINTS + URL_AMBIENTES_LIST);
            setData(response.data);
        } catch (error) {
            console.log("Error", error);
        }
    };

    useEffect(() => {
        getAmbientes();
    }, []);

    // Crear o actualizar Ambiente
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(ENDPOINTS + URL_AMBIENTE_ID(editId), {
                    nombre: form.nombre,
                    email: form.email
                });
            } else {
                await axios.post(ENDPOINTS + URL_AMBIENTE, {
                    nombre: form.nombre,
                    email: form.email
                });
            }
            setForm({ nombre: '', email: '' });
            setEditId(null);
            getAmbientes();
        } catch (error) {
            console.log("Error al guardar el Ambiente", error);
        }
    };

    // Eliminar ambiente
    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este ambiente?')) {
            try {
                await axios.delete(ENDPOINTS + URL_AMBIENTE_ID(id));
                getAmbientes();
            } catch (error) {
                console.log("Error al eliminar el ambiente", error);
            }
        }
    };

    // Editar Ambiente
    const handleEdit = (ambiente) => {
        setForm({ nombre: ambiente.nombre, });
        setEditId(ambiente.id_ambiente);
    };

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>

                        <th>     </th>

                    </tr>
                </thead>
                <tbody>
                    {datos.map((ambiente) => (
                        <tr key={ambiente.id_estudiante}>
                            <td>{ambiente.id_estudiante}</td>
                            <td>{ambiente.nombre}</td>

                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleEdit(ambiente)}
                                    style={{ marginRight: 5 }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(ambiente.id_ambiente)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <hr />

            <h3>{editId ? 'Editar Ambiente' : 'Agregar Ambiente'}</h3>
            <Form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 20 }}>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" style={{ marginTop: 10 }}>
                    {editId ? 'Actualizar' : 'Agregar'}
                </Button>
                {editId && (
                    <Button
                        variant="secondary"
                        style={{ marginLeft: 10, marginTop: 10 }}
                        onClick={() => {
                            setEditId(null);
                            setForm({ nombre: ''});
                        }}
                    >
                        Cancelar
                    </Button>
                )}
            </Form>


        </div>
    );
};

export default Ambientes;