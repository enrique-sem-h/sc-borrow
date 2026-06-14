import { NextResponse } from "next/server";
import { db } from "@/infra/database";
import { anuncios, fotoAnuncios } from "@/infra/database/schemas/anunciosSchema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [anuncio] = await db
      .select({
        id: anuncios.id,
        titulo: anuncios.titulo,
        descricao: anuncios.descricao,
        categoria: anuncios.categoria,
        valorDiario: anuncios.valorDiario,
        caucao: anuncios.caucao,
        usuarioId: anuncios.usuarioId,
        foto_principal: fotoAnuncios.url,
      })
      .from(anuncios)
      .leftJoin(
        fotoAnuncios,
        and(
          eq(fotoAnuncios.anuncioId, anuncios.id),
          eq(fotoAnuncios.principal, true)
        )
      )
      .where(eq(anuncios.id, id))
      .limit(1);

    if (!anuncio) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
    }

    return NextResponse.json(anuncio);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
