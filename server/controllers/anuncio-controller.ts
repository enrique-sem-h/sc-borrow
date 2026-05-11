import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base-controller";
import AnuncioService from "../services/anuncio-service";
import { CreateAnuncioDTO } from "../types";

class AnuncioController extends BaseController {
  private anuncioService = new AnuncioService()

  public create(req: NextApiRequest, res: NextApiResponse) {
    // Fazer a validação dos dados
    // ...
    // ...


    const anuncioDto = {

    } as CreateAnuncioDTO
    const anuncio = this.anuncioService.create(anuncioDto)

    res.send({
      data: {
        ...anuncio
      }
    })

  }

  public update(req: NextApiRequest, res: NextApiResponse) {


  }
  
  public read(req: NextApiRequest, res: NextApiResponse) {


  }

  public delete(req: NextApiRequest, res: NextApiResponse) {


  }


}

export default AnuncioController
