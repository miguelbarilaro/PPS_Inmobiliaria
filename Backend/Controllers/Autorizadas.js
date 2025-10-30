const { connection } = require('../Config/database');

// Obtener todas las autorizadas
const mostrarAutorizadas = (req, res) => {
    const query = 'SELECT * FROM Autorizadas';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las autorizadas:', error);
            return res.status(500).json({ message: 'Error al obtener las autorizadas' });
        }
        res.json(results);
    });
};

// Obtener una autorizada por ID
const mostrarAutorizada = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Autorizadas WHERE id_autorizada = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la autorizada:', error);
            return res.status(500).json({ message: 'Error al obtener la autorizada' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Autorizada no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva autorizada
const crearAutorizada = (req, res) => {
    const { autorizada } = req.body;
    const query = 'INSERT INTO Autorizadas (autorizada) VALUES (?)';
    
    connection.query(query, [autorizada], (error, results) => {
        if (error) {
            console.error('Error al crear la autorizada:', error);
            return res.status(500).json({ message: 'Error al crear la autorizada' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Autorizada creada exitosamente' 
        });
    });
};

// Actualizar una autorizada
const editarAutorizada = (req, res) => {
    const id = req.params.id;
    const { autorizada } = req.body;
    const query = 'UPDATE Autorizadas SET autorizada = ? WHERE id_autorizada = ?';
    
    connection.query(query, [autorizada, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la autorizada:', error);
            return res.status(500).json({ message: 'Error al actualizar la autorizada' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Autorizada no encontrada' });
        }
        res.json({ message: 'Autorizada actualizada exitosamente' });
    });
};

// Eliminar una autorizada
const eliminarAutorizada = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Autorizadas WHERE id_autorizada = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la autorizada:', error);
            return res.status(500).json({ message: 'Error al eliminar la autorizada' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Autorizada no encontrada' });
        }
        res.json({ message: 'Autorizada eliminada exitosamente' });
    });
};

module.exports = {
    mostrarAutorizadas,
    mostrarAutorizada,
    crearAutorizada,
    editarAutorizada,
    eliminarAutorizada
};
