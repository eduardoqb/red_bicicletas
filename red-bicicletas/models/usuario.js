var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var Reserva = require('../models/reserva');
var bcrypt = require('bcryp');

const saltRound = 10;

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Debe ingresar un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, { message:'El {PATH} ya existe con otro usuario' });

const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

usuarioSchema.pre('save', function(next){
    if( this.isModified('password') ){
        this.password = bcrypt.hashSync( this.password, saltRounds );
    }
    next();
});

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

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