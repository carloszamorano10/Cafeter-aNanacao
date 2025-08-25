const request = require("supertest");
const server = require("../index.js");
const cafes = require("../cafes.json");

describe("Operaciones CRUD de cafes", () => {
  //ruta get
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

  // ruta post
  describe("ruta post", () => {
    describe("agregando un cafe e id", () => {
      const nuevoCafe = {
        id: 999,
        nombre: "testing",
      };

      it("deberia responder con status 201", async () => {
        const response = await request(server).post("/cafes").send(nuevoCafe);
        expect(response.status).toBe(201);
      });

      describe("cuando se entregan datos ya agregados", () => {
        it("deberia devolver el status 400", async () => {
          const cafeRep = [
            { id: 999, nombre: "prueba" },
            { id: 999, nombre: "prueba" },
          ];
          for (const body of cafeRep) {
            const response = await request(server).post("/cafes").send(body);
            expect(response.status).toBe(400);
          }
        });
      });
    });
  });

  //ruta put
  describe("ruta put", () => {
    const nuevoCafe = {
      id: 50,
      nombre: "testing",
    };
    it("debería actualizar un café existente si el id coincide", async () => {
      const originalCafe = cafes[0];

      const cafeActualizado = {
        id: originalCafe.id,
        nombre: "Café actualizado",
      };

      const response = await request(server)
        .put(`/cafes/${originalCafe.id}`)
        .send(cafeActualizado);
      expect(response.statusCode).toBe(200);
      expect(response.body).toContainEqual(cafeActualizado);
    });

    it("debería responder un codigo 400 si se acutaliza un cafe y el id no coincide", async () => {
      const response = await request(server)
        .put("/cafes/invalid-id")
        .send(nuevoCafe);
      expect(response.status).toBe(400);
    });
  });

  //ruta delete
  describe("DELETE /cafes/:id", () => {
    it("debería eliminar un café existente si el token está presente", async () => {
      const cafeAEliminar = cafes[0];

      const response = await request(server)
        .delete(`/cafes/${cafeAEliminar.id}`)
        .set("Authorization", "token-falso");

      expect(response.statusCode).toBe(200);
      expect(response.body).not.toContainEqual(cafeAEliminar);
    });

    it("debería retornar 404 si el café no existe", async () => {
      const response = await request(server)
        .delete("/cafes/9999")
        .set("Authorization", "token-falso");

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        "No se encontró ningún cafe con ese id"
      );
    });

    it("debería retornar 400 si no se envía token", async () => {
      const cafe = cafes[0];

      const response = await request(server).delete(`/cafes/${cafe.id}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        "No recibió ningún token en las cabeceras"
      );
    });
  });
});
