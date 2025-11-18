const { connection } = require('../Config/database');

//
// 📌 1. OBTENER TODAS LAS PUBLICACIONES
//
const mostrarPublicaciones = (req, res) => {
    const query = `
        SELECT 
            p.*, 
            i.titulo AS titulo_inmueble, 
            i.descripcion AS descripcion_inmueble,
            c.nombre AS categoria_inmueble, 
            ti.tipo_inmueble
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

//
// 📌 2. OBTENER UNA PUBLICACIÓN POR ID
//
const mostrarPublicacion = (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT 
            p.*, 
            i.titulo AS titulo_inmueble, 
            i.descripcion AS descripcion_inmueble,
            c.nombre AS categoria_inmueble, 
            ti.tipo_inmueble
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

//
// 📌 3. CREAR PUBLICACIÓN (siempre arranca en "pendiente")
//
const crearPublicacion = (req, res) => {
    const { precio, titulo, servicios, id_inmueble } = req.body;
    const estado = 'pendiente';

    const query = `
        INSERT INTO Publicaciones (precio, titulo, servicios, id_inmueble, estado)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, [precio, titulo, servicios, id_inmueble, estado], (error, results) => {
        if (error) {
            console.error('Error al crear la publicación:', error);
            return res.status(500).json({ message: 'Error al crear la publicación' });
        }

        res.status(201).json({
            id: results.insertId,
            message: 'Publicación creada exitosamente',
            estado
        });
    });
};

//
// 📌 4. EDITAR PUBLICACIÓN
//
const editarPublicacion = (req, res) => {
    const id = req.params.id;
    const { precio, titulo, servicios, id_inmueble } = req.body;

    const query = `
        UPDATE Publicaciones 
        SET precio = ?, titulo = ?, servicios = ?, id_inmueble = ?
        WHERE id_publicacion = ?
    `;
    
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

//
// 📌 5. ELIMINAR PUBLICACIÓN
//
const eliminarPublicacion = (req, res) => {
    const id = req.params.id;

    const query = `
        DELETE FROM Publicaciones 
        WHERE id_publicacion = ?
    `;
    
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

//
// 📌 6. PUBLICACIONES PENDIENTES (para ADMIN DASHBOARD)
//    ESTE ES EL MÁS IMPORTANTE
//
const mostrarPublicacionesPendientes = (req, res) => {
    const query = `
        SELECT 
            p.id_publicacion,
            p.titulo,
            p.precio,
            p.estado,
            i.titulo AS titulo_inmueble,
            c.nombre AS categoria_inmueble,
            ti.tipo_inmueble
        FROM Publicaciones p
        LEFT JOIN Inmuebles i ON p.id_inmueble = i.id_inmueble
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
        WHERE p.estado = 'pendiente'
        ORDER BY p.id_publicacion DESC
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las publicaciones pendientes:', error);
            return res.status(500).json({ message: 'Error al obtener las publicaciones pendientes' });
        }
        res.json(results);
    });
};

//
// 📌 7. PUBLICACIONES APROBADAS (para página pública VER PROPIEDADES)
//
const mostrarPublicacionesAprobadas = (req, res) => {
    const query = `
        SELECT 
            p.*, 
            i.titulo AS titulo_inmueble,
            c.nombre AS categoria_inmueble,
            ti.tipo_inmueble
        FROM Publicaciones p
        LEFT JOIN Inmuebles i ON p.id_inmueble = i.id_inmueble
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
        WHERE p.estado = 'aprobada'
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener publicaciones aprobadas:', error);
            return res.status(500).json({ message: 'Error al obtener publicaciones aprobadas' });
        }
        res.json(results);
    });
};

//
// 📌 8. APROBAR PUBLICACIÓN
//
const aprobarPublicacion = (req, res) => {
    const id = req.params.id;

    const query = `
        UPDATE Publicaciones 
        SET estado = "aprobada" 
        WHERE id_publicacion = ?
    `;

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al aprobar la publicación:', error);
            return res.status(500).json({ message: 'Error al aprobar la publicación' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json({ message: 'Publicación aprobada correctamente' });
    });
};

//
// 📌 9. RECHAZAR PUBLICACIÓN
//
const rechazarPublicacion = (req, res) => {
    const id = req.params.id;

    const query = `
        UPDATE Publicaciones 
        SET estado = "rechazada" 
        WHERE id_publicacion = ?
    `;

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al rechazar la publicación:', error);
            return res.status(500).json({ message: 'Error al rechazar la publicación' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json({ message: 'Publicación rechazada correctamente' });
    });
};

module.exports = {
    mostrarPublicaciones,
    mostrarPublicacion,
    crearPublicacion,
    editarPublicacion,
    eliminarPublicacion,
    mostrarPublicacionesPendientes,
    mostrarPublicacionesAprobadas,
    aprobarPublicacion,
    rechazarPublicacion
};
