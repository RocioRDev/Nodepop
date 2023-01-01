var express = require('express');
var router = express.Router();
const anunciosController = require('../controllers/anunciosController');

router.get('/', anunciosController.buscarAnuncio);
router.get('/tags', anunciosController.obtenerTags);
router.get('/:id', anunciosController.obtenerAnuncioPorId);
router.post('/', anunciosController.crearAnuncio);
router.put('/:id', anunciosController.actualizarAnuncio);
router.delete('/:id', anunciosController.eliminarAnuncio);

module.exports = router;