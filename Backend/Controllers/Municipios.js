const { connection } = require('../Config/database');

// Obtener todos los municipios
const mostrarMunicipios = (req, res) => {
    const query = 'SELECT m.*, d.nombre as nombre_departamento FROM Municipios m LEFT JOIN Departamentos d ON m.id_departamento = d.id_departamento';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los municipios:', error);
            return res.status(500).json({ message: 'Error al obtener los municipios' });
        }
        res.json(results);
    });
};

// Obtener un municipio por ID
const mostrarMunicipio = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT m.*, d.nombre as nombre_departamento FROM Municipios m LEFT JOIN Departamentos d ON m.id_departamento = d.id_departamento WHERE m.id_municipio = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el municipio:', error);
            return res.status(500).json({ message: 'Error al obtener el municipio' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Municipio no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo municipio
const crearMunicipio = (req, res) => {
    const { nombre, cp, id_departamento } = req.body;
    const query = 'INSERT INTO Municipios (nombre, cp, id_departamento) VALUES (?, ?, ?)';
    
    connection.query(query, [nombre, cp, id_departamento], (error, results) => {
        if (error) {
            console.error('Error al crear el municipio:', error);
            return res.status(500).json({ message: 'Error al crear el municipio' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Municipio creado exitosamente' 
        });
    });
};

// Actualizar un municipio
const editarMunicipio = (req, res) => {
    const id = req.params.id;
    const { nombre, cp, id_departamento } = req.body;
    const query = 'UPDATE Municipios SET nombre = ?, cp = ?, id_departamento = ? WHERE id_municipio = ?';
    
    connection.query(query, [nombre, cp, id_departamento, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el municipio:', error);
            return res.status(500).json({ message: 'Error al actualizar el municipio' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Municipio no encontrado' });
        }
        res.json({ message: 'Municipio actualizado exitosamente' });
    });
};

// Eliminar un municipio
const eliminarMunicipio = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Municipios WHERE id_municipio = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el municipio:', error);
            return res.status(500).json({ message: 'Error al eliminar el municipio' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Municipio no encontrado' });
        }
        res.json({ message: 'Municipio eliminado exitosamente' });
    });
};

module.exports = {
    mostrarMunicipios,
    mostrarMunicipio,
    crearMunicipio,
    editarMunicipio,
    eliminarMunicipio
};
