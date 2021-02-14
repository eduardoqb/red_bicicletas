var Reserva = require('../../models/reserva');
var Usuario = require('../../models/usuario');

exports.usuario_list = async function (req, res) {
    let usuarios = await Usuario.allUsuarios();
    res.status(200).json({
        usuarios: usuarios
    });
}

exports.usuario_create = function (req, res) {
    let usuario = new Usuario({ nombre: req.body.nombre });
    usuario.save();
    res.status(201).json({
        usuario: usuario
    });
}

exports.usuario_delete = async function (req, res) {
    let result = await Usuario.usuario_delete(req.body.nombre);
    res.status(200).send("Resultado: " + result);
}

exports.reserva_list = async function (req, res) {
    let reservas = await Reserva.allReservas();
    res.status(200).json({
        reservas: reservas
    });
}

exports.usuario_reservar = async function (req, res) {
    let usuario = await Usuario.usuario_get(req.body.nombre);
    let reserva = await usuario.reservar(req.body.biciId, req.body.desde, req.body.hasta);
    res.status(200).json({
        reserva: reserva
    });
}

exports.reservas_get = async function (req, res) {
    let usuario = await Usuario.usuario_get(req.body.nombre);
    let reservas = await usuario.reservas_get(usuario._id);
    res.status(200).json({
        reservas: reservas
    });
}

exports.usuario_reserva_delete = async function (req, res) {
    let usuario = await Usuario.usuario_get(req.body.nombre);
    let result = await usuario.reserva_delete(req.body.biciId);
    res.status(200).send("Resultado: " + result);
}