import { AnuncioInsert } from "@/infra/database/schemas/anunciosSchema";
import { CreateAnuncioDTO } from "@/server/types";
import apiService from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export function useAddAnuncio() {
  const mutation = useMutation({
    mutationFn: apiService.anuncios.insert,
    onSuccess(data, variables, onMutateResult, context) {},
  });

  return mutation;
}
