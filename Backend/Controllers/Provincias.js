const { connection } = require('../Config/database');

// Obtener todas las provincias
const mostrarProvincias = (req, res) => {
    const query = 'SELECT * FROM Provincias';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las provincias:', error);
            return res.status(500).json({ message: 'Error al obtener las provincias' });
        }
        res.json(results);
    });
};

// Obtener una provincia por ID
const mostrarProvincia = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Provincias WHERE id_provincia = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la provincia:', error);
            return res.status(500).json({ message: 'Error al obtener la provincia' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Provincia no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva provincia
const crearProvincia = (req, res) => {
    const { nombre } = req.body;
    const query = 'INSERT INTO Provincias (nombre) VALUES (?)';
    
    connection.query(query, [nombre], (error, results) => {
        if (error) {
            console.error('Error al crear la provincia:', error);
            return res.status(500).json({ message: 'Error al crear la provincia' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Provincia creada exitosamente' 
        });
    });
};

// Actualizar una provincia
const editarProvincia = (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    const query = 'UPDATE Provincias SET nombre = ? WHERE id_provincia = ?';
    
    connection.query(query, [nombre, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la provincia:', error);
            return res.status(500).json({ message: 'Error al actualizar la provincia' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Provincia no encontrada' });
        }
        res.json({ message: 'Provincia actualizada exitosamente' });
    });
};

// Eliminar una provincia
const eliminarProvincia = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Provincias WHERE id_provincia = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la provincia:', error);
            return res.status(500).json({ message: 'Error al eliminar la provincia' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Provincia no encontrada' });
        }
        res.json({ message: 'Provincia eliminada exitosamente' });
    });
};

module.exports = {
    mostrarProvincias,
    mostrarProvincia,
    crearProvincia,
    editarProvincia,
    eliminarProvincia
};
