const express = require('express');
const router = express.Router();

const productoraController = require('../controllers/productoraController');

// Rutas del módulo Productora
router.get('/', productoraController.obtenerProductoras);
router.get('/:id', productoraController.obtenerProductoraPorId);
router.post('/', productoraController.crearProductora);
router.put('/:id', productoraController.actualizarProductora);
router.delete('/:id', productoraController.eliminarProductora);

module.exports = router;
