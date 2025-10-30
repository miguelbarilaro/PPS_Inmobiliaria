const express = require ("express")
const mysql = require ("mysql2")
const cors = require ("cors")

const app = express()

//Habilita CORS
app.use(cors())

app.use(express.json())
// Routers
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

// Montar routers bajo /api
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



app.get("/", (req,res) => {
    res.send("API de la inmobiliaria")
})

app.listen(8000, () => {
    console.log("Servidor corriendo en el puerto 8000")
})