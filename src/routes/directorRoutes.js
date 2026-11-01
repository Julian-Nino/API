const express = require('express');
const router = express.Router();

const directorController = require('../controllers/directorController');

// Rutas del módulo Director
router.get('/', directorController.obtenerDirectores);
router.get('/:id', directorController.obtenerDirectorPorId);
router.post('/', directorController.crearDirector);
router.put('/:id', directorController.actualizarDirector);
router.delete('/:id', directorController.eliminarDirector);

module.exports = router;
