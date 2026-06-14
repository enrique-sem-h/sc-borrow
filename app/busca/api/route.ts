import { NextResponse } from "next/server";
import { db } from "@/infra/database";
import { anuncios, fotoAnuncios } from "@/infra/database/schemas/anunciosSchema";
import { eq, and, like } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q         = searchParams.get("q") ?? "";
    const categoria = searchParams.get("categoria") ?? "";

    const filtros = [];
    if (q)         filtros.push(like(anuncios.titulo, `%${q}%`));
    if (categoria) filtros.push(eq(anuncios.categoria, categoria as any));

    const rows = await db
      .select({
        id:          anuncios.id,
        titulo:      anuncios.titulo,
        categoria:   anuncios.categoria,
        valor_diario: anuncios.valorDiario,
        foto:        fotoAnuncios.url,
      })
      .from(anuncios)
      .leftJoin(
        fotoAnuncios,
        and(
          eq(fotoAnuncios.anuncioId, anuncios.id),
          eq(fotoAnuncios.principal, true)
        )
      )
      .where(filtros.length ? and(...filtros) : undefined);

    const dados = rows.map((r) => ({
      ...r,
      avaliacao: 0,
      disponivel: true,
    }));

    return NextResponse.json(dados);
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
