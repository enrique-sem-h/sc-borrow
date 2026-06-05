import { queryClient } from "@/contexts/Providers";
import { AnuncioInsert } from "@/infra/database/schemas/anunciosSchema";
import { CreateAnuncioDTO } from "@/server/types";
import apiService from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export function useAddAnuncio() {
  const mutation = useMutation({
    mutationFn: apiService.anuncios.insert,
    async onSuccess(data, variables, onMutateResult, context) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["anuncios"] }),
        queryClient.invalidateQueries({ queryKey: ["anuncio"] }),
      ]);
    },
  });

  return mutation;
}

export function useDeleteAnuncio() {
  const mutation = useMutation({
    mutationFn: apiService.anuncios.delete,
    async onSuccess(data, variables, onMutateResult, context) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["anuncios"] }),
        queryClient.invalidateQueries({ queryKey: ["anuncio", variables] }),
      ]);
    },
  });

  return mutation;
}
