var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing Usuario', () => {

    beforeAll( async (done) => {

        await mongoose.connection.close();
        await mongoose.disconnect();

        var mongoDB = 'mongodb://localhost/red_bicicletas';
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
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
        try{
            await Usuario.deleteMany({});
            await Bicicleta.deleteMany({});
            await Reserva.deleteMany({});
            done();
        }catch(error){console.error(error)}
    });

    afterAll( async (done) => {
        try{
            await mongoose.connection.close();
            await mongoose.disconnect();
            done();
        }catch(error){console.error(error)}
    });

    describe('Usuario.reservar', () => {
        it('crea una reserva asociada a un usuario y una bicicleta', async (done) => {
            try{
                var varUsuario = new Usuario({nombre: 'Michell'});
                varUsuario.save();
                var varBicicleta = new Bicicleta({codigo: '10', color:'morada', modelo:'urbana'});
                varBicicleta.save();

                var hoy = new Date();
                var mañana = new Date();
                mañana.setDate(hoy.getDate() + 1);
                await varUsuario.reservar(varBicicleta._id, hoy, mañana);
                
                Reserva.find({},{_id:0,__v:0}).populate('bicicleta', {_id:0, __v:0}).populate('usuario', {_id:0, __v:0}).exec( function(err, reservas){
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.codigo).toBe(10);
                    expect(reservas[0].usuario.nombre).toBe(varUsuario.nombre);
                    done();
                });
            } catch(error) {console.error(error)}
        });
    });
});