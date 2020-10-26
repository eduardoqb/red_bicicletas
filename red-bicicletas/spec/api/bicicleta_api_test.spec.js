var Bicicleta = require('../../models/bicicleta');
var request = require('request');
const axios = require('axios');
var server = require('../../bin/www');

describe('Bicicleta API', () => {
    describe('GET BICICLETAS /', () => {
        it('Status 200', (done) => {
            
            expect(Bicicleta.allBicis.length).toBe(0);
            
            var biciA = new Bicicleta(1, 'Negro', 'Urbana', [3.449363, -76.542159]);
            var biciB = new Bicicleta(2, 'Blanco', 'Todo Terreno', [3.454793, -76.534552]);
            Bicicleta.add(biciA);
            Bicicleta.add(biciB);       
            
            
            /*request.get('http://localhost:5000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
                done();
            });*/

            axios.get('http://localhost:5000/api/bicicletas').then(function(response){
                expect(response.status).toBe(200);
                done();
            }); 

        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {
        
            var biciA = {'id':10, 'color':'Rojo', 'modelo':'Urbana', 'ubicacion':[3.449363, -76.542159]};
            var headers = {'content-type':'application/json'};
        
            axios({
                method:'post',
                url: 'http://localhost:5000/api/bicicletas/create',
                headers: headers,
                data: biciA
            }).then(function(response){
                expect(response.status).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("Rojo");
                done();
            }); 
        });
    });

    describe('POST BICICLETAS /delete', () => {
        it('Status 204', (done)=> {

            var biciA = new Bicicleta(3, 'Blanco', 'Todo Terreno', [3.454793, -76.534552]);
            Bicicleta.add(biciA);
            var headers = {'content-type':'application/json'};

            axios({
                method: 'post',
                url: 'http://localhost:5000/api/bicicletas/delete',
                headers: headers,
                data: {'id': 3}
            }).then(function(response){
                expect(response.status).toBe(204);
                done();
            });
        });
    });

    describe('POST BICICLETAS /update', ()=>{
        it('Status 200',(done)=>{
            
            var biciA = new Bicicleta(4, "Verde", "Urbana", [3.454793, -76.534552]);
            Bicicleta.add(biciA);
            var biciANueva = { 'id':4, 'color':'Plata', 'modelo':'Urbana', 'ubicacion': [3.454790, -76.534550]};
            var headers = {'content-type':'application/json'};

            axios({
                method: 'post',
                url: 'http://localhost:5000/api/bicicletas/update',
                headers: headers,
                data: biciANueva
            }).then(function(response){
                expect(response.status).toBe(200);
                expect(Bicicleta.findById(4).color).toBe("Plata");
                done();
            });
        });
    });
    
});

