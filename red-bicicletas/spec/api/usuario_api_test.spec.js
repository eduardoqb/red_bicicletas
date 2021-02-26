var mongoose = require('mongoose');
var Usuario = require('../../models/usuario');
var Bicicleta = require('../../models/bicicleta')
var Reserva = require('../../models/reserva');
var server = require('../../bin/www');
var axios = require('axios');

var base_url = 'http://localhost:5000/api/usuarios';

describe('Usuario API', () => {

    beforeAll( async (done) => {
        await mongoose.connection.close();
        await mongoose.disconnect();

        let mongoDB = 'mongodb://localhost/red_bicicletas';
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'conection error'));
        db.once('open', () => {
            console.log('We are connected to test database!');
        });
        mongoose.set('useFindAndModify', false);
        await mongoose.connect(mongoDB, {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
        });
        done();
    });

    afterEach( async (done) => {
        await Usuario.deleteMany({});
        await Bicicleta.deleteMany({});
        await Reserva.deleteMany({});
        done();
    });

    afterAll( async (done) => {
        mongoose.connection.close();
        mongoose.disconnect();
        done();
    });

    describe( 'GET USUARIOS', () => {
        it('Status 200 y retornar un listado de dos bicicletas', async (done) => {
            try{
                await Usuario.create({ nombre: 'Michell' });
                await Usuario.create({ nombre: 'Sara' });
                let response = await axios({
                    method: 'get',
                    url: base_url,
                    responseType: 'application/json'
                });
                expect(response.status).toBe(200);
                expect(Object.keys(response.data.usuarios).length).toBe(2);
                done();
            }catch(error){console.error(error)}
        });
    });

    describe('CREATE USUARIOS', () => {
        it('Status 201 y creacion del usuario', async (done) => {
            try{
                let response = await axios({
                    method: 'post',
                    url: base_url+'/create',
                    headers: {
                        'content-type': 'application/json'
                    },
                    data: {
                        nombre: 'Sara'
                    }
                });
                expect(response.status).toBe(201);
                let usuario = await Usuario.findOne({nombre: 'Sara'});
                expect(usuario.nombre).toBe("Sara");
                done();
            }catch(error){console.error(error)}
        });
    });

    describe('DELETE USUARIO', () => {
        it('Status 200 y eliminar un usuario', async (done) => {
            try{
                await Usuario.create({ nombre: 'Michell' });
                await Usuario.create({ nombre: 'Sara' });    
                let response = await axios({
                    method: 'post',
                    url: base_url+'/delete',
                    data: {
                        nombre: 'Michell'
                    }
                });
                let usuario = await Usuario.findOne({ nombre: 'Michell'});
                let usuarios = await Usuario.find({});
                expect(response.status).toBe(200);
                expect(usuario).toBeNull();
                expect(Object.keys(usuarios).length).toBe(1);
                done();
            }catch(error){console.error(error)}
        });
    });

    describe('GET RESERVAS', () => {
        it('Status 200 y retornar un listado de dos reservas', async (done) => {
            try{
                let usuario1 = await Usuario.create({ nombre: 'Michell' });
                let usuario2 = await Usuario.create({ nombre: 'Sara' });   
                let bicicleta1 = await Bicicleta.create({ codigo: 3, color: 'Blanco', modelo: 'Todo Terreno', latitud: 3.454793, longitud:-76.534552 });
                let bicicleta2 = await Bicicleta.create({ codigo: 4, color: 'Verde', modelo: 'Urbana', latitud: 3.454793, longitud: -76.534552 });
                await Reserva.create({ desde: '2021-06-01', hasta: '2021-06-15', bicicleta: bicicleta1._id, usuario: usuario1._id});
                await Reserva.create({ desde: '2021-07-01', hasta: '2021-07-10', bicicleta: bicicleta2._id, usuario: usuario2._id});
                let response = await axios({
                    method: 'get',
                    url: base_url+'/reserva_list',
                });
                let usuario_Id = response.data.reservas[1].usuario;
                let reserva = await Reserva.findOne({usuario: usuario_Id}).populate('usuario').populate('bicicleta');
                expect(response.status).toBe(200);
                expect(Object.keys(response.data.reservas).length).toBe(2);
                expect(reserva.usuario.nombre).toBe('Sara');
                expect(reserva.bicicleta.codigo).toBe(4);
                done();
            }catch(error){console.error(error);}
        });
    });

    describe('CREATE RESERVA', () => {
        it('Status 201 y crea una reserva', async (done) => {
            try{
                let usuario = await Usuario.create({ nombre: 'Sara' });   
                let bicicleta = await Bicicleta.create({ codigo: 4, color: 'Verde', modelo: 'Urbana', latitud: 3.454793, longitud: -76.534552 });
                let response = await axios({
                    method: 'post',
                    url: base_url + '/reservar',
                    responseType: 'application/json',
                    data: {
                        desde: '2021-07-01', 
                        hasta: '2021-07-10', 
                        biciId: bicicleta._id, 
                        nombre: usuario.nombre
                    }
                });
                let reserva = await Reserva.findOne({usuario: usuario._id}).populate('usuario').populate('bicicleta');
                expect(response.status).toBe(201);
                expect(reserva.bicicleta.codigo).toBe(4);
                done();
            }catch(error){console.error(error)}
        });
    });

    describe('DELETE RESERVA' , () => {
        it('Status 200 y elimina una reserva', async (done) => {
            try{
                let usuario1 = await Usuario.create({ nombre: 'Michell' });
                let usuario2 = await Usuario.create({ nombre: 'Sara' });   
                let bicicleta1 = await Bicicleta.create({ codigo: 3, color: 'Blanco', modelo: 'Todo Terreno', latitud: 3.454793, longitud:-76.534552 });
                let bicicleta2 = await Bicicleta.create({ codigo: 4, color: 'Verde', modelo: 'Urbana', latitud: 3.454793, longitud: -76.534552 });
                await Reserva.create({ desde: '2021-06-01', hasta: '2021-06-15', bicicleta: bicicleta1._id, usuario: usuario1._id});
                await Reserva.create({ desde: '2021-07-01', hasta: '2021-07-10', bicicleta: bicicleta2._id, usuario: usuario2._id});
                let response = await axios({
                    method: 'post',
                    url: base_url + '/reserva_delete',
                    data: {
                        nombre: usuario1.nombre,
                        biciId: bicicleta1._id
                    }
                });
                let reservas = await Reserva.find({});
                let reserva = await Reserva.findOne({usuario: usuario1._id}).populate('usuario').populate('bicicleta');
                expect(response.status).toBe(200);
                expect(Object.keys(reservas).length).toBe(1);
                expect(reserva).toBeNull();
                done();
            }catch(error){console.error(error)}
        });
    });
});