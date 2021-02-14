var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Reserva = require('../models/reserva');

var usuarioSchema = new Schema({
    nombre: String
});

usuarioSchema.statics.allUsuarios = function(){
    return this.find({});
}

usuarioSchema.statics.usuario_get = function(nombre){
    return this.findOne({nombre: nombre});
}

usuarioSchema.statics.usuario_delete = function(nombre){
    return this.findOneAndDelete({nombre: nombre});
}

usuarioSchema.methods.reservar = async function(bici_id, desde, hasta){
    let reserva = await new Reserva({usuario: this._id, bicicleta: bici_id, desde: desde, hasta: hasta});
    return reserva.save();
}

usuarioSchema.methods.reservas_get = function(usuarioId){
    return Reserva.find({ usuario: usuarioId }, { _id: 0, __v: 0 , usuario: 0}).populate('bicicleta', 'codigo -_id');
}

usuarioSchema.methods.reserva_delete = function(biciId){
    return Reserva.findOneAndDelete({ bicicleta: biciId});
}

module.exports = mongoose.model('Usuario', usuarioSchema);