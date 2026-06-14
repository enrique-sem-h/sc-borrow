import { testApiHandler } from "next-test-api-route-handler";
import * as anuncioIdHandler from "../../../../pages/api/anuncio/[id]";
import * as anuncioHandler from "../../../../pages/api/anuncio";
import { afterEach, beforeEach, describe, expect, it, test } from "vitest";
import {
  Usuario,
  UsuarioInsert,
  usuarios,
} from "@/infra/database/schemas/usuariosSchema";
import jwt from "jsonwebtoken";
import { IncomingMessage } from "http";
import { db } from "@/infra/database";
import { eq } from "drizzle-orm";
import {
  Anuncio,
  AnuncioInsert,
  anuncios,
  fotoAnuncios,
} from "@/infra/database/schemas/anunciosSchema";

const userMock: UsuarioInsert = {
  cpf: "12345678901",
  nome: "João Silva",
  email: "joao.silva@example.com",
  senha: "afasd",
  cep: "70680-000",
  logradouro: "Rua das Flores",
  bairro: "Cruzeiro Novo",
  numero: 123,
  uf: "DF",
  complemento: "Apto 302",
  rep: 4.75,
  saldo: 1500.5,
  telefone: "61994311593",
};

const anuncioMock: AnuncioInsert = {
  titulo: "Câmera Canon EOS Rebel T7",
  descricao: "Câmera DSLR seminova com lente 18-55mm inclusa",
  categoria: "Eletrônicos",
  valorDiario: 85.9,
  caucao: 1200.0,
  usuarioId: "",
};

async function createUser(user: Partial<UsuarioInsert> = {}): Promise<Usuario> {
  const userData = {
    ...userMock,
    ...user,
  };

  const [data] = await db.insert(usuarios).values(userData).$returningId();
  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, data.id));

  return usuario;
}

async function createAnuncio(anuncio: Partial<Anuncio> = {}): Promise<Anuncio> {
  const anuncioData = {
    ...anuncioMock,
    ...anuncio,
  };

  const [data] = await db.insert(anuncios).values(anuncioData).$returningId();
  const [insertedAnuncio] = await db
    .select()
    .from(anuncios)
    .where(eq(anuncios.id, data.id));

  return insertedAnuncio;
}

function authenticateRequest(user: Usuario, request: IncomingMessage): void {
  const token = jwt.sign(user, process.env.SECRET!);

  const str = `Bearer ${token}`;

  request.headers.authorization = str;
}

