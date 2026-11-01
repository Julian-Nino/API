const express = require('express');
const router = express.Router();

const generoController = require('../controllers/generoController');

// Rutas del módulo Género
router.get('/', generoController.obtenerGeneros);
router.get('/:id', generoController.obtenerGeneroPorId);
router.post('/', generoController.crearGenero);
router.put('/:id', generoController.actualizarGenero);
router.delete('/:id', generoController.eliminarGenero);

module.exports = router;
