//const request = require("supertest");
//const server = require("../index");

//describe("Operaciones CRUD de cafes", () => {

//});

const sumar = (a,b) => a + b

describe("prueba de la funcion sumar", ()=>{
    it("deberia sumar 2 y 3 y devolver 5", ()=>{
        const n1 = 2
        const n2 = 3
        const resultado = sumar(n1, n2)
        expect(resultado).toBe(5)
    })
})
