// import { testApiHandler } from "next-test-api-route-handler";
// import * as anuncioIdHandler from "../../../../pages/api/anuncio/[id]";
// import * as anuncioHandler from "../../../../pages/api/anuncio";
// import { afterEach, beforeEach, describe, expect, it, test } from "vitest";
// import {
//   Usuario,
//   UsuarioInsert,
//   usuarios,
// } from "@/infra/database/schemas/usuariosSchema";
// import jwt from "jsonwebtoken";
// import { IncomingMessage } from "http";
// import { db } from "@/infra/database";
// import { eq } from "drizzle-orm";
// import {
//   Aluguel,
//   AluguelInsert,
//   anuncios,
// } from "@/infra/database/schemas/anunciosSchema";
// import { alugueis } from "@/infra/database/schemas/alugueisSchema";

// const locatarioMock: UsuarioInsert = {
//   cpf: "12345678901",
//   nome: "João Silva",
//   email: "joao.silva@example.com",
//   senha: "afasd",
//   telefone: "33541028",
//   cep: "70680-000",
//   logradouro: "Rua das Flores",
//   bairro: "Cruzeiro Novo",
//   numero: 123,
//   uf: "DF",
//   complemento: "Apto 302",
//   rep: 4.75,
//   saldo: 1500.5,
// };

// const locadorMock: UsuarioInsert = {
//   cpf: "12345678910",
//   nome: "Marcos Marinho",
//   email: "marcos.marinho@example.com",
//   senha: "afasd",
//   telefone: "85167876",
//   cep: "70680-000",
//   logradouro: "Rua das Flores",
//   bairro: "Cruzeiro Novo",
//   numero: 123,
//   uf: "DF",
//   complemento: "Apto 213",
//   rep: 4.89,
//   saldo: 0,
// };

// const anuncioMock: AluguelInsert = {
//   titulo: "Câmera Canon EOS Rebel T7",
//   descricao: "Câmera DSLR seminova com lente 18-55mm inclusa",
//   categoria: "Eletrônicos",
//   valorDiario: 85.9,
//   caucao: 1200.0,
//   usuarioId: "",
// };

// async function createUser(user: Partial<UsuarioInsert> = {}): Promise<Usuario> {
//   const userData = {
//     ...locatarioMock,
//     ...user,
//   };

//   const [data] = await db.insert(usuarios).values(userData).$returningId();
//   const [usuario] = await db
//     .select()
//     .from(usuarios)
//     .where(eq(usuarios.id, data.id));

//   return usuario;
// }

// async function createAluguel(anuncio: Partial<Aluguel> = {}): Promise<Aluguel> {
//   const anuncioData = {
//     ...anuncioMock,
//     ...anuncio,
//   };

//   const [data] = await db.insert(anuncios).values(anuncioData).$returningId();
//   const [insertedAluguel] = await db
//     .select()
//     .from(anuncios)
//     .where(eq(anuncios.id, data.id));

//   return insertedAluguel;
// }

// function authenticateRequest(user: Usuario, request: IncomingMessage): void {
//   const token = jwt.sign(user, process.env.SECRET!);

//   const str = `Bearer ${token}`;

//   request.headers.authorization = str;
// }

// describe("Aluguel endpoints", async () => {
//   afterEach(async () => {
//     await db.delete(alugueis);
//     await db.delete(anuncios);
//     await db.delete(usuarios);
//   });

//   beforeEach(async () => {
//     await db.delete(alugueis);
//     await db.delete(anuncios);
//     await db.delete(usuarios);
//   });
//   describe("Test /aluguel authentication", () => {
//     test("if GET /aluguel/[id] returns 404 without authorization", async () => {
//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         // requestPatcher is optional
//         requestPatcher(request) {
//           request.headers.authorization = undefined;
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "GET" });
//           const status = res.status;
//           expect(status).toBe(401);
//         },
//       });
//     });
//     test("if PUT /alugueis/[id] returns 404 without authorization", async () => {
//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         // requestPatcher is optional
//         requestPatcher(request) {
//           request.headers.authorization = undefined;
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "PUT" });
//           const status = res.status;
//           expect(status).toBe(401);
//         },
//       });
//     });
//     test("if DELETE /aluguel/[id] returns 404 without authorization", async () => {
//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         // requestPatcher is optional
//         requestPatcher(request) {
//           request.headers.authorization = undefined;
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "DELETE" });
//           const status = res.status;
//           expect(status).toBe(401);
//         },
//       });
//     });
//     test("if POST /aluguel returns 404 without authorization", async () => {
//       await testApiHandler({
//         pagesHandler: aluguelHandler,
//         // requestPatcher is optional
//         requestPatcher(request) {
//           request.headers.authorization = undefined;
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "POST" });
//           const status = res.status;
//           expect(status).toBe(401);
//         },
//       });
//     });
//   });

//   describe("Test /aluguel behavior", () => {
//     test("if GET /aluguel/[id] returns 404 if aluguel does not exist", async () => {
//       const user = await createUser();

//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         params: {
//           id: "NON_EXISTING_ID",
//         },
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user, request);
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "GET" });
//           const status = res.status;
//           expect(status).toBe(404);
//         },
//       });
//     });

//     test("if GET /aluguel/[id] returns 403 if aluguel user is not auth user", async () => {
//       const user = await createUser();
//       const user2 = await createUser();
//       const aluguel = await createAluguel({
//         usuarioId: user.id,
//       });

//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         params: {
//           id: aluguel.id,
//         },
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user2, request);
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "GET" });
//           const status = res.status;
//           expect(status).toBe(403);
//         },
//       });
//     });
//     test("if GET /aluguel/[id] returns aluguel of id [id]", async () => {
//       const user = await createUser();
//       const aluguel = await createAluguel({ usuarioId: user.id });

