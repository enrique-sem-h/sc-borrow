import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseForm } from "@/server/middlewares/parseForm";

const parseMock = vi.fn();

vi.mock("formidable", () => ({
  default: vi.fn(() => ({
    parse: parseMock,
  })),
}));

describe("parseForm middleware", () => {
  const next = vi.fn();

  let req: any = {};

  let res: any = {};

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it("should parse fields and call next", async () => {
    parseMock.mockResolvedValue([
      {
        age: ["25"],
        name: ["John"],
      },
      {
        avatar: {},
      },
    ]);

    await parseForm(req, res, next);

    expect(req.body).toEqual({
      age: 25,
      name: "John",
    });

    expect(req.files).toEqual({
      avatar: {},
    });

    expect(next).toHaveBeenCalledOnce();
  });

  it("should return 500 when formidable throws", async () => {
    parseMock.mockRejectedValue(new Error("boom"));

    await parseForm(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro interno: formidable parse failed",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should parse numbers correctly", async () => {
    parseMock.mockResolvedValue([
      {
        number: ["15.9"],
        age: ["12"],
        cpf: ["12345678910"],
        telefone: ["61983821542"],
        negative: ["-12"],
        alphanumeric: ["0xFF"],
        code: ["123abc"],
      },
    ]);

    await parseForm(req, res, next);

    expect(req.body).toEqual({
      number: 15.9,
      age: 12,
      cpf: "12345678910",
      telefone: "61983821542",
      negative: -12,
      alphanumeric: "0xFF",
      code: "123abc",
    });

    expect(res.status).toBeNull;
    expect(res.json).toBeNull;
    expect(next).toHaveBeenCalled;
  });

  it("should parse strings correctly", async () => {
    parseMock.mockResolvedValue([
      {
        name: ["John"],
        address: ["12th street tangamandapio"],
        cpf: ["12345678910"],
        telefone: ["61983821542"],
        sentence: ["John likes hiking 5 times a week"],
        alphanumeric: ["0xFF"],
        senha: ["15789012823"],
      },
    ]);

    await parseForm(req, res, next);

    expect(req.body).toEqual({
      name: "John",
      address: "12th street tangamandapio",
      cpf: "12345678910",
      telefone: "61983821542",
      sentence: "John likes hiking 5 times a week",
      alphanumeric: "0xFF",
      senha: "15789012823",
    });

    expect(res.status).toBeNull;
    expect(res.json).toBeNull;
    expect(next).toHaveBeenCalled;
  });

  it("should not validate empty strings", async () => {
    parseMock.mockResolvedValue([
      {
        name: [" "],
        address: ["   "],
        cpf: ["     "],
      },
    ]);

    await parseForm(req, res, next);

    expect(req.body).toEqual({
      name: " ",
      address: "   ",
      cpf: "     ",
    });

    expect(res.status).toBeNull;
    expect(res.json).toBeNull;
    expect(next).toHaveBeenCalled;
  });
});
