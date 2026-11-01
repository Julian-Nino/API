const express = require('express');
const router = express.Router();

const mediaController = require('../controllers/mediaController');

router.get('/', mediaController.obtenerMedia);
router.get('/:id', mediaController.obtenerMediaPorId);
router.post('/', mediaController.crearMedia);
router.put('/:id', mediaController.actualizarMedia);
router.delete('/:id', mediaController.eliminarMedia);

module.exports = router;