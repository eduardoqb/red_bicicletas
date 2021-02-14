var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = async function (req, res) {
    let bicicletas = await Bicicleta.allBicis();
    res.status(200).json({
        bicicletas: bicicletas
    });
}

exports.bicicleta_create = function (req, res) {
    let bici = Bicicleta.createInstance(req.body.codigo, req.body.color, req.body.modelo, req.body.latitud, req.body.longitud);
    Bicicleta.add(bici);
    res.status(201).json({
        bicicleta: bici
    });
}

exports.bicicleta_delete = async function (req, res) {
    let result = await Bicicleta.removeByCodigo(req.body.codigo);
    res.status(200).send('Eliminado: ' + result);
}

exports.bicicleta_update = async function (req, res) {
    let bici = await Bicicleta.findByCodigoAndUpdate(req.body.codigo, req.body.color, req.body.modelo, req.body.latitud, req.body.longitud);
    res.status(200).json({
        bicicleta: bici
    });
}