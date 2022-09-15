import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe("Testa POST /items ", () => {
  const body = {
    title: "Iphone",
    url: "https://www.apple.com/br/shop/buy-iphone/iphone-14-pro",
    description: "top 10 iphones de cria",
    amount: 14000,
  };

  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const result = await supertest(app).post("/items").send(body);
    const status = result.status;

    expect(status).toEqual(201);
  });

  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const result = await supertest(app).post("/items").send(body);
    const status = result.status;

    expect(status).toEqual(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const result = await supertest(app).get("/items").send();

    expect(result.body).toBeInstanceOf(Array);
    expect(result.status).toEqual(200);
  });
});

describe("Testa GET /items/:id ", () => {
  const body = {
    id: 1,
    title: "Iphone",
    url: "https://www.apple.com/br/shop/buy-iphone/iphone-14-pro",
    description: "top 10 iphones de cria",
    amount: 14000,
  };

  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const result = await supertest(app).get("/items/1");

    expect(result.body).toEqual(expect.objectContaining(body));
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const result = await supertest(app).get("/items/9999999");
    expect(result.status).toEqual(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
