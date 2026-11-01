
const pool = require('../config/database');

// GET: Obtener todos los directores
const obtenerDirectores = async (req, res) => {
    try {
        const [directores] = await pool.query(
            'SELECT * FROM director ORDER BY id_director DESC'
        );

        res.json(directores);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los directores',
            error: error.message
        });
    }
};

// GET: Obtener director por ID
const obtenerDirectorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [directores] = await pool.query(
            'SELECT * FROM director WHERE id_director = ?',
            [id]
        );

        if (directores.length === 0) {
            return res.status(404).json({
                mensaje: 'Director no encontrado'
            });
        }

        res.json(directores[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar el director',
            error: error.message
        });
    }
};

// POST: Crear director
const crearDirector = async (req, res) => {
    try {
        const { nombres, estado } = req.body;

        if (!nombres || !nombres.trim()) {
            return res.status(400).json({
                mensaje: 'Los nombres del director son obligatorios'
            });
        }

        if (estado && !['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const [resultado] = await pool.query(
            `INSERT INTO director (nombres, estado)
             VALUES (?, ?)`,
            [nombres.trim(), estado || 'Activo']
        );

        res.status(201).json({
            mensaje: 'Director creado correctamente',
            id_director: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el director',
            error: error.message
        });
    }
};

// PUT: Actualizar director
const actualizarDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, estado } = req.body;

        if (!nombres || !nombres.trim()) {
            return res.status(400).json({
                mensaje: 'Los nombres del director son obligatorios'
            });
        }

        if (estado && !['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        // Comprobar que el director exista
        const [existente] = await pool.query(
            'SELECT id_director FROM director WHERE id_director = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                mensaje: 'Director no encontrado'
            });
        }

        await pool.query(
            `UPDATE director
             SET nombres = ?, estado = ?
             WHERE id_director = ?`,
            [nombres.trim(), estado || 'Activo', id]
        );

        res.json({
            mensaje: 'Director actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el director',
            error: error.message
        });
    }
};

// DELETE: Eliminar director
const eliminarDirector = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            'DELETE FROM director WHERE id_director = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Director no encontrado'
            });
        }

        res.json({
            mensaje: 'Director eliminado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar: el director está asociado a una película o serie'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar el director',
            error: error.message
        });
    }
};

module.exports = {
    obtenerDirectores,
    obtenerDirectorPorId,
    crearDirector,
    actualizarDirector,
    eliminarDirector
};
