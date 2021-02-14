var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicleta', function () {

    beforeAll( async (done) => {

        mongoose.connection.on('connecting', () => { 
            console.log('connecting')
            //console.log(mongoose.connection.readyState); //logs 2
            });
            mongoose.connection.on('connected', () => {
            console.log('connected');
            //console.log(mongoose.connection.readyState); //logs 1
            });
            mongoose.connection.on('disconnecting', () => {
            console.log('disconnecting');
            //console.log(mongoose.connection.readyState); // logs 3
            });
            mongoose.connection.on('disconnected', () => {
            console.log('disconnected');
            //console.log(mongoose.connection.readyState); //logs 0
            });

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

    afterEach(async (done) => {
        try{
            await Bicicleta.deleteMany({});
            done();
        }catch(error){console.error(error)}
    });

    afterAll( async (done) => {
        try{
            await Bicicleta.deleteMany({});
            await mongoose.connection.close();
            await mongoose.disconnect();
            done();
        }catch(error){console.error(error)}
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', (done) => {
            let bici = Bicicleta.createInstance(1, "verde", "urbana", -34.5, -54.1);
            expect(bici.codigo).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
            done();
        });
    });

    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', async (done) => {
            let bicicletas = await Bicicleta.allBicis();
            expect(Object.keys(bicicletas).length).toBe(0);
            done();
        });
    });

    describe('Bicicleta.add', () => {
        it('agrega una bicicleta', async (done) => {
            //let bici = await new Bicicleta({ codigo: 2, color: "azul", modelo: "montaña" });
            let bici = Bicicleta.createInstance( 2, "azul", "montaña", -34.54, -19.82  );
            try{
                await Bicicleta.add(bici); 
                let bicicletas = await Bicicleta.allBicis();
                
                expect(Object.keys(bicicletas).length).toEqual(1);
                expect(bicicletas[0].codigo).toEqual(bici.codigo);
                done();
            }catch(error){
                console.error("ERROR: " + error);
            }
        });
    });

    describe('Bicicleta.findByCodigo', () => {
        it('debe devolver la bici con codigo 3', async(done) => {
            try{
                //let bicicletas = await Bicicleta.allBicis();         
                //expect(Object.keys(bicicletas).length).toBe(0);
                let bici1 = await Bicicleta.createInstance( 3, "blanco", "urbana", -20.30, -4.87 );
                await Bicicleta.add(bici1);
                let bici2 = await Bicicleta.createInstance( 4, "negro", "montaña", -65.96, -34.1 );
                await Bicicleta.add(bici2);    
                
                let targetBicicleta = await Bicicleta.findByCodigo(3);
                expect(targetBicicleta.codigo).toBe(3);
                expect(targetBicicleta.color).toBe("blanco");             
                expect(targetBicicleta.modelo).toBe("urbana");
                done();
            }catch(error){
                console.error("ERROR "+error);
            }


            /* Bicicleta.allbicicletas(function(err, bicicletas){
                expect(Object.keys(bicicletas).length).toBe(0);
                var bici1 = new Bicicleta({code: 3, color: "blanco", modelo: "urbana"});
                Bicicleta.add(bici1, function(err){
                    if (err) console.log(err);
                    var bici2 = new Bicicleta({code: 4, color: "negro", modelo: "montaña"});
                    Bicicleta.add(bici2, function(err){
                        if (err) console.log(err);
                        Bicicleta.findByCode(3, function(err,targetBici){
                            if (!targetBici || err){
                                console.log(err);
                                console.log("----Error: bicicleta no encontrada----");
                            }
                            expect(targetBici.code).toBe(3);
                            done();
                        });
                    }); 
                });
            }); */
        });
    });

    describe("Bicicleta.removeByCodigo", () => {
        it("debe eliminar la bicicleta bicicleta con codigo 3", async (done) => {
            try{
                let bicicletas = await Bicicleta.allBicis();
                expect(Object.keys(bicicletas).length).toBe(0);
                let bici1 = ({ codigo: 3, color: "negro", modelo: "urbana" });
                await Bicicleta.add(bici1);
                let bici2 = ({ codigo: 4, color: "blanco", modelo: "montaña" });
                await Bicicleta.add(bici2);
                bicicletas = await Bicicleta.allBicis();
                expect(Object.keys(bicicletas).length).toBe(2);
                let response = await Bicicleta.removeByCodigo(3);
                bicicletas = await Bicicleta.allBicis();    
                expect(response.codigo).toBe(3);
                done();
            }catch(error){
                console.error(error);
            }
        });
    });
});

/*
beforeEach( () => { Bicicleta.allbicicletas = []; });
describe("Bicicleta.allbicicletas", () => {
    it("comienza vacia", () => {
        expect(Bicicleta.allbicicletas.length).toBe(0);
    });
});

describe("Bicicleta.add", () => {
    it("agregamos una", () => {
        expect(Bicicleta.allbicicletas.length).toBe(0);
        var a = new Bicicleta(1, 'Rojo', 'Urbana', [3.449363, -76.542159]);
        Bicicleta.add(a);
        expect(Bicicleta.allbicicletas.length).toBe(1);
        expect(Bicicleta.allbicicletas[0]).toBe(a);
    });
});

describe("Bicicleta.findById", () => {
    it("debe devolver la bici con id 1", () => {
        expect(Bicicleta.allbicicletas.length).toBe(0);
        var abici1 = new Bicicleta(1, 'Rojo', 'Urbana', [3.449363, -76.542159]);
        var abici2 = new Bicicleta(2, 'azul', 'urbana', [3.454793, -76.534552]);
        Bicicleta.add(abici1);
        Bicicleta.add(abici2);
        var tarjetBici = Bicicleta.findById(1);
        expect(tarjetBici.id).toBe(1);
        expect(tarjetBici.color).toBe("Rojo");
        expect(tarjetBici.modelo).toBe("Urbana");
        expect(tarjetBici.ubicacion).toEqual( [3.449363, -76.542159]);
    });
});

describe("Bicicleta.removeById", ()=> {
    it("debe eliminar la bici con id 1", () => {
        var abici1 = new Bicicleta(1, 'Rojo', 'Urbana', [3.449363, -76.542159]);
        var abici2 = new Bicicleta(2, 'azul', 'urbana', [3.454793, -76.534552]);
        Bicicleta.add(abici1);
        Bicicleta.add(abici2);
        var vacio = Bicicleta.removeById(1);
        expect(vacio).toBeUndefined();
    });
});

*/