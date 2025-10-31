import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Autorizadas = () => {
    const [autorizadas, setAutorizadas] = useState([]);
    const [selectedAutorizada, setSelectedAutorizada] = useState(null);
    const [newAutorizada, setNewAutorizada] = useState('');
    const [editAutorizada, setEditAutorizada] = useState({ id: null, autorizada: '' });

    // Fetch all autorizadas
    useEffect(() => {
        axios.get('/autorizadas')
            .then(response => setAutorizadas(response.data))
            .catch(error => console.error('Error fetching autorizadas:', error));
    }, []);

    // Fetch a single autorizada
    const fetchAutorizada = (id) => {
        axios.get(`/autorizadas/${id}`)
            .then(response => setSelectedAutorizada(response.data))
            .catch(error => console.error('Error fetching autorizada:', error));
    };

    // Create a new autorizada
    const createAutorizada = () => {
        axios.post('/autorizadas', { autorizada: newAutorizada })
            .then(response => {
                setAutorizadas([...autorizadas, { id_autorizada: response.data.id, autorizada: newAutorizada }]);
                setNewAutorizada('');
            })
            .catch(error => console.error('Error creating autorizada:', error));
    };

    // Edit an existing autorizada
    const updateAutorizada = () => {
        axios.put(`/autorizadas/${editAutorizada.id}`, { autorizada: editAutorizada.autorizada })
            .then(() => {
                setAutorizadas(autorizadas.map(a => 
                    a.id_autorizada === editAutorizada.id ? { ...a, autorizada: editAutorizada.autorizada } : a
                ));
                setEditAutorizada({ id: null, autorizada: '' });
            })
            .catch(error => console.error('Error updating autorizada:', error));
    };

    // Delete an autorizada
    const deleteAutorizada = (id) => {
        axios.delete(`/autorizadas/${id}`)
            .then(() => setAutorizadas(autorizadas.filter(a => a.id_autorizada !== id)))
            .catch(error => console.error('Error deleting autorizada:', error));
    };

    return (
        <div>
            <h1>Autorizadas</h1>
            <ul>
                {autorizadas.map(a => (
                    <li key={a.id_autorizada}>
                        {a.autorizada}
                        <button onClick={() => fetchAutorizada(a.id_autorizada)}>View</button>
                        <button onClick={() => setEditAutorizada({ id: a.id_autorizada, autorizada: a.autorizada })}>Edit</button>
                        <button onClick={() => deleteAutorizada(a.id_autorizada)}>Delete</button>
                    </li>
                ))}
            </ul>

            {selectedAutorizada && (
                <div>
                    <h2>Selected Autorizada</h2>
                    <p>{selectedAutorizada.autorizada}</p>
                </div>
            )}

            <div>
                <h2>Create Autorizada</h2>
                <input 
                    type="text" 
                    value={newAutorizada} 
                    onChange={(e) => setNewAutorizada(e.target.value)} 
                    placeholder="New autorizada" 
                />
                <button onClick={createAutorizada}>Create</button>
            </div>

            {editAutorizada.id && (
                <div>
                    <h2>Edit Autorizada</h2>
                    <input 
                        type="text" 
                        value={editAutorizada.autorizada} 
                        onChange={(e) => setEditAutorizada({ ...editAutorizada, autorizada: e.target.value })} 
                        placeholder="Edit autorizada" 
                    />
                    <button onClick={updateAutorizada}>Update</button>
                </div>
            )}
        </div>
    );
};

export default Autorizadas;
