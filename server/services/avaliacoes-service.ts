import AvaliacaoRepository from "../repositories/avaliacoes-repository";
import AluguelRepository from "../repositories/aluguel-repository";
import UserRepository from "../repositories/user-repository";
import { CreateAvaliacaoDTO, UpdateAvaliacaoDTO } from "../dtos/avaliacao-dto";

class AvalicaoService {
  public async create(body: CreateAvaliacaoDTO) {
    const avaliacao = await AvaliacaoRepository.create(body);

    const aluguel = await AluguelRepository.read(body.idAluguel);

    if (!aluguel) {
      return avaliacao;
    }

    if (
      body.idUsuario !== aluguel.idLocatario &&
      body.idUsuario !== aluguel.idLocador
    ) {
      return avaliacao;
    }

    const idUsuarioAvaliado =
      body.idUsuario === aluguel.idLocatario
        ? aluguel.idLocador
        : aluguel.idLocatario;

    const novaReputacao =
      await AvaliacaoRepository.calcularReputacaoRecebida(idUsuarioAvaliado);

    await UserRepository.updateReputacao(idUsuarioAvaliado, novaReputacao);

    return avaliacao;
  }

  public async read(id: string) {
    return await AvaliacaoRepository.read(id);
  }

  public async list() {
    return await AvaliacaoRepository.list();
  }

  public async update(id: string, body: UpdateAvaliacaoDTO) {
    return await AvaliacaoRepository.update(id, body);
  }

  public async delete(id: string) {
    return await AvaliacaoRepository.delete(id);
  }

  public async findByAluguelId(idAluguel: string, idUsuario: string) {
    return await AvaliacaoRepository.findByAluguelId(idAluguel, idUsuario);
  }
}

export default AvalicaoService;