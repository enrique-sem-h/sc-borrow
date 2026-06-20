import NotificacoesRepository from "../repositories/notificacoes-repository";
import { CreateNotificacaoDTO, NotificacaoDTO } from "../types";
import BaseService from "./base-service";

class NotificacoesService extends BaseService {
  public async create(data: CreateNotificacaoDTO): Promise<NotificacaoDTO> {
    return NotificacoesRepository.create(data);
  }

  public async getAll(userId: string): Promise<NotificacaoDTO[]> {
    return NotificacoesRepository.getAll(userId);
  }

  public async getUnread(userId: string): Promise<NotificacaoDTO[]> {
    return NotificacoesRepository.getUnread(userId);
  }

  public async markAsRead(notificacaoId: string, userId: string) {
    return NotificacoesRepository.markAsRead(notificacaoId, userId);
  }
}

export default NotificacoesService;
