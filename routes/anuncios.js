var express = require('express');
var router = express.Router();
const anunciosController = require('../controllers/anunciosController');
const imageHandler = require('../utils/imageHandler');

// Obtener todos los anuncios
router.get('/', anunciosController.buscarAnuncio);

// Obtener todas las tags
router.get('/tags', anunciosController.obtenerTags);

// Obtener un anuncio por ID
router.get('/:id', anunciosController.obtenerAnuncioPorId);

// Ruta para crear un anuncio con la foto y pasar el nombre de la foto a la base de datos
router.post('/', imageHandler.subirImagen, anunciosController.crearAnuncio);

// Actualizar un anuncio
router.put('/:id', anunciosController.actualizarAnuncio);

// Eliminar un anuncio, antes de borrarlo se borra la foto del servidor
router.delete('/:id', anunciosController.eliminarAnuncio);

module.exports = router;