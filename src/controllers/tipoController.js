const pool = require('../config/database');

// Obtener todos los tipos
exports.obtenerTipos = async (req, res) => {
    try {
        const [tipos] = await pool.query(
            'SELECT * FROM tipo ORDER BY id_tipo DESC'
        );

        res.json(tipos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los tipos',
            error: error.message
        });
    }
};

// Obtener un tipo por ID
exports.obtenerTipoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [tipos] = await pool.query(
            'SELECT * FROM tipo WHERE id_tipo = ?',
            [id]
        );

        if (tipos.length === 0) {
            return res.status(404).json({
                mensaje: 'Tipo no encontrado'
            });
        }

        res.json(tipos[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el tipo',
            error: error.message
        });
    }
};

// Crear un tipo
exports.crearTipo = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'El nombre es obligatorio'
            });
        }

        const [resultado] = await pool.query(
            `INSERT INTO tipo (nombre, descripcion)
             VALUES (?, ?)`,
            [nombre.trim(), descripcion || null]
        );

        res.status(201).json({
            mensaje: 'Tipo creado correctamente',
            id: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el tipo',
            error: error.message
        });
    }
};

// Actualizar un tipo
exports.actualizarTipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'El nombre es obligatorio'
            });
        }

        const [tipos] = await pool.query(
            'SELECT id_tipo FROM tipo WHERE id_tipo = ?',
            [id]
        );

        if (tipos.length === 0) {
            return res.status(404).json({
                mensaje: 'Tipo no encontrado'
            });
        }

        await pool.query(
            `UPDATE tipo
             SET nombre = ?, descripcion = ?
             WHERE id_tipo = ?`,
            [nombre.trim(), descripcion || null, id]
        );

        res.json({
            mensaje: 'Tipo actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el tipo',
            error: error.message
        });
    }
};

// Eliminar un tipo
exports.eliminarTipo = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            'DELETE FROM tipo WHERE id_tipo = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Tipo no encontrado'
            });
        }

        res.json({
            mensaje: 'Tipo eliminado correctamente'
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar este tipo porque está asociado a un contenido multimedia'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar el tipo',
            error: error.message
        });
    }
};