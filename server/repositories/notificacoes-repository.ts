import { CreateNotificacaoDTO, NotificacaoDTO } from "../types";
import { db } from "@/infra/database/index";
import { notificacoes } from "@/infra/database/schemas/notificacoesSchema";
import { and, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

class NotificacoesRepository {
  static async create(data: CreateNotificacaoDTO): Promise<NotificacaoDTO> {
    const notificationId = data.id ?? randomUUID();

    await db.insert(notificacoes).values({
      ...data,
      id: notificationId,
    });

    const [result] = await db
      .select()
      .from(notificacoes)
      .where(eq(notificacoes.id, notificationId));

    return result;
  }

  static async getAll(userId: string): Promise<NotificacaoDTO[]> {
    return await db
      .select()
      .from(notificacoes)
      .where(eq(notificacoes.usuarioId, userId))
      .orderBy(desc(notificacoes.createdAt));
  }

  static async getUnread(userId: string): Promise<NotificacaoDTO[]> {
    return await db
      .select()
      .from(notificacoes)
      .where(
        and(eq(notificacoes.usuarioId, userId), eq(notificacoes.read, false)),
      );
  }

  static async markAsRead(notificacaoId: string, userId: string) {
    await db
      .update(notificacoes)
      .set({ read: true })
      .where(
        and(eq(notificacoes.id, notificacaoId), eq(notificacoes.usuarioId, userId)),
      );

    const [result] = await db
      .select()
      .from(notificacoes)
      .where(
        and(eq(notificacoes.id, notificacaoId), eq(notificacoes.usuarioId, userId)),
      );

    return result;
  }
}

export default NotificacoesRepository;
