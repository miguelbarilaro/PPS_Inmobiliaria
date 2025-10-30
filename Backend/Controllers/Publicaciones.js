const { connection } = require('../Config/database');

// Obtener todas las publicaciones
const mostrarPublicaciones = (req, res) => {
    const query = `
        SELECT p.*, i.titulo as titulo_inmueble, i.descripcion as descripcion_inmueble,
               c.nombre as categoria_inmueble, ti.tipo_inmueble
        FROM Publicaciones p
        LEFT JOIN Inmuebles i ON p.id_inmueble = i.id_inmueble
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las publicaciones:', error);
            return res.status(500).json({ message: 'Error al obtener las publicaciones' });
        }
        res.json(results);
    });
};

// Obtener una publicación por ID
const mostrarPublicacion = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT p.*, i.titulo as titulo_inmueble, i.descripcion as descripcion_inmueble,
               c.nombre as categoria_inmueble, ti.tipo_inmueble
        FROM Publicaciones p
        LEFT JOIN Inmuebles i ON p.id_inmueble = i.id_inmueble
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
        WHERE p.id_publicacion = ?
    `;
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la publicación:', error);
            return res.status(500).json({ message: 'Error al obtener la publicación' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva publicación
const crearPublicacion = (req, res) => {
    const { precio, titulo, servicios, id_inmueble } = req.body;
    const query = 'INSERT INTO Publicaciones (precio, titulo, servicios, id_inmueble) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [precio, titulo, servicios, id_inmueble], (error, results) => {
        if (error) {
            console.error('Error al crear la publicación:', error);
            return res.status(500).json({ message: 'Error al crear la publicación' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Publicación creada exitosamente' 
        });
    });
};

// Actualizar una publicación
const editarPublicacion = (req, res) => {
    const id = req.params.id;
    const { precio, titulo, servicios, id_inmueble } = req.body;
    const query = 'UPDATE Publicaciones SET precio = ?, titulo = ?, servicios = ?, id_inmueble = ? WHERE id_publicacion = ?';
    
    connection.query(query, [precio, titulo, servicios, id_inmueble, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la publicación:', error);
            return res.status(500).json({ message: 'Error al actualizar la publicación' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json({ message: 'Publicación actualizada exitosamente' });
    });
};

// Eliminar una publicación
const eliminarPublicacion = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Publicaciones WHERE id_publicacion = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la publicación:', error);
            return res.status(500).json({ message: 'Error al eliminar la publicación' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json({ message: 'Publicación eliminada exitosamente' });
    });
};

module.exports = {
    mostrarPublicaciones,
    mostrarPublicacion,
    crearPublicacion,
    editarPublicacion,
    eliminarPublicacion
};
