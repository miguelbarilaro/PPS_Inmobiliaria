const { connection } = require('../Config/database');

// Obtener todos los ambientes
const mostrarAmbientes = (req, res) => {
    const query = 'SELECT * FROM Ambientes';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los ambientes:', error);
            return res.status(500).json({ message: 'Error al obtener los ambientes' });
        }
        res.json(results);
    });
};

// Obtener un ambiente por ID
const mostrarAmbiente = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Ambientes WHERE id_ambiente = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el ambiente:', error);
            return res.status(500).json({ message: 'Error al obtener el ambiente' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Ambiente no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo ambiente
const crearAmbiente = (req, res) => {
    const { numero } = req.body;
    const query = 'INSERT INTO Ambientes (numero) VALUES (?)';
    
    connection.query(query, [numero], (error, results) => {
        if (error) {
            console.error('Error al crear el ambiente:', error);
            return res.status(500).json({ message: 'Error al crear el ambiente' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Ambiente creado exitosamente' 
        });
    });
};

// Actualizar un ambiente
const editarAmbiente = (req, res) => {
    const id = req.params.id;
    const { numero } = req.body;
    const query = 'UPDATE Ambientes SET numero = ? WHERE id_ambiente = ?';
    
    connection.query(query, [numero, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el ambiente:', error);
            return res.status(500).json({ message: 'Error al actualizar el ambiente' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Ambiente no encontrado' });
        }
        res.json({ message: 'Ambiente actualizado exitosamente' });
    });
};

// Eliminar un ambiente
const eliminarAmbiente = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Ambientes WHERE id_ambiente = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el ambiente:', error);
            return res.status(500).json({ message: 'Error al eliminar el ambiente' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Ambiente no encontrado' });
        }
        res.json({ message: 'Ambiente eliminado exitosamente' });
    });
};

module.exports = {
    mostrarAmbientes,
    mostrarAmbiente,
    crearAmbiente,
    editarAmbiente,
    eliminarAmbiente
};
