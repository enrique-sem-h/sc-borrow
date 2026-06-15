import { AluguelTipo } from "@/server/controllers/aluguel-controller";
import apiService from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { id } from "date-fns/locale";

export function useGetAlugueis(type?: AluguelTipo) {
  const query = useQuery({
    queryKey: ["anuncio", type],
    queryFn: () => apiService.alugueis.getAll(type),
  });

  return query;
}
