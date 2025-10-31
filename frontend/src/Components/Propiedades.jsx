
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Propiedades = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [selectedPropiedad, setSelectedPropiedad] = useState(null);
    const [newPropiedad, setNewPropiedad] = useState('');
    const [editPropiedad, setEditPropiedad] = useState({ id: null, propiedad: '' });

    // Fetch all propiedades
    useEffect(() => {
        axios.get('/propiedades')
            .then(response => setPropiedades(response.data))
            .catch(error => console.error('Error fetching propiedades:', error));
    }, []);

    // Fetch a single propiedad
    const fetchPropiedad = (id) => {
        axios.get(`/propiedades/${id}`)
            .then(response => setSelectedPropiedad(response.data))
            .catch(error => console.error('Error fetching propiedad:', error));
    };

    // Create a new propiedad
    const createPropiedad = () => {
        axios.post('/propiedades', { propiedad: newPropiedad })
            .then(response => {
                setPropiedades([...propiedades, { id_propiedad: response.data.id, propiedad: newPropiedad }]);
                setNewPropiedad('');
            })
            .catch(error => console.error('Error creating propiedad:', error));
    };

    // Edit an existing propiedad
    const updatePropiedad = () => {
        axios.put(`/propiedades/${editPropiedad.id}`, { propiedad: editPropiedad.propiedad })
            .then(() => {
                setPropiedades(propiedades.map(p => 
                    p.id_propiedad === editPropiedad.id ? { ...p, propiedad: editPropiedad.propiedad } : p
                ));
                setEditPropiedad({ id: null, propiedad: '' });
            })
            .catch(error => console.error('Error updating propiedad:', error));
    };

    // Delete a propiedad
    const deletePropiedad = (id) => {
        axios.delete(`/propiedades/${id}`)
            .then(() => setPropiedades(propiedades.filter(p => p.id_propiedad !== id)))
            .catch(error => console.error('Error deleting propiedad:', error));
    };

    return (
        <div></div>
            <h1>Propiedades</h1>
            <ul>
                {propiedades.map(p => (
                    <li key={p.id_propiedad}>
                        {p.propiedad}
                        <button onClick={() => fetchPropiedad(p.id_propiedad)}>View</button>
                        <button onClick={() => setEditPropiedad({ id: p.id_propiedad, propiedad: p.propiedad })}>Edit</button>
                        <button onClick={() => deletePropiedad(p.id_propiedad)}>Delete</button>
                    </li>
                ))}
            </ul>

            {selectedPropiedad && (
                <div></div>
                    <h2>Selected Propiedad</h2>
                    <p>{selectedPropiedad.propiedad}</p>
                </div>
            )}

            <div>
                <h2>Create Propiedad</h2>
                <input 
                    type="text" 
                    value={newPropiedad} 
                    onChange={(e) => setNewPropiedad(e.target.value)} 
                    placeholder="New propiedad" 
                />
                <button onClick={createPropiedad}>Create</button>
            </div>

            {editPropiedad.id && (
                <div></div>
                    <h2>Edit Propiedad</h2>
                    <input 
                        type="text" 
                        value={editPropiedad.propiedad} 
                        onChange={(e) => setEditPropiedad({ ...editPropiedad, propiedad: e.target.value })} 
                        placeholder="Edit propiedad" 
                    />
                    <button onClick={updatePropiedad}>Update</button>
                </div>
            )}
        </div>
    );
};

export default Propiedades;