import cloudinary from "@/lib/cloudinary";
import fotoAnuncioRepository from "@/server/repositories/foto-anuncio-repository";
import { CreateFotoAnuncioDTO } from "../types";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

import crypto from "crypto";
interface IFileUploaderProvider {
  upload(file: formidable.File, folder: string): Promise<string>;
}

class CloudinaryFileUploaderProvider implements IFileUploaderProvider {
  async upload(file: formidable.File, folder: string): Promise<string> {
    const buffer = await fs.readFile(file.filepath);

    const cloudinaryURL = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
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

    return cloudinaryURL;
  }
}

class LocalFileUploaderProvider implements IFileUploaderProvider {
  async upload(file: formidable.File, folder: string): Promise<string> {
    const targetDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(targetDir, { recursive: true });

    const randomName = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalFilename!);
    const fileName = `${randomName}${ext}`;
    const targetPath = path.join(targetDir, fileName);

    await fs.rename(file.filepath, targetPath);
    let relativePath = path.relative(
      path.join(process.cwd(), "public"),
      targetPath,
    );

    if (process.platform === "win32") {
      relativePath = relativePath.split(path.win32.sep).join(path.posix.sep);
    }

    return relativePath;
  }
}

let uploaderProvider: IFileUploaderProvider;

if (process.env.NODE_ENV === "production") {
  uploaderProvider = new CloudinaryFileUploaderProvider();
} else {
  uploaderProvider = new LocalFileUploaderProvider();
}

class FotoAnuncioService {
  public async upload(
    idAnuncio: string,
    file: formidable.File,
    ordem: number,
    principal: boolean,
  ) {
    const fileUrl = await uploaderProvider.upload(file, "anuncios");
    // upload para o Cloudinary
    // const cloudinaryURL = await new Promise<string>((resolve, reject) => {
    //   const uploadStream = cloudinary.uploader.upload_stream(
    //     {
    //       folder: `anuncios/${idAnuncio}`,
    //     },
    //     (error, result) => {
    //       if (error || !result) {
    //         reject(error);
    //       }
    //       resolve(result!.secure_url);
    //     },
    //   );
    //   uploadStream.end(buffer);
    // });

    const dto: CreateFotoAnuncioDTO = {
      anuncioId: idAnuncio,
      url: fileUrl,
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
