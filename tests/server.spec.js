const request = require("supertest");
const server = require("../index.js");

describe("Operaciones CRUD de cafes", () => {
  describe("ruta get /cafes", () => {
    it("Debería devolver status 200", async () => {
      const response = await request(server).get("/cafes");
      expect(response.status).toBe(200);
    });

    it("Debería responder con un array de cafes", async () => {
      const response = await request(server).get("/cafes");
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("ruta post", () => {
    describe("agregando un cafe e id", () => {
      const nuevoCafe = {
        id: "999",
        nombre: "cafe testing",
      };

      it("deberia responder con status 201", async () => {
        const response = await request(server).post("/cafes").send(nuevoCafe);
        expect(response.status).toBe(201);
      });

      it("deberia responder un json con el cafe nuevo", async () => {
        const response = await request(server).post("/cafes").send(nuevoCafe);
        const cafes = response.body;
        const cafeCreado = cafes.find((c) => c.id === nuevoCafe.id);
        expect(cafeCreado).toBeDefined();
        expect(cafeCreado.id).toBe(nuevoCafe.id);
        expect(cafeCreado.nombre).toBe(nuevoCafe.nombre);
      });
    });

    describe("cuando se entregan datos ya agregados", () => {
      it("deberia devolver el status 400", async () => {
        const cafeRep = [
          { id: "algún id", nombre: "algún nombre" },
          { id: "algún id", nombre: "algún nombre" },
        ];
        for (const body of cafeRep) {
          const response = await request(server).post("/cafes").send(body);
          expect(response.status).toBe(400);
        }
      });
    });
  });
});
