import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useGetAnuncios() {
  const { isAuth } = useAuth();
  const query = useQuery({
    queryKey: ["anuncios"],
    queryFn: apiService.anuncios.getAll,
    enabled: isAuth,
  });

  return query;
}

export function useGetAnuncio(id: string | undefined | null) {
  const { isAuth } = useAuth();

  const query = useQuery({
    queryKey: ["anuncio", id],
    queryFn: () => apiService.anuncios.get(id!),
    enabled: !!id && isAuth,
  });

  return query;
}
