import { useAuth } from "@/contexts/AuthContext";
import { AluguelTipo } from "@/server/controllers/aluguel-controller";
import apiService from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { id } from "date-fns/locale";

export function useGetAlugueis(type?: AluguelTipo) {
  const { isAuth } = useAuth();

  const query = useQuery({
    queryKey: ["alugueis", type],
    queryFn: () => apiService.alugueis.getAll(type),
    enabled: isAuth,
  });

  return query;
}

export function useGetAluguel(id: string) {
  const { isAuth } = useAuth()!;

  const query = useQuery({
    queryKey: ["aluguel", id],
    queryFn: () => apiService.alugueis.get(id),
    enabled: isAuth && !!id,
  });

  return query;
}
