
const pool = require('../config/database');

// GET: Obtener todas las productoras
const obtenerProductoras = async (req, res) => {
    try {
        const [productoras] = await pool.query(
            'SELECT * FROM productora ORDER BY id_productora DESC'
        );

        res.json(productoras);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar las productoras',
            error: error.message
        });
    }
};

// GET: Obtener productora por ID
const obtenerProductoraPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [productoras] = await pool.query(
            'SELECT * FROM productora WHERE id_productora = ?',
            [id]
        );

        if (productoras.length === 0) {
            return res.status(404).json({
                mensaje: 'Productora no encontrada'
            });
        }

        res.json(productoras[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar la productora',
            error: error.message
        });
    }
};

// POST: Crear productora
const crearProductora = async (req, res) => {
    try {
        const { nombre, estado, slogan, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'El nombre de la productora es obligatorio'
            });
        }

        if (estado && !['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const [resultado] = await pool.query(
            `INSERT INTO productora
             (nombre, estado, slogan, descripcion)
             VALUES (?, ?, ?, ?)`,
            [
                nombre.trim(),
                estado || 'Activo',
                slogan || null,
                descripcion || null
            ]
        );

        res.status(201).json({
            mensaje: 'Productora creada correctamente',
            id_productora: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la productora',
            error: error.message
        });
    }
};

// PUT: Actualizar productora
const actualizarProductora = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, slogan, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'El nombre de la productora es obligatorio'
            });
        }

        if (estado && !['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const [existente] = await pool.query(
            'SELECT id_productora FROM productora WHERE id_productora = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                mensaje: 'Productora no encontrada'
            });
        }

        await pool.query(
            `UPDATE productora
             SET nombre = ?, estado = ?, slogan = ?, descripcion = ?
             WHERE id_productora = ?`,
            [
                nombre.trim(),
                estado || 'Activo',
                slogan || null,
                descripcion || null,
                id
            ]
        );

        res.json({
            mensaje: 'Productora actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la productora',
            error: error.message
        });
    }
};

// DELETE: Eliminar productora
const eliminarProductora = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            'DELETE FROM productora WHERE id_productora = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Productora no encontrada'
            });
        }

        res.json({
            mensaje: 'Productora eliminada correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar: la productora está asociada a una película o serie'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar la productora',
            error: error.message
        });
    }
};

module.exports = {
    obtenerProductoras,
    obtenerProductoraPorId,
    crearProductora,
    actualizarProductora,
    eliminarProductora
};
