import AvaliacaoRepository from "../repositories/avaliacoes-repository";
import { CreateAvaliacaoDTO, UpdateAvaliacaoDTO } from "../dtos/avaliacao-dto";

class AvalicaoService {
  public async create(body: CreateAvaliacaoDTO) {
    return await AvaliacaoRepository.create(body);
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
}

export default AvalicaoService;
