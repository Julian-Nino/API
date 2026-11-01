const pool = require('../config/database');

// Validar que las relaciones existan y estén activas
const validarRelaciones = async (
    id_genero,
    id_director,
    id_productora,
    id_tipo
) => {
    const [generos] = await pool.query(
        'SELECT id_genero FROM genero WHERE id_genero = ? AND estado = "Activo"',
        [id_genero]
    );

    const [directores] = await pool.query(
        'SELECT id_director FROM director WHERE id_director = ? AND estado = "Activo"',
        [id_director]
    );

    const [productoras] = await pool.query(
        'SELECT id_productora FROM productora WHERE id_productora = ? AND estado = "Activo"',
        [id_productora]
    );

    const [tipos] = await pool.query(
        'SELECT id_tipo FROM tipo WHERE id_tipo = ?',
        [id_tipo]
    );

    if (generos.length === 0) {
        return 'El género no existe o está inactivo';
    }

    if (directores.length === 0) {
        return 'El director no existe o está inactivo';
    }

    if (productoras.length === 0) {
        return 'La productora no existe o está inactiva';
    }

    if (tipos.length === 0) {
        return 'El tipo no existe';
    }

    return null;
};

// Obtener todas las películas y series
exports.obtenerMedia = async (req, res) => {
    try {
        const [media] = await pool.query(`
            SELECT
                m.*,
                g.nombre AS genero,
                d.nombres AS director,
                p.nombre AS productora,
                t.nombre AS tipo
            FROM media m
            INNER JOIN genero g ON m.id_genero = g.id_genero
            INNER JOIN director d ON m.id_director = d.id_director
            INNER JOIN productora p ON m.id_productora = p.id_productora
            INNER JOIN tipo t ON m.id_tipo = t.id_tipo
            ORDER BY m.id_media DESC
        `);

        res.json(media);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el contenido multimedia',
            error: error.message
        });
    }
};

// Obtener un contenido por ID
exports.obtenerMediaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [media] = await pool.query(`
            SELECT
                m.*,
                g.nombre AS genero,
                d.nombres AS director,
                p.nombre AS productora,
                t.nombre AS tipo
            FROM media m
            INNER JOIN genero g ON m.id_genero = g.id_genero
            INNER JOIN director d ON m.id_director = d.id_director
            INNER JOIN productora p ON m.id_productora = p.id_productora
            INNER JOIN tipo t ON m.id_tipo = t.id_tipo
            WHERE m.id_media = ?
        `, [id]);

        if (media.length === 0) {
            return res.status(404).json({
                mensaje: 'Contenido multimedia no encontrado'
            });
        }

        res.json(media[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el contenido',
            error: error.message
        });
    }
};

// Crear contenido multimedia
exports.crearMedia = async (req, res) => {
    try {
        const {
            serial,
            titulo,
            sinopsis,
            url,
            portada,
            anio_estreno,
            id_genero,
            id_director,
            id_productora,
            id_tipo
        } = req.body;

        if (
            !serial || !titulo || !url || !portada ||
            !anio_estreno || !id_genero || !id_director ||
            !id_productora || !id_tipo
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos obligatorios deben estar completos'
            });
        }

        if (
            !Number.isInteger(Number(anio_estreno)) ||
            Number(anio_estreno) < 1888 ||
            Number(anio_estreno) > new Date().getFullYear()
        ) {
            return res.status(400).json({
                mensaje: 'El año de estreno no es válido'
            });
        }

        const errorRelacion = await validarRelaciones(
            id_genero,
            id_director,
            id_productora,
            id_tipo
        );

        if (errorRelacion) {
            return res.status(400).json({
                mensaje: errorRelacion
            });
        }

        const [resultado] = await pool.query(`
            INSERT INTO media (
                serial,
                titulo,
                sinopsis,
                url,
                portada,
                anio_estreno,
                id_genero,
                id_director,
                id_productora,
                id_tipo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            serial,
            titulo,
            sinopsis || null,
            url,
            portada,
            anio_estreno,
            id_genero,
            id_director,
            id_productora,
            id_tipo
        ]);

        res.status(201).json({
            mensaje: 'Contenido multimedia creado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El serial o la URL ya están registrados'
            });
        }

        res.status(500).json({
            mensaje: 'Error al crear el contenido multimedia',
            error: error.message
        });
    }
};

// Actualizar contenido multimedia
exports.actualizarMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            serial,
            titulo,
            sinopsis,
            url,
            portada,
            anio_estreno,
            id_genero,
            id_director,
            id_productora,
            id_tipo
        } = req.body;

        const [existente] = await pool.query(
            'SELECT id_media FROM media WHERE id_media = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                mensaje: 'Contenido multimedia no encontrado'
            });
        }

        if (
            !serial || !titulo || !url || !portada ||
            !anio_estreno || !id_genero || !id_director ||
            !id_productora || !id_tipo
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos obligatorios deben estar completos'
            });
        }

        if (
            !Number.isInteger(Number(anio_estreno)) ||
            Number(anio_estreno) < 1888 ||
            Number(anio_estreno) > new Date().getFullYear()
        ) {
            return res.status(400).json({
                mensaje: 'El año de estreno no es válido'
            });
        }

        const errorRelacion = await validarRelaciones(
            id_genero,
            id_director,
            id_productora,
            id_tipo
        );

        if (errorRelacion) {
            return res.status(400).json({
                mensaje: errorRelacion
            });
        }

        await pool.query(`
            UPDATE media SET
                serial = ?,
                titulo = ?,
                sinopsis = ?,
                url = ?,
                portada = ?,
                anio_estreno = ?,
                id_genero = ?,
                id_director = ?,
                id_productora = ?,
                id_tipo = ?
            WHERE id_media = ?
        `, [
            serial,
            titulo,
            sinopsis || null,
            url,
            portada,
            anio_estreno,
            id_genero,
            id_director,
            id_productora,
            id_tipo,
            id
        ]);

        res.json({
            mensaje: 'Contenido multimedia actualizado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El serial o la URL ya están registrados'
            });
        }

        res.status(500).json({
            mensaje: 'Error al actualizar el contenido multimedia',
            error: error.message
        });
    }
};

// Eliminar contenido multimedia
exports.eliminarMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            'DELETE FROM media WHERE id_media = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Contenido multimedia no encontrado'
            });
        }

        res.json({
            mensaje: 'Contenido multimedia eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el contenido multimedia',
            error: error.message
        });
    }
};