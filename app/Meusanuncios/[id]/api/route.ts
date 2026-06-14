import { NextResponse } from "next/server";
import { db } from "@/infra/database";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const anuncio = await db
      .select({
        id: anuncios.id,
        titulo: anuncios.titulo,
        descricao: anuncios.descricao,
        categoria: anuncios.categoria,
        valorDiario: anuncios.valorDiario,
        caucao: anuncios.caucao,
      })
      .from(anuncios)
      .where(eq(anuncios.id, id))
      .limit(1);

    if (anuncio.length === 0) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
    }

    return NextResponse.json(anuncio[0]);
  } catch (error) {
    console.error("Erro ao buscar anúncio:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titulo, descricao, category, valor_diario, caucao } = body;

    await db
      .update(anuncios)
      .set({
        titulo,
        descricao,
        categoria: category,
        valorDiario: parseFloat(valor_diario),
        caucao: parseFloat(caucao),
      })
      .where(eq(anuncios.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar anúncio:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}