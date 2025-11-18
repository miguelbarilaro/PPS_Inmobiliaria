// Ruta para el login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body; // password = texto plano ingresado
  
    const query = `
      SELECT u.*, r.nombre_rol
      FROM Usuarios u
      LEFT JOIN Roles r ON u.id_rol = r.id_rol
      WHERE u.email = ?
    `;
  
    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Error al consultar la base de datos:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error de servidor" });
      }
  
      if (results.length === 0) {
        // Usuario no encontrado
        return res.json({ success: false, message: "Credenciales incorrectas" });
      }
  
      const user = results[0];
  
      try {
        const passwordValida = await bcrypt.compare(
          password,
          user.contrasena // campo de la tabla Usuarios
        );
  
        if (!passwordValida) {
          return res.json({
            success: false,
            message: "Credenciales incorrectas",
          });
        }
  
        // Validar que sea admin
        if (user.nombre_rol !== "admin") {
          return res.status(403).json({
            success: false,
            message: "No tenés permiso para acceder al panel de admin",
          });
        }
  
        // Login OK y es admin
        res.json({
          success: true,
          message: "Login exitoso",
          user: {
            id_usuario: user.id_usuario,
            email: user.email,
            rol: user.nombre_rol,
          },
        });
      } catch (e) {
        console.error("Error al comparar contraseña:", e);
        res
          .status(500)
          .json({ success: false, message: "Error de servidor al hacer login" });
      }
    });
  });
  