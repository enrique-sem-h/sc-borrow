import { NextApiRequest, NextApiResponse } from "next";
import AvaliacaoService from "../services/avaliacoes-service";

class AvaliacaoController {
  private avaliacaoService = new AvaliacaoService();

  public async create(req: NextApiRequest, res: NextApiResponse) {
    const { nota, mensagem, idUsuario, idAluguel } = req.body;

    if (!nota || !mensagem || !idUsuario || !idAluguel) {
      return res.status(400).json({
        error: "Dados incompletos.",
      });
    }

    const avaliacao = await this.avaliacaoService.create({
      nota,
      mensagem,
      idUsuario,
      idAluguel,
    });

    return res.status(201).json({
      message: "Avaliação criada com sucesso!",
      data: avaliacao,
    });
  }

  public async read(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const avaliacao = await this.avaliacaoService.read(String(id));

    if (!avaliacao) {
      return res.status(404).json({
        error: "Avaliação não encontrada.",
      });
    }

    return res.status(200).json({
      data: avaliacao,
    });
  }

  public async findByAluguelId(req: NextApiRequest,res:NextApiResponse) {
    const {idAluguel} = req.query;
    const {idUsuario} = req.query;
    const  avaliacao = await this.avaliacaoService.findByAluguelId(String(idAluguel), String (idUsuario));

    return res.status(200).json({
      data: avaliacao ?? null,
    });
  }

  public async list(req: NextApiRequest, res: NextApiResponse) {
    const avaliacao = await this.avaliacaoService.list();
    return res.status(200).json({
      data: avaliacao,
    });
  }

  public async update(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const avaliacao = await this.avaliacaoService.update(String(id), req.body);
    return res.status(200).json({
      message: "Avalição atualizada com sucesso!",
      data: avaliacao,
    });
  }

  public async delete(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    await this.avaliacaoService.delete(String(id));
    return res.status(200).json({
      message: "Avaliação deletada com sucesso!",
    });
  }
}

export default AvaliacaoController;
