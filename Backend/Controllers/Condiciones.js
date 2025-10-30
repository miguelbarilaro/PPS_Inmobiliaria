const { connection } = require('../Config/database');

// Obtener todas las condiciones
const mostrarCondiciones = (req, res) => {
    const query = 'SELECT * FROM Condiciones';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las condiciones:', error);
            return res.status(500).json({ message: 'Error al obtener las condiciones' });
        }
        res.json(results);
    });
};

// Obtener una condición por ID
const mostrarCondicion = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Condiciones WHERE id_condicion = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la condición:', error);
            return res.status(500).json({ message: 'Error al obtener la condición' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Condición no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva condición
const crearCondicion = (req, res) => {
    const { estado } = req.body;
    const query = 'INSERT INTO Condiciones (estado) VALUES (?)';
    
    connection.query(query, [estado], (error, results) => {
        if (error) {
            console.error('Error al crear la condición:', error);
            return res.status(500).json({ message: 'Error al crear la condición' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Condición creada exitosamente' 
        });
    });
};

// Actualizar una condición
const editarCondicion = (req, res) => {
    const id = req.params.id;
    const { estado } = req.body;
    const query = 'UPDATE Condiciones SET estado = ? WHERE id_condicion = ?';
    
    connection.query(query, [estado, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la condición:', error);
            return res.status(500).json({ message: 'Error al actualizar la condición' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Condición no encontrada' });
        }
        res.json({ message: 'Condición actualizada exitosamente' });
    });
};

// Eliminar una condición
const eliminarCondicion = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Condiciones WHERE id_condicion = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la condición:', error);
            return res.status(500).json({ message: 'Error al eliminar la condición' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Condición no encontrada' });
        }
        res.json({ message: 'Condición eliminada exitosamente' });
    });
};

module.exports = {
    mostrarCondiciones,
    mostrarCondicion,
    crearCondicion,
    editarCondicion,
    eliminarCondicion
};