describe("Anuncio endpoints", async () => {
  afterEach(async () => {
    await db.delete(anuncios);
    await db.delete(usuarios);
    await db.delete(fotoAnuncios);
  });

  beforeEach(async () => {
    await db.delete(anuncios);
    await db.delete(usuarios);
    await db.delete(fotoAnuncios);
  });
  describe("Test /anuncio authentication", () => {
    test("if GET /anuncio returns 404 without authorization", async () => {
      await testApiHandler({
        pagesHandler: anuncioHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          const res = await fetch({ method: "GET" });
          const status = res.status;
          expect(status).toBe(401);
        },
      });
    });
    test("if GET /anuncio/[id] returns 404 without authorization", async () => {
      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          const res = await fetch({ method: "GET" });
          const status = res.status;
          expect(status).toBe(401);
        },
      });
    });
    test("if PUT /anuncio/[id] returns 404 without authorization", async () => {
      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          const res = await fetch({ method: "PUT" });
          const status = res.status;
          expect(status).toBe(401);
        },
      });
    });
    test("if DELETE /anuncio/[id] returns 404 without authorization", async () => {
      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          const res = await fetch({ method: "DELETE" });
          const status = res.status;
          expect(status).toBe(401);
        },
      });
    });
    test("if POST /anuncio returns 404 without authorization", async () => {
      await testApiHandler({
        pagesHandler: anuncioHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          const res = await fetch({ method: "POST" });
          const status = res.status;
          expect(status).toBe(401);
        },
      });
    });
  });

  describe("Test /anuncio behavior", () => {
    test("if GET /anuncio returns all auth user anuncios", async () => {
      const user = await createUser();

      const anuncios = [];
      const anunciosCountToGenerate = 10;

      for (let index = 0; index < anunciosCountToGenerate; index++) {
        const anuncio = await createAnuncio({
          titulo: `Anuncio ${index + 1}`,
          usuarioId: user.id,
        });
        anuncios.push(anuncio);
      }

      await testApiHandler({
        pagesHandler: anuncioHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user, request);
        },

        async test({ fetch }) {
          const res = await fetch({ method: "GET" });
          const data = await res.json();
          const status = res.status;
          expect(status).toBe(200);
          console.log(data);

          expect(data.data.anuncios.length).toBe(anuncios.length);
          const anunciosData = data.data.anuncios;

          for (const anuncio of anunciosData) {
            expect(anuncio.id).toBeDefined();
            expect(anuncio.titulo).toBeDefined();
            expect(anuncio.descricao).toBeDefined();
            expect(anuncio.categoria).toBeDefined();
            expect(anuncio.valorDiario).toBeDefined();
            expect(anuncio.caucao).toBeDefined();
            expect(anuncio.usuarioId).toBeDefined();
          }
        },
      });
    });
    test("if GET /anuncio/[id] returns 404 if anuncio does not exist", async () => {
      const user = await createUser();

      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        params: {
          id: "NON_EXISTING_ID",
        },
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user, request);
        },

        async test({ fetch }) {
          const res = await fetch({ method: "GET" });
          const status = res.status;
          expect(status).toBe(404);
        },
      });
    });

    test("if GET /anuncio/[id] returns 403 if anuncio user is not auth user", async () => {
      const user = await createUser();
      const user2 = await createUser();
      const anuncio = await createAnuncio({
        usuarioId: user.id,
      });

      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        params: {
          id: anuncio.id,
        },
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user2, request);
        },

        async test({ fetch }) {
          const res = await fetch({ method: "GET" });
          const status = res.status;
          expect(status).toBe(403);
        },
      });
    });
    test("if GET /anuncio/[id] returns anuncio of id [id]", async () => {
      const user = await createUser();
      const anuncio = await createAnuncio({ usuarioId: user.id });

      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        params: {
          id: anuncio.id,
        },
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user, request);
        },

        async test({ fetch }) {
          const res = await fetch({ method: "GET" });
          const status = res.status;
          const json = await res.json();
          expect(status).toBe(200);
          expect(json).toStrictEqual({
            data: {
              ...anuncio,
            },
          });
        },
      });
    });

    test("if POST /anuncio actually inserts a post in database and returns correctly", async () => {
      const user = await createUser();

      const pngBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==";
      const buffer = Uint8Array.from(atob(pngBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([buffer], { type: "image/png" });
      const formData = new FormData();

      Object.entries(anuncioMock).forEach(([key, value]) =>
        formData.append(key, String(value)),
      );

      formData.append("fotos", blob, "foto1.png");
      formData.append("fotos", blob, "foto2.png");
      formData.append("fotos", blob, "foto3.png");

      await testApiHandler({
        pagesHandler: anuncioHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user, request);
        },

        async test({ fetch }) {
          const res = await fetch({
            method: "POST",
            body: formData,
          });
          const status = res.status;
          const json = await res.json();
          const id = json.data?.id;

          expect(status).toBe(201);
          expect(id).toBeDefined();

          const [insertedAnuncio] = await db
            .select()
            .from(anuncios)
            .where(eq(anuncios.id, id));

          expect(insertedAnuncio.usuarioId).toBe(user.id);

          expect(json).toStrictEqual({
            data: { ...insertedAnuncio },
          });
        },
      });
    });

    test("if PUT /anuncio/[id] actually updates a post in database and returns correctly", async () => {
      const user = await createUser();
      const anuncio = await createAnuncio({
        categoria: "Beleza e Cuidados",
        valorDiario: 321,
        caucao: 5,
        usuarioId: user.id,
      });

      const newAnuncio: Partial<Anuncio> = {
        titulo: "NEW TITULO",
        descricao: "NEW descricao",
        categoria: "Eletrônicos",
        valorDiario: 123,
        caucao: 10,
      };

      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user, request);
        },
        params: {
          id: anuncio.id,
        },

        async test({ fetch }) {
          const res = await fetch({
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...newAnuncio,
              // To test if the anuncio user will be authenticated user
              usuarioId: "other_user",
            }),
          });
          const status = res.status;
          const json = await res.json();

          const id = json.data?.id;

          expect(status).toBe(200);
          expect(id).toBeDefined();

          const [updatedAnuncio] = await db
            .select()
            .from(anuncios)
            .where(eq(anuncios.id, anuncio.id));

          expect(updatedAnuncio.usuarioId).toBe(user.id);
          expect(updatedAnuncio).toStrictEqual({
            ...anuncio,
            ...newAnuncio,
          });

          expect(json).toStrictEqual({
            data: { ...updatedAnuncio },
          });
        },
      });
    });

    test("if PUT /anuncio/[id] returns 403 if anuncio user is not auth user", async () => {
      const user = await createUser();
      const user2 = await createUser();
      const anuncio = await createAnuncio({
        usuarioId: user.id,
      });
      const newAnuncio = {
        titulo: "NEW TITULO",
        descricao: "NEW descricao",
        categoria: "Eletrônicos",
        valorDiario: 123,
        caucao: 10,
      };

      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        params: {
          id: anuncio.id,
        },
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user2, request);
        },

        async test({ fetch }) {
          const res = await fetch({
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...newAnuncio,
            }),
          });
          const status = res.status;
          expect(status).toBe(403);
        },
      });
    });
    test("if DELETE /anuncio/[id] deletes anuncio of id [id]", async () => {
      const user = await createUser();
      const anuncio = await createAnuncio({ usuarioId: user.id });

      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        params: {
          id: anuncio.id,
        },
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user, request);
        },

        async test({ fetch }) {
          const res = await fetch({ method: "DELETE" });
          const status = res.status;
          expect(status).toBe(200);

          const [deletedAnuncio] = await db
            .select()
            .from(anuncios)
            .where(eq(anuncios.id, anuncio.id));

          expect(deletedAnuncio).not.toBeDefined();
        },
      });
    });

    test("if DELETE /anuncio/[id] returns 403 if anuncio user is not auth user", async () => {
      const user = await createUser();
      const user2 = await createUser();
      const anuncio = await createAnuncio({
        usuarioId: user.id,
      });
      const newAnuncio = {
        titulo: "NEW TITULO",
        descricao: "NEW descricao",
        categoria: "Eletrônicos",
        valorDiario: 123,
        caucao: 10,
      };

      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        params: {
          id: anuncio.id,
        },
        // requestPatcher is optional
        requestPatcher(request) {
          authenticateRequest(user2, request);
        },

        async test({ fetch }) {
          const res = await fetch({
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const status = res.status;
          expect(status).toBe(403);

          const [deletedAnuncio] = await db
            .select()
            .from(anuncios)
            .where(eq(anuncios.id, anuncio.id));

          expect(deletedAnuncio).toBeDefined();
          expect(deletedAnuncio.id).toBe(anuncio.id);
        },
      });
    });
  });
});
