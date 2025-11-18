const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { connection } = require("./Config/database");
const multer = require("multer");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ----------------------
//   MULTER CONFIG
// ----------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "_" + Math.round(Math.random() * 9999) + ext);
  }
});
const upload = multer({ storage });

// Ruta para subir imágenes
app.post("/api/upload", upload.array("imagenes", 10), (req, res) => {
  const files = req.files.map(f => ({
    nombre: f.filename,
    url: `http://localhost:8000/uploads/${f.filename}`,
  }));
  res.json({ success: true, files });
});

// Hacer pública la carpeta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------
//    ROUTERS
// ----------------------
const ambientesRouter = require('./Routers/AmbientesRouter');
const autorizadasRouter = require('./Routers/AutorizadasRouter');
const categoriasRouter = require('./Routers/CategoriasRouter');
const citasRouter = require('./Routers/CitasRouter');
const clientesRouter = require('./Routers/ClientesRouter');
const condicionesRouter = require('./Routers/CondicionesRouter');
const departamentosRouter = require('./Routers/DepartamentosRouter');
const direccionesRouter = require('./Routers/DireccionesRouter');
const dormitoriosRouter = require('./Routers/DormitoriosRouter');
const estacionamientosRouter = require('./Routers/EstacionamientosRouter');
const imagenesRouter = require('./Routers/ImagenesRouter');
const inmueblesRouter = require('./Routers/InmueblesRouter');
const municipiosRouter = require('./Routers/MunicipiosRouter');
const personasRouter = require('./Routers/PersonasRouter');
const provinciasRouter = require('./Routers/ProvinciasRouter');
const publicacionesRouter = require('./Routers/PublicacionesRouter');
const tipoinmueblesRouter = require('./Routers/TipoinmueblesRouter');
const usuariosRouter = require('./Routers/UsuariosRouter');
const rolesRouter = require('./Routers/RolesRouter');

// Montar routers (SOLO UNA VEZ)
app.use('/api', ambientesRouter);
app.use('/api', autorizadasRouter);
app.use('/api', categoriasRouter);
app.use('/api', citasRouter);
app.use('/api', clientesRouter);
app.use('/api', condicionesRouter);
app.use('/api', departamentosRouter);
app.use('/api', direccionesRouter);
app.use('/api', dormitoriosRouter);
app.use('/api', estacionamientosRouter);
app.use('/api', imagenesRouter);
app.use('/api', inmueblesRouter);
app.use('/api', municipiosRouter);
app.use('/api', personasRouter);
app.use('/api', provinciasRouter);
app.use('/api', publicacionesRouter);
app.use('/api', tipoinmueblesRouter);
app.use('/api', usuariosRouter);
app.use('/api', rolesRouter);

// ----------------------
//    LOGIN
// ----------------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT u.*, r.nombre_rol
    FROM Usuarios u
    LEFT JOIN Roles r ON u.id_rol = r.id_rol
    WHERE u.email = ?
  `;

  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error interno" });

    if (results.length === 0) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }

    const user = results[0];
    const passwordOk = await bcrypt.compare(password, user.contrasena);

    if (!passwordOk) {
      return res.json({ success: false, message: "Contraseña incorrecta" });
    }

    if (user.nombre_rol !== "admin") {
      return res.status(403).json({ success: false, message: "No tienes permisos" });
    }

    res.json({
      success: true,
      user: {
        id_usuario: user.id_usuario,
        email: user.email,
        rol: user.nombre_rol
      }
    });
  });
});

// Ruta base
app.get("/", (req, res) => {
  res.send("API funcionando ✔");
});

// Inicializar servidor
app.listen(8000, () => {
  console.log("🚀 API corriendo en http://localhost:8000");
});
