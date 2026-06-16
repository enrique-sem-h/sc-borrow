import { NextResponse } from "next/server";
import { db } from "@/infra/database";
import { anuncios, fotoAnuncios } from "@/infra/database/schemas/anunciosSchema";
import { eq, and, ne } from "drizzle-orm";
import { alugueis } from "@/infra/database/schemas/alugueisSchema";

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

    const datasBloqueadas = await db
    .select({
      dataInicio: alugueis.dataInicio,
      dataFim: alugueis.dataFim,
    })
    .from(alugueis)
    .where(
      and(
        eq(alugueis.idAnuncio, id),
        ne(alugueis.status, "CANCELLED"),
      ),
    );

    return NextResponse.json({
      ...anuncio,
      datasBloqueadas,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
