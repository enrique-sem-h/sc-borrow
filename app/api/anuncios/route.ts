import { NextResponse } from "next/server";
import { db } from "@/infra/database";
import { anuncios, fotoAnuncios } from "@/infra/database/schemas/anunciosSchema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const dados = await db
      .select({
        id: anuncios.id,
        titulo: anuncios.titulo,
        categoria: anuncios.categoria,
        valorDiario: anuncios.valorDiario,
        caucao: anuncios.caucao,
        foto_principal: fotoAnuncios.url,
      })
      .from(anuncios)
      .leftJoin(
        fotoAnuncios,
        and(
          eq(fotoAnuncios.anuncioId, anuncios.id),
          eq(fotoAnuncios.principal, true)
        )
      );

    return NextResponse.json(dados);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
