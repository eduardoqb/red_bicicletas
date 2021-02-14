const mongoose = require('mongoose');
let axios = require('axios');
let server = require('../../bin/www');
let Bicicleta = require('../../models/bicicleta'); 

var base_url = 'http://localhost:5000/api/bicicletas';

describe('Bicicleta API', () => {   
    beforeAll(async (done)=>{
        // Demonstrate the readyState and on event emitters
        //console.log(mongoose.connection.readyState); //logs 0
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

        console.log("conectando.......");
        let mongoDB = 'mongodb://localhost/red_bicicletas';
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, "MongoDB connection error: "));
        db.once('open', function() {
            console.log("We are connected to test database!");                
        });
        mongoose.set('useFindAndModify', false);
        await mongoose.connect(mongoDB, {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
        });
        done();
    });

    afterEach(async () => {
        await Bicicleta.deleteMany({});
    });

    afterAll(async () => {
        await Bicicleta.deleteMany({});
        await mongoose.connection.close();
        await mongoose.disconnect();
    });
    
    describe('GET BICICLETAS /', () => {
        it('Status 200', async (done) => {   
            console.log("AXIOS: ");
            try{
                let response = await axios({
                    method: 'get',
                    url: base_url,
                    responseType: 'json',
                    headers: {'connection': 'keep-alive', }
                });
                expect(Object.keys(response.data.bicicletas).length).toBe(0);
                expect(response.status).toBe(200);
                done();
            }catch(error) {
                console.error("ERROR: "+error);
                await mongoose.connection.close();
                await mongoose.disconnect();
            };
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', async (done) => {
            try{
                var bici = {'codigo':3, 'color':'Rojo', 'modelo':'Urbana', 'latitud':3.449363, 'longitud':-76.542159};
                var headers = {'content-type':'application/json'};
            
                let response = await axios({
                    method:'post',
                    url: base_url + '/create',
                    headers: headers,
                    data: bici
                });
                let unaBicicleta = await Bicicleta.findOne({codigo: 3});
                expect(response.status).toBe(201);
                expect(unaBicicleta.color).toBe("Rojo");
                done(); 
            }catch(error){
                console.error("ERROR: "+ error);
                await mongoose.connection.close();
                await mongoose.disconnect();
            }
        });
    });

    describe('POST BICICLETAS /delete', () => {
        it('Status 204', async ()=> {
            try{
                var bici = ({'codigo':3, 'color':'Blanco', 'modelo':'Todo Terreno', 'latitud': 3.454793, 'longitud':-76.534552});
                await Bicicleta.add(bici);
                var headers = {'content-type':'application/json'};

                let response = await axios({
                    method: 'post',
                    url: base_url + '/delete',
                    headers: headers,
                    data: {'codigo': 3}
                })
                let unaBicicleta = await Bicicleta.findOne({codigo: 3});
                expect(response.status).toBe(200);
                expect(unaBicicleta).toBeNull();
            }catch(error){
                console.error("ERROR: "+ error);
                await mongoose.connection.close();
                await mongoose.disconnect();
            }
        });
    });

    describe('POST BICICLETAS /update', ()=>{
        it('Status 200',async ()=>{
            try{
                var bici = ({'codigo':4, 'color':'Verde', 'modelo': 'Urbana', 'latitud': 3.454793, "longitud": -76.534552});
                await Bicicleta.add(bici);
                var biciNueva = { 'codigo':4, 'color':'Plata', 'modelo':'Urbana', 'latitud': 3.454790, 'longitud' :-76.534550};
                var headers = {'content-type':'application/json'};

                let response = await axios({
                    method: 'post',
                    url: base_url + '/update',
                    headers: headers,
                    data: biciNueva
                });
                let unaBicicleta = await Bicicleta.findOne({ codigo:4 });
                expect(response.status).toBe(200);
                expect(unaBicicleta.color).toBe("Plata");
            }catch(error){
                console.error("ERROR: "+error);
                await mongoose.connection.close();
                await mongoose.disconnect();
            }
        });
    }); 
});

