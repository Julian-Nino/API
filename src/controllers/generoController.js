
const pool = require('../config/database');

// GET: Obtener todos los géneros
const obtenerGeneros = async (req, res) => {
    try {
        const [generos] = await pool.query(
            'SELECT * FROM genero ORDER BY id_genero DESC'
        );

        res.json(generos);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los géneros',
            error: error.message
        });
    }
};

// GET: Obtener un género por ID
const obtenerGeneroPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [generos] = await pool.query(
            'SELECT * FROM genero WHERE id_genero = ?',
            [id]
        );

        if (generos.length === 0) {
            return res.status(404).json({
                mensaje: 'Género no encontrado'
            });
        }

        res.json(generos[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar el género',
            error: error.message
        });
    }
};

// POST: Registrar un género
const crearGenero = async (req, res) => {
    try {
        const { nombre, estado, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'El nombre del género es obligatorio'
            });
        }

        if (estado && !['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const [resultado] = await pool.query(
            `INSERT INTO genero (nombre, estado, descripcion)
             VALUES (?, ?, ?)`,
            [nombre.trim(), estado || 'Activo', descripcion || null]
        );

        res.status(201).json({
            mensaje: 'Género creado correctamente',
            id_genero: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el género',
            error: error.message
        });
    }
};

// PUT: Actualizar un género
const actualizarGenero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'El nombre del género es obligatorio'
            });
        }

        if (estado && !['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        //implementado ia
        const [existente] = await pool.query(
            'SELECT id_genero FROM genero WHERE id_genero = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                mensaje: 'Género no encontrado'
            });
        }
        //end implementado ia
        const [resultado] = await pool.query(
            `UPDATE genero
             SET nombre = ?, estado = ?, descripcion = ?
             WHERE id_genero = ?`,
            [nombre.trim(), estado || 'Activo', descripcion || null, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Género no encontrado'
            });
        }

        res.json({
            mensaje: 'Género actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el género',
            error: error.message
        });
    }
};

// DELETE: Eliminar un género
const eliminarGenero = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            'DELETE FROM genero WHERE id_genero = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Género no encontrado'
            });
        }

        res.json({
            mensaje: 'Género eliminado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar: el género está asociado a una película o serie'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar el género',
            error: error.message
        });
    }
};

module.exports = {
    obtenerGeneros,
    obtenerGeneroPorId,
    crearGenero,
    actualizarGenero,
    eliminarGenero
};
