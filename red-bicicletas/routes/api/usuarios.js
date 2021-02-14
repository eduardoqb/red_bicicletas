var express = require('express');
var router = express.Router();
var usuarioController = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioController.usuario_list);
router.post('/create', usuarioController.usuario_create);
router.post('/delete', usuarioController.usuario_delete);
router.get('/reserva_list', usuarioController.reserva_list);
router.post('/reservas_get', usuarioController.reservas_get);
router.post('/reservar', usuarioController.usuario_reservar);
router.post('/reserva_delete', usuarioController.usuario_reserva_delete);

module.exports = router;