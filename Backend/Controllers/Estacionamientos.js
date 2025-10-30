const { connection } = require('../Config/database');

// Obtener todos los estacionamientos
const mostrarEstacionamientos = (req, res) => {
    const query = 'SELECT * FROM Estacionamientos';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los estacionamientos:', error);
            return res.status(500).json({ message: 'Error al obtener los estacionamientos' });
        }
        res.json(results);
    });
};

// Obtener un estacionamiento por ID
const mostrarEstacionamiento = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Estacionamientos WHERE id_estacionamiento = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el estacionamiento:', error);
            return res.status(500).json({ message: 'Error al obtener el estacionamiento' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Estacionamiento no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo estacionamiento
const crearEstacionamiento = (req, res) => {
    const { numero, entrada_exclusiva } = req.body;
    const query = 'INSERT INTO Estacionamientos (numero, entrada_exclusiva) VALUES (?, ?)';
    
    connection.query(query, [numero, entrada_exclusiva], (error, results) => {
        if (error) {
            console.error('Error al crear el estacionamiento:', error);
            return res.status(500).json({ message: 'Error al crear el estacionamiento' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Estacionamiento creado exitosamente' 
        });
    });
};

// Actualizar un estacionamiento
const editarEstacionamiento = (req, res) => {
    const id = req.params.id;
    const { numero, entrada_exclusiva } = req.body;
    const query = 'UPDATE Estacionamientos SET numero = ?, entrada_exclusiva = ? WHERE id_estacionamiento = ?';
    
    connection.query(query, [numero, entrada_exclusiva, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el estacionamiento:', error);
            return res.status(500).json({ message: 'Error al actualizar el estacionamiento' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Estacionamiento no encontrado' });
        }
        res.json({ message: 'Estacionamiento actualizado exitosamente' });
    });
};

// Eliminar un estacionamiento
const eliminarEstacionamiento = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Estacionamientos WHERE id_estacionamiento = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el estacionamiento:', error);
            return res.status(500).json({ message: 'Error al eliminar el estacionamiento' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Estacionamiento no encontrado' });
        }
        res.json({ message: 'Estacionamiento eliminado exitosamente' });
    });
};

module.exports = {
    mostrarEstacionamientos,
    mostrarEstacionamiento,
    crearEstacionamiento,
    editarEstacionamiento,
    eliminarEstacionamiento
};