//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         params: {
//           id: aluguel.id,
//         },
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user, request);
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "GET" });
//           const status = res.status;
//           const json = await res.json();
//           expect(status).toBe(200);
//           expect(json).toStrictEqual({
//             data: {
//               ...aluguel,
//             },
//           });
//         },
//       });
//     });

//     test("if POST /aluguel actually inserts a post in database and returns correctly", async () => {
//       const user = await createUser();

//       const pngBase64 =
//         "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==";
//       const buffer = Uint8Array.from(atob(pngBase64), (c) => c.charCodeAt(0));
//       const blob = new Blob([buffer], { type: "image/png" });
//       const fotos = [atob(pngBase64)];
//       const formData = new FormData();

//       Object.entries(aluguelMock).forEach(([key, value]) =>
//         formData.append(key, String(value)),
//       );

//       formData.append("fotos", blob, "foto1.png");
//       formData.append("fotos", blob, "foto2.png");
//       formData.append("fotos", blob, "foto3.png");

//       await testApiHandler({
//         pagesHandler: aluguelHandler,
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user, request);
//         },

//         async test({ fetch }) {
//           const res = await fetch({
//             method: "POST",
//             body: formData,
//           });
//           const status = res.status;
//           const json = await res.json();
//           console.log(json);

//           const id = json.data?.id;

//           expect(status).toBe(201);
//           expect(id).toBeDefined();

//           const [insertedAluguel] = await db
//             .select()
//             .from(anuncios)
//             .where(eq(anuncios.id, id));

//           expect(insertedAluguel.usuarioId).toBe(user.id);

//           expect(json).toStrictEqual({
//             data: { ...insertedAluguel },
//           });
//         },
//       });
//     });

//     test("if PUT /aluguel/[id] actually updates a post in database and returns correctly", async () => {
//       const user = await createUser();
//       const aluguel = await createAluguel({
//         categoria: "Beleza e Cuidados",
//         valorDiario: 321,
//         caucao: 5,
//         usuarioId: user.id,
//       });

//       const newAluguel: Partial<Aluguel> = {
//         titulo: "NEW TITULO",
//         descricao: "NEW descricao",
//         categoria: "Eletrônicos",
//         valorDiario: 123,
//         caucao: 10,
//       };

//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user, request);
//         },
//         params: {
//           id: aluguel.id,
//         },

//         async test({ fetch }) {
//           const res = await fetch({
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               ...newAluguel,
//               // To test if the aluguel user will be authenticated user
//               usuarioId: "other_user",
//             }),
//           });
//           const status = res.status;
//           const json = await res.json();

//           const id = json.data?.id;

//           expect(status).toBe(200);
//           expect(id).toBeDefined();

//           const [updatedAluguel] = await db
//             .select()
//             .from(anuncios)
//             .where(eq(anuncios.id, aluguel.id));

//           expect(updatedAluguel.usuarioId).toBe(user.id);
//           expect(updatedAluguel).toStrictEqual({
//             ...aluguel,
//             ...newAluguel,
//           });

//           expect(json).toStrictEqual({
//             data: { ...updatedAluguel },
//           });
//         },
//       });
//     });

//     test("if PUT /aluguel/[id] returns 403 if aluguel user is not auth user", async () => {
//       const user = await createUser();
//       const user2 = await createUser();
//       const aluguel = await createAluguel({
//         usuarioId: user.id,
//       });
//       const newAluguel = {
//         titulo: "NEW TITULO",
//         descricao: "NEW descricao",
//         categoria: "Eletrônicos",
//         valorDiario: 123,
//         caucao: 10,
//       };

//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         params: {
//           id: aluguel.id,
//         },
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user2, request);
//         },

//         async test({ fetch }) {
//           const res = await fetch({
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               ...newAluguel,
//             }),
//           });
//           const status = res.status;
//           expect(status).toBe(403);
//         },
//       });
//     });
//     test("if DELETE /aluguel/[id] deletes aluguel of id [id]", async () => {
//       const user = await createUser();
//       const aluguel = await createAluguel({ usuarioId: user.id });

//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         params: {
//           id: aluguel.id,
//         },
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user, request);
//         },

//         async test({ fetch }) {
//           const res = await fetch({ method: "DELETE" });
//           const status = res.status;
//           expect(status).toBe(200);

//           const [deletedAluguel] = await db
//             .select()
//             .from(anuncios)
//             .where(eq(anuncios.id, aluguel.id));

//           expect(deletedAluguel).not.toBeDefined();
//         },
//       });
//     });

//     test("if DELETE /aluguel/[id] returns 403 if aluguel user is not auth user", async () => {
//       const user = await createUser();
//       const user2 = await createUser();
//       const aluguel = await createAluguel({
//         usuarioId: user.id,
//       });
//       const newAluguel = {
//         titulo: "NEW TITULO",
//         descricao: "NEW descricao",
//         categoria: "Eletrônicos",
//         valorDiario: 123,
//         caucao: 10,
//       };

//       await testApiHandler({
//         pagesHandler: aluguelIdHandler,
//         params: {
//           id: aluguel.id,
//         },
//         // requestPatcher is optional
//         requestPatcher(request) {
//           authenticateRequest(user2, request);
//         },

//         async test({ fetch }) {
//           const res = await fetch({
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           });
//           const status = res.status;
//           expect(status).toBe(403);

//           const [deletedAluguel] = await db
//             .select()
//             .from(anuncios)
//             .where(eq(anuncios.id, aluguel.id));

//           expect(deletedAluguel).toBeDefined();
//           expect(deletedAluguel.id).toBe(aluguel.id);
//         },
//       });
//     });
//   });
// });
