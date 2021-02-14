//const { json, response } = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    codigo: Number,
    color: String,
    modelo: String,
    ubicacion:{
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
});
//This method adds _id property too. Which does not have quotes in his value.
bicicletaSchema.statics.createInstance = function(codigo, color, modelo, latitud, longitud){
    return new this({
        codigo: codigo,
        color: color,
        modelo: modelo,
        ubicacion: [latitud, longitud]
    });
}
//Método de instancia que devuelve un string de acuerdo a las propiedades de la instancia.
bicicletaSchema.methods.toString = function (){
    return 'codigo: '+ this.codigo + ' | color: '+ this.color;
}

bicicletaSchema.statics.allBicis = function(){
    return this.find({});
}

bicicletaSchema.statics.add = async function(bici){
    await this.create(bici);
}

bicicletaSchema.statics.findByCodigo = function(codigo){
    return this.findOne({codigo: codigo});
}

bicicletaSchema.statics.findByCodigoAndUpdate = function(codigo, color, modelo, latitud, longitud){
    let bici = this.findOneAndUpdate(
        {codigo: codigo}, { color: color, modelo: modelo, ubicacion: [latitud, longitud] }, {new: true}
    );
    return bici;
}

bicicletaSchema.statics.removeByCodigo = function(codigo){
    return this.findOneAndDelete({codigo: codigo});
}

module.exports = mongoose.model('Bicicleta', bicicletaSchema);

/*var Bicicleta = function(id, color, modelo, ubicacion){
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function (){
    return 'id: '+ this.id + ' | color: '+ this.color;
}

Bicicleta.allBicis = [];
Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici);
}

Bicicleta.findById = function(aBiciId){
    var aBici = Bicicleta.allBicis.find(x=> x.id == aBiciId);
    if (aBici)
        return aBici;
    else
        throw new Error(`No existe una bicicleta con id ${aBiciId}`);
}

Bicicleta.removeById = function(aBiciId){
    this.findById(aBiciId);
    for(var i = 0; i < Bicicleta.allBicis.length; i++ ){
        if(Bicicleta.allBicis[i].id == aBiciId){
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
}

// var a = new Bicicleta(1, 'Rojo', 'Urbana', [3.449363, -76.542159]);
//var b = new Bicicleta(2, 'azul', 'urbana', [3.454793, -76.534552]);

//Bicicleta.add(a);
//Bicicleta.add(b);

module.exports = Bicicleta;*/