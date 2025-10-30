const { connection } = require('../Config/database');

// Obtener todos los tipos de inmuebles
const mostrarTipoInmuebles = (req, res) => {
    const query = 'SELECT * FROM Tipo_Inmuebles';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los tipos de inmuebles:', error);
            return res.status(500).json({ message: 'Error al obtener los tipos de inmuebles' });
        }
        res.json(results);
    });
};

// Obtener un tipo de inmueble por ID
const mostrarTipoInmueble = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Tipo_Inmuebles WHERE id_tipo_inmueble = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el tipo de inmueble:', error);
            return res.status(500).json({ message: 'Error al obtener el tipo de inmueble' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Tipo de inmueble no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo tipo de inmueble
const crearTipoInmueble = (req, res) => {
    const { tipo_inmueble } = req.body;
    const query = 'INSERT INTO Tipo_Inmuebles (tipo_inmueble) VALUES (?)';
    
    connection.query(query, [tipo_inmueble], (error, results) => {
        if (error) {
            console.error('Error al crear el tipo de inmueble:', error);
            return res.status(500).json({ message: 'Error al crear el tipo de inmueble' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Tipo de inmueble creado exitosamente' 
        });
    });
};

// Actualizar un tipo de inmueble
const editarTipoInmueble = (req, res) => {
    const id = req.params.id;
    const { tipo_inmueble } = req.body;
    const query = 'UPDATE Tipo_Inmuebles SET tipo_inmueble = ? WHERE id_tipo_inmueble = ?';
    
    connection.query(query, [tipo_inmueble, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el tipo de inmueble:', error);
            return res.status(500).json({ message: 'Error al actualizar el tipo de inmueble' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de inmueble no encontrado' });
        }
        res.json({ message: 'Tipo de inmueble actualizado exitosamente' });
    });
};

// Eliminar un tipo de inmueble
const eliminarTipoInmueble = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Tipo_Inmuebles WHERE id_tipo_inmueble = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el tipo de inmueble:', error);
            return res.status(500).json({ message: 'Error al eliminar el tipo de inmueble' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de inmueble no encontrado' });
        }
        res.json({ message: 'Tipo de inmueble eliminado exitosamente' });
    });
};

module.exports = {
    mostrarTipoInmuebles,
    mostrarTipoInmueble,
    crearTipoInmueble,
    editarTipoInmueble,
    eliminarTipoInmueble
};
