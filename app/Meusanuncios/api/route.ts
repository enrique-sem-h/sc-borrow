import { NextResponse } from "next/server";
import { db } from "@/infra/database"; 
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // trocar dps
    const usuarioLogadoId = "user-teste-123"; 

    const dadosDoBanco = await db
      .select({
        id: anuncios.id,
        titulo: anuncios.titulo,
        descricao: anuncios.descricao,
        categoria: anuncios.categoria,
        valor_diario: anuncios.valorDiario, 
        caucao: anuncios.caucao,
        usuario_id: anuncios.usuarioId,    
        foto_principal: sql<string | null>`(
          SELECT url 
          FROM foto_anuncio 
          WHERE foto_anuncio.anuncio_id = ${anuncios.id} 
          AND foto_anuncio.principal = true 
          LIMIT 1
        )`,
      })
      .from(anuncios)
      .where(eq(anuncios.usuarioId, usuarioLogadoId));

    return NextResponse.json(dadosDoBanco);

  } catch (error) {
    console.error("Erro ao buscar anúncios no banco:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idAnuncio = searchParams.get("id");

    if (!idAnuncio) {
      return NextResponse.json({ error: "ID do anúncio é obrigatório" }, { status: 400 });
    }

    await db.delete(anuncios).where(eq(anuncios.id, idAnuncio));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar anúncio:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}