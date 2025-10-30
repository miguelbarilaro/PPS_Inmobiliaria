const { connection } = require('../Config/database');

// Obtener todas las citas
const mostrarCitas = (req, res) => {
    const query = 'SELECT * FROM Citas';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las citas:', error);
            return res.status(500).json({ message: 'Error al obtener las citas' });
        }
        res.json(results);
    });
};

// Obtener una cita por ID
const mostrarCita = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Citas WHERE id_cita = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la cita:', error);
            return res.status(500).json({ message: 'Error al obtener la cita' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva cita
const crearCita = (req, res) => {
    const { mensaje, estado, id_publicacion, id_cliente } = req.body;
    const query = 'INSERT INTO Citas (mensaje, estado, id_publicacion, id_cliente) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [mensaje, estado, id_publicacion, id_cliente], (error, results) => {
        if (error) {
            console.error('Error al crear la cita:', error);
            return res.status(500).json({ message: 'Error al crear la cita' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Cita creada exitosamente' 
        });
    });
};

// Actualizar una cita
const editarCita = (req, res) => {
    const id = req.params.id;
    const { mensaje, estado, id_publicacion, id_cliente } = req.body;
    const query = 'UPDATE Citas SET mensaje = ?, estado = ?, id_publicacion = ?, id_cliente = ? WHERE id_cita = ?';
    
    connection.query(query, [mensaje, estado, id_publicacion, id_cliente, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la cita:', error);
            return res.status(500).json({ message: 'Error al actualizar la cita' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        res.json({ message: 'Cita actualizada exitosamente' });
    });
};

// Eliminar una cita
const eliminarCita = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Citas WHERE id_cita = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la cita:', error);
            return res.status(500).json({ message: 'Error al eliminar la cita' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        res.json({ message: 'Cita eliminada exitosamente' });
    });
};

module.exports = {
    mostrarCitas,
    mostrarCita,
    crearCita,
    editarCita,
    eliminarCita
};
