const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/database');

const generoRoutes = require('./routes/generoRoutes');
const directorRoutes = require('./routes/directorRoutes');
const productoraRoutes = require('./routes/productoraRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/generos', generoRoutes);
app.use('/api/directores', directorRoutes);
app.use('/api/productoras', productoraRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/media', mediaRoutes);

// Ruta inicial
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Películas funcionando correctamente'
    });
});

// Verificar conexión con MySQL
app.get('/api/test-db', async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT DATABASE() AS base_datos');

        res.json({
            mensaje: 'Conexión exitosa con MySQL',
            base_datos: resultado[0].base_datos
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al conectar con MySQL',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});