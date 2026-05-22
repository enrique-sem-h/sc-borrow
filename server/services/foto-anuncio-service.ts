import cloudinary from "@/lib/cloudinary";
import fotoAnuncioRepository from "@/server/repositories/foto-anuncio-repository";
import { CreateFotoAnuncioDTO } from "../types";
import formidable from "formidable";
import fs from "fs/promises";

class FotoAnuncioService {
  public async upload(
    idAnuncio: string,
    file: formidable.File,
    ordem: number,
    principal: boolean,
  ) {
    const buffer = await fs.readFile(file.filepath);

    // upload para o Cloudinary
    const cloudinaryURL = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `anuncios/${idAnuncio}`,
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          }
          resolve(result!.secure_url);
        },
      );
      uploadStream.end(buffer);
    });

    const dto: CreateFotoAnuncioDTO = {
      anuncioId: idAnuncio,
      url: cloudinaryURL,
      ordem,
      principal,
    };

    // save das fotos no banco
    await fotoAnuncioRepository.create(dto);
  }

  public async bulkUpload(idAnuncio: string, files: formidable.File[]) {
    await Promise.all(
      files.map((file, index) => {
        this.upload(idAnuncio, file, index, index === 0);
      }),
    );
  }
}

export default FotoAnuncioService;
