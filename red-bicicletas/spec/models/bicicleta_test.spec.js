var Bicicleta = require("../../models/bicicleta");

beforeEach( () => { Bicicleta.allBicis = []; });
describe("Bicicleta.allBicis", () => {
    it("comienza vacia", () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });  
});

describe("Bicicleta.add", () => {
    it("agregamos una", () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'Rojo', 'Urbana', [3.449363, -76.542159]);
        Bicicleta.add(a);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe("Bicicleta.findById", () => {
    it("debe devolver la bici con id 1", () => {
        expect(Bicicleta.allBicis.length).toBe(0);
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