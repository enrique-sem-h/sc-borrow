import apiService from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useGetAnuncios() {
  const query = useQuery({
    queryKey: ["anuncios"],
    queryFn: apiService.anuncios.getAll,
  });

  return query;
}
