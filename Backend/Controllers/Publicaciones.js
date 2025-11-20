const { connection } = require('../Config/database');

// 📌 CRUD básico de Publicaciones
// El estado se maneja en la entidad Publicaciones (id_autorizada en Publicaciones)

//
// 📌 1. OBTENER TODAS LAS PUBLICACIONES
//
const mostrarPublicaciones = (req, res) => {
    // Verificamos si la columna id_autorizada existe antes de incluir el JOIN
    connection.query(`SHOW COLUMNS FROM Publicaciones LIKE 'id_autorizada'`, (err, cols) => {
        if (err) {
            console.error('Error al verificar columnas de Publicaciones:', err);
            return res.status(500).json({ message: 'Error interno verificando esquema de Publicaciones' });
        }

        const hasColumn = Array.isArray(cols) && cols.length > 0;

        let query;
        if (hasColumn) {
            query = `
                SELECT 
                    p.*, 
                    i.titulo AS titulo_inmueble, 
                    i.descripcion AS descripcion_inmueble,
                    c.nombre AS categoria_inmueble, 
                    ti.tipo_inmueble,
                    a.autorizada AS estado
                FROM Publicaciones p
                LEFT JOIN Inmuebles i ON p.id_inmueble = i.id_inmueble
                LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
                LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
                LEFT JOIN Autorizadas a ON p.id_autorizada = a.id_autorizada
            `;
        } else {
            query = `
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
        }

        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error al obtener las publicaciones:', error);
                return res.status(500).json({ message: 'Error al obtener las publicaciones' });
            }
            res.json(results);
        });
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
// 📌 3. CREAR PUBLICACIÓN
//
const crearPublicacion = (req, res) => {
    const { precio, titulo, servicios, id_inmueble } = req.body;
    // Verificar si la columna id_autorizada existe en Publicaciones
    const checkColumn = `SHOW COLUMNS FROM Publicaciones LIKE 'id_autorizada'`;
    connection.query(checkColumn, (err, cols) => {
        if (err) {
            console.error('Error al verificar columnas de Publicaciones:', err);
            return res.status(500).json({ message: 'Error interno verificando esquema de Publicaciones' });
        }

        const hasColumn = Array.isArray(cols) && cols.length > 0;

        if (!hasColumn) {
            // Si la columna no existe, insertamos sin estado y notificamos al admin
            const queryNoState = `INSERT INTO Publicaciones (precio, titulo, servicios, id_inmueble) VALUES (?, ?, ?, ?)`;
            connection.query(queryNoState, [precio, titulo, servicios, id_inmueble], (error, results) => {
                if (error) {
                    console.error('Error al crear la publicación (sin estado):', error);
                    return res.status(500).json({ message: 'Error al crear la publicación' });
                }
                console.warn('id_autorizada no existe en Publicaciones: la publicación se creó sin estado. Ejecutar ALTER TABLE para añadir la columna.');
                return res.status(201).json({ id_publicacion: results.insertId, message: 'Publicación creada (sin estado)', notice: 'La columna id_autorizada no existe en la tabla Publicaciones. Ejecutar ALTER TABLE para habilitar flujo de aprobación.' });
            });
            return;
        }

        // Asignar estado 'pendiente' por defecto (id_autorizada correspondiente)
        const queryPendiente = `SELECT id_autorizada FROM Autorizadas WHERE autorizada = 'pendiente' LIMIT 1`;

        connection.query(queryPendiente, (err2, rows) => {
            if (err2 || rows.length === 0) {
                console.error('Error al obtener estado pendiente:', err2);
                return res.status(500).json({ message: 'Error: estado pendiente no encontrado' });
            }

            const idPendiente = rows[0].id_autorizada;

            const query = `
                INSERT INTO Publicaciones (precio, titulo, servicios, id_inmueble, id_autorizada)
                VALUES (?, ?, ?, ?, ?)
            `;

            connection.query(query, [precio, titulo, servicios, id_inmueble, idPendiente], (error, results) => {
                if (error) {
                    console.error('Error al crear la publicación:', error);
                    return res.status(500).json({ message: 'Error al crear la publicación' });
                }

                res.status(201).json({
                    id_publicacion: results.insertId,
                    message: 'Publicación creada exitosamente',
                    estado: 'pendiente'
                });
            });
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

// Mostrar publicaciones pendientes (para admin)
const mostrarPublicacionesPendientes = (req, res) => {
    // Verificar existencia de la columna id_autorizada
    connection.query(`SHOW COLUMNS FROM Publicaciones LIKE 'id_autorizada'`, (err, cols) => {
        if (err) {
            console.error('Error al verificar columnas de Publicaciones:', err);
            return res.status(500).json({ message: 'Error interno verificando esquema de Publicaciones' });
        }

        if (!Array.isArray(cols) || cols.length === 0) {
            console.error('Columna id_autorizada no encontrada en Publicaciones.');
            return res.status(500).json({ message: 'Falta la columna id_autorizada en Publicaciones. Ejecutar ALTER TABLE para añadirla.' , sql: "ALTER TABLE Publicaciones ADD COLUMN id_autorizada INT DEFAULT 1;"});
        }

        const query = `
            SELECT p.*, i.titulo AS titulo_inmueble, c.nombre AS categoria_inmueble, ti.tipo_inmueble, a.autorizada AS estado
            FROM Publicaciones p
            LEFT JOIN Inmuebles i ON p.id_inmueble = i.id_inmueble
            LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
            LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
            LEFT JOIN Autorizadas a ON p.id_autorizada = a.id_autorizada
            WHERE a.autorizada = 'pendiente'
            ORDER BY p.id_publicacion DESC
        `;

        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error al obtener las publicaciones pendientes:', error);
                return res.status(500).json({ message: 'Error al obtener las publicaciones pendientes' });
            }
            res.json(results);
        });
    });
};

// Mostrar publicaciones aprobadas (público)
const mostrarPublicacionesAprobadas = (req, res) => {
    // Verificar existencia de la columna id_autorizada
    connection.query(`SHOW COLUMNS FROM Publicaciones LIKE 'id_autorizada'`, (err, cols) => {
        if (err) {
            console.error('Error al verificar columnas de Publicaciones:', err);
            return res.status(500).json({ message: 'Error interno verificando esquema de Publicaciones' });
        }

        if (!Array.isArray(cols) || cols.length === 0) {
            console.error('Columna id_autorizada no encontrada en Publicaciones.');
            return res.status(500).json({ message: 'Falta la columna id_autorizada en Publicaciones. Ejecutar ALTER TABLE para añadirla.' , sql: "ALTER TABLE Publicaciones ADD COLUMN id_autorizada INT DEFAULT 1;"});
        }

        const query = `
            SELECT p.*, 
                   i.titulo AS titulo_inmueble, 
                   i.descripcion AS descripcion_inmueble, 
                   i.id_tipo_inmueble,
                   i.id_ambiente,
                   i.id_dormitorio,
                   i.id_condicion,
                   c.nombre AS categoria_inmueble, 
                   c.id_categoria,
                   ti.tipo_inmueble, 
                   a.autorizada AS estado_autorizado,
                   d.id_municipio,
                   m.id_departamento,
                   dep.id_provincia
            FROM Publicaciones p
            LEFT JOIN Inmuebles i ON p.id_inmueble = i.id_inmueble
            LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
            LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
            LEFT JOIN Autorizadas a ON p.id_autorizada = a.id_autorizada
            LEFT JOIN Direcciones d ON i.id_direccion = d.id_direccion
            LEFT JOIN Municipios m ON d.id_municipio = m.id_municipio
            LEFT JOIN Departamentos dep ON m.id_departamento = dep.id_departamento
            WHERE a.autorizada = 'aprobada'
            ORDER BY p.id_publicacion DESC
        `;

        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error al obtener publicaciones aprobadas:', error);
                return res.status(500).json({ message: 'Error al obtener publicaciones aprobadas' });
            }
            res.json(results);
        });
    });
};

// Aprobar publicación (cambiar id_autorizada a 'aprobada')
const aprobarPublicacion = (req, res) => {
    const id = req.params.id;
    // Verificar que la columna exista
    connection.query(`SHOW COLUMNS FROM Publicaciones LIKE 'id_autorizada'`, (err, cols) => {
        if (err) {
            console.error('Error al verificar columnas de Publicaciones:', err);
            return res.status(500).json({ message: 'Error interno verificando esquema de Publicaciones' });
        }

        if (!Array.isArray(cols) || cols.length === 0) {
            console.error('Columna id_autorizada no encontrada en Publicaciones.');
            return res.status(500).json({ message: 'Falta la columna id_autorizada en Publicaciones. Ejecutar ALTER TABLE para añadirla.', sql: "ALTER TABLE Publicaciones ADD COLUMN id_autorizada INT DEFAULT 1;" });
        }

        const queryAprobada = `SELECT id_autorizada FROM Autorizadas WHERE autorizada = 'aprobada' LIMIT 1`;

        connection.query(queryAprobada, (error, rows) => {
            if (error || rows.length === 0) {
                console.error('Error al obtener estado aprobada:', error);
                return res.status(500).json({ message: 'Error: estado aprobada no encontrado' });
            }

            const idAprobada = rows[0].id_autorizada;
            const query = `UPDATE Publicaciones SET id_autorizada = ? WHERE id_publicacion = ?`;

            connection.query(query, [idAprobada, id], (err2, results) => {
                if (err2) {
                    console.error('Error al aprobar publicación:', err2);
                    return res.status(500).json({ message: 'Error al aprobar publicación' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: 'Publicación no encontrada' });
                }
                res.json({ message: 'Publicación aprobada exitosamente' });
            });
        });
    });
};

// Rechazar publicación (eliminar)
const rechazarPublicacion = (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM Publicaciones WHERE id_publicacion = ?`;

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
