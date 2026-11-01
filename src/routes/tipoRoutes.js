const express = require('express');
const router = express.Router();

const tipoController = require('../controllers/tipoController');

router.get('/', tipoController.obtenerTipos);
router.get('/:id', tipoController.obtenerTipoPorId);
router.post('/', tipoController.crearTipo);
router.put('/:id', tipoController.actualizarTipo);
router.delete('/:id', tipoController.eliminarTipo);

module.exports = router;