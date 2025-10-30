const { connection } = require('../Config/database');

// Obtener todas las imágenes
const mostrarImagenes = (req, res) => {
    const query = `
        SELECT i.*, p.titulo as titulo_publicacion
        FROM Imagenes i
        LEFT JOIN Publicaciones p ON i.id_publicacion = p.id_publicacion
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las imágenes:', error);
            return res.status(500).json({ message: 'Error al obtener las imágenes' });
        }
        res.json(results);
    });
};

// Obtener una imagen por ID
const mostrarImagen = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT i.*, p.titulo as titulo_publicacion
        FROM Imagenes i
        LEFT JOIN Publicaciones p ON i.id_publicacion = p.id_publicacion
        WHERE i.id_imagen = ?
    `;
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la imagen:', error);
            return res.status(500).json({ message: 'Error al obtener la imagen' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva imagen
const crearImagen = (req, res) => {
    const { nombre, url, orden, id_publicacion } = req.body;
    const query = 'INSERT INTO Imagenes (nombre, url, orden, id_publicacion) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [nombre, url, orden, id_publicacion], (error, results) => {
        if (error) {
            console.error('Error al crear la imagen:', error);
            return res.status(500).json({ message: 'Error al crear la imagen' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Imagen creada exitosamente' 
        });
    });
};

// Actualizar una imagen
const editarImagen = (req, res) => {
    const id = req.params.id;
    const { nombre, url, orden, id_publicacion } = req.body;
    const query = 'UPDATE Imagenes SET nombre = ?, url = ?, orden = ?, id_publicacion = ? WHERE id_imagen = ?';
    
    connection.query(query, [nombre, url, orden, id_publicacion, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la imagen:', error);
            return res.status(500).json({ message: 'Error al actualizar la imagen' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        res.json({ message: 'Imagen actualizada exitosamente' });
    });
};

// Eliminar una imagen
const eliminarImagen = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Imagenes WHERE id_imagen = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la imagen:', error);
            return res.status(500).json({ message: 'Error al eliminar la imagen' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        res.json({ message: 'Imagen eliminada exitosamente' });
    });
};

module.exports = {
    mostrarImagenes,
    mostrarImagen,
    crearImagen,
    editarImagen,
    eliminarImagen
};
