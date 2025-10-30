const { connection } = require('../Config/database');

// Obtener todas las direcciones
const mostrarDirecciones = (req, res) => {
    const query = `
        SELECT d.*, m.nombre as nombre_municipio, m.cp 
        FROM Direcciones d 
        LEFT JOIN Municipios m ON d.id_municipio = m.id_municipio
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las direcciones:', error);
            return res.status(500).json({ message: 'Error al obtener las direcciones' });
        }
        res.json(results);
    });
};

// Obtener una dirección por ID
const mostrarDireccion = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT d.*, m.nombre as nombre_municipio, m.cp 
        FROM Direcciones d 
        LEFT JOIN Municipios m ON d.id_municipio = m.id_municipio 
        WHERE d.id_direccion = ?
    `;
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la dirección:', error);
            return res.status(500).json({ message: 'Error al obtener la dirección' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva dirección
const crearDireccion = (req, res) => {
    const { id_municipio, calle, numero, ubicacion, observaciones } = req.body;
    const query = 'INSERT INTO Direcciones (id_municipio, calle, numero, ubicacion, observaciones) VALUES (?, ?, ?, ?, ?)';
    
    connection.query(query, [id_municipio, calle, numero, ubicacion, observaciones], (error, results) => {
        if (error) {
            console.error('Error al crear la dirección:', error);
            return res.status(500).json({ message: 'Error al crear la dirección' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Dirección creada exitosamente' 
        });
    });
};

// Actualizar una dirección
const editarDireccion = (req, res) => {
    const id = req.params.id;
    const { id_municipio, calle, numero, ubicacion, observaciones } = req.body;
    const query = 'UPDATE Direcciones SET id_municipio = ?, calle = ?, numero = ?, ubicacion = ?, observaciones = ? WHERE id_direccion = ?';
    
    connection.query(query, [id_municipio, calle, numero, ubicacion, observaciones, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la dirección:', error);
            return res.status(500).json({ message: 'Error al actualizar la dirección' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }
        res.json({ message: 'Dirección actualizada exitosamente' });
    });
};

// Eliminar una dirección
const eliminarDireccion = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Direcciones WHERE id_direccion = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la dirección:', error);
            return res.status(500).json({ message: 'Error al eliminar la dirección' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }
        res.json({ message: 'Dirección eliminada exitosamente' });
    });
};

module.exports = {
    mostrarDirecciones,
    mostrarDireccion,
    crearDireccion,
    editarDireccion,
    eliminarDireccion
};
