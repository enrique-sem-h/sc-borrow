import { z } from "zod";

export const pagamentoSchema = z
  .object({
    valor: z.number().min(1),
    idAnuncio: z.string().length(36),
    dataInicio: z.iso.datetime(),
    dataFim: z.iso.datetime(),
    idLocatario: z.string().length(36),
  })
  .refine(
    (data) => {
      const start = new Date(data.dataInicio);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return start >= today;
    },
    {
      message: "A data inicial deve ser a partir de hoje",
      path: ["dataInicio"],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.dataInicio);
      const end = new Date(data.dataFim);

      return end > start;
    },
    {
      message: "A data final deve ser maior que a data inicial",
      path: ["dataFim"],
    },
  );
