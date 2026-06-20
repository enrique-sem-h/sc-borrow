import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useGetCarteira() {
  const { isAuth } = useAuth()!;
  const query = useQuery({
    queryKey: ["carteira"],
    queryFn: apiService.users.carteira,
    enabled: isAuth,
    staleTime: 0,
    gcTime: 0,
  });

  return query;
}

export function useGetSaldo() {
  const { isAuth } = useAuth()!;
  const query = useQuery({
    queryKey: ["saldo"],
    queryFn: apiService.users.saldo,
    enabled: isAuth,
    staleTime: 0,
    gcTime: 0,
  });

  return query;
}
