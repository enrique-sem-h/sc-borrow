import {
  alugueis,
  AluguelStatus,
  AluguelType,
} from "@/infra/database/schemas/alugueisSchema";
import { AluguelTipo } from "../controllers/aluguel-controller";
import AluguelRepository from "../repositories/aluguel-repository";
import { Aluguel, CreateAluguelDTO, UpdateAluguelDTO } from "../types";
import BaseService from "./base-service";
import UserRepository from "../repositories/user-repository";
import { arquivarConversaPorAluguel } from "../lib/arquivarConversa";

export class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.name = "NotFoundError";
    this.message = message;
  }
}

class AluguelService extends BaseService {
  public async create(body: CreateAluguelDTO): Promise<Aluguel> {
    if (!body.idAnuncio) {
      throw new Error("Anúncio inválido.");
    }

    const conflito = await AluguelRepository.findConflictAnuncio(
      body.idAnuncio,
      body.dataInicio,
      body.dataFim,
    );

    if (conflito) {
      throw new Error("Este anúncio já está alugado nesse período.");
    }
    return await AluguelRepository.create(body);
  }

  public async update(id: string, body: UpdateAluguelDTO) {
    return AluguelRepository.update(id, body);
  }

  public read(id: string) {
    return AluguelRepository.read(id);
  }

  public getAll(userId: string, type: AluguelTipo | undefined) {
    return AluguelRepository.getByUser(userId, type);
  }
  public delete(id: string) {
    const anuncio = AluguelRepository.read(id);

    if (!anuncio) {
      throw new Error("No anuncio with this id");
    }

    return AluguelRepository.delete(id);
  }

  public async confirmAluguel(id: string, caller: string) {
    const aluguel = await AluguelRepository.read(id);

    if (!aluguel) {
      throw new NotFoundError("Aluguel not found");
    }

    this.ensureCallerIsLocador(aluguel, caller);
    this.ensureInStatus(aluguel, "WAITING_FOR_CONFIRM");

    await this.changeStatus(aluguel, "WAITING_FOR_DISPATCH");
  }

  public async dispatch(id: string, caller: string) {
    const aluguel = await AluguelRepository.read(id);

    if (!aluguel) {
      throw new NotFoundError("Aluguel not found");
    }

    this.ensureCallerIsLocador(aluguel, caller);
    this.ensureInStatus(aluguel, "WAITING_FOR_DISPATCH");

    await this.changeStatus(aluguel, "WAITING_FOR_DELIVERY");
  }

  public async confirmReceived(id: string, caller: string) {
    const aluguel = await AluguelRepository.read(id);

    if (!aluguel) {
      throw new NotFoundError("Aluguel not found");
    }

    this.ensureCallerIsLocatario(aluguel, caller);
    this.ensureInStatus(aluguel, "WAITING_FOR_DELIVERY");

    await this.changeStatus(aluguel, "ITEM_IN_HAND");
  }

  public async confirmReturningItem(id: string, caller: string) {
    const aluguel = await AluguelRepository.read(id);

    if (!aluguel) {
      throw new NotFoundError("Aluguel not found");
    }

    this.ensureCallerIsLocatario(aluguel, caller);
    this.ensureInStatus(aluguel, "ITEM_IN_HAND");

    await this.changeStatus(aluguel, "WAITING_FOR_RETURN_CONFIRM");
  }

  public async confirmReturnedItem(id: string, caller: string) {
    const aluguel = await AluguelRepository.read(id);

    if (!aluguel) {
      throw new NotFoundError("Aluguel not found");
    }

    this.ensureCallerIsLocador(aluguel, caller);
    this.ensureInStatus(aluguel, "WAITING_FOR_RETURN_CONFIRM");

    await this.changeStatus(aluguel, "COMPLETED");
  }

  public async cancel(id: string, caller: string) {
    const aluguel = await AluguelRepository.read(id);

    if (!aluguel) {
      throw new NotFoundError("Aluguel not found");
    }

    if (aluguel.status === "CANCELLED") {
      throw new Error("Aluguel is already cancelled");
    }

    const aluguelUsers = [aluguel.idLocatario, aluguel.idLocador];
    if (!aluguelUsers.includes(caller)) {
      throw new Error("You don't have permission to cancel this aluguel");
    }

    const result = await AluguelRepository.update(aluguel.id, {
      status: "CANCELLED",
    });

    try {
      await arquivarConversaPorAluguel(
        aluguel.id,
        "O aluguel foi cancelado. Esta conversa foi encerrada.",
      );
    } catch (err) {
      console.error("Erro ao arquivar conversa do aluguel:", err);
    }

    return result;
  }

  private ensureInStatus(
    aluguel: Aluguel,
    ...status: Aluguel["status"][]
  ): void {
    const result = status.some((curr) => aluguel.status === curr);
    if (!result) {
      throw new Error(
        `Can't perform this actions in a aluguel with status ${aluguel.status}`,
      );
    }
  }

  private async ensureCallerIsLocador(aluguel: Aluguel, caller: string) {
    const user = await UserRepository.read(caller);

    const isLocador = aluguel.idLocador === user?.id;

    if (!isLocador) {
      throw new Error(
        `Only the locador of this aluguel can perform this action`,
      );
    }
  }

  private async ensureCallerIsLocatario(aluguel: Aluguel, caller: string) {
    const user = await UserRepository.read(caller);

    const isLocatario = aluguel.idLocatario === user?.id;

    if (!isLocatario) {
      throw new Error(
        `Only the locatario of this aluguel can perform this action`,
      );
    }
  }

  private async ensureIsInDataRangeOrCancel(aluguel: Aluguel) {
    const now = new Date();
    const isInDataRange = now >= aluguel.dataInicio && now <= aluguel.dataFim;

    if (!isInDataRange) {
      console.log("ISN't in data range");

      await this.changeStatus(aluguel, "CANCELLED");
      throw new Error(`Aluguel is not in data range`);
    }
  }

  private ensureNotInStatus(
    aluguel: Aluguel,
    ...status: Aluguel["status"][]
  ): void {
    const result = !status.some((curr) => aluguel.status === curr);
    if (!result) {
      throw new Error(
        `Can't perform this actions in a aluguel with status ${aluguel.status}`,
      );
    }
  }

  public async changeStatus(aluguel: Aluguel, newState: Aluguel["status"]) {
    const newBody: Partial<Aluguel> = {
      status: newState,
    };

    const newAluguel = await AluguelRepository.update(aluguel.id, newBody);

    return newAluguel;
  }
}

export default AluguelService;
