import { testApiHandler } from "next-test-api-route-handler";
import * as anuncioIdHandler from "../../../../pages/api/anuncio/[id]";
import * as anuncioHandler from "../../../../pages/api/anuncio";
import { describe, expect, it, test } from "vitest";

describe("Anuncio endpoints", async () => {
  describe("Test /anuncio authentication", () => {
    test("if GET /anuncio/[id] returns 404 without authorization", async () => {
      await testApiHandler({
        pagesHandler: anuncioIdHandler,
        // requestPatcher is optional
        requestPatcher(request) {
          console.log("REquest");

          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          console.log("Maconha");
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
          console.log("REquest");

          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          console.log("Maconha");
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
          console.log("REquest");

          request.headers.authorization = undefined;
        },

        async test({ fetch }) {
          console.log("Maconha");
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
  // describe("/anuncio POST", () => {});
});
