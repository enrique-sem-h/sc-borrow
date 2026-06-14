import apiService from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useGetAnuncios() {
  const query = useQuery({
    queryKey: ["anuncios"],
    queryFn: apiService.anuncios.getAll,
  });

  return query;
}

export function useGetAnuncio(id: string | undefined | null) {
  const query = useQuery({
    queryKey: ["anuncio", id],
    queryFn: () => apiService.anuncios.get(id!),
    enabled: !!id,
  });

  return query;
}
