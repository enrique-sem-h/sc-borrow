import { queryClient } from "@/contexts/Providers";
import { Aluguel } from "@/server/types";
import apiService from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export function useChangeAluguelStatus() {
  const mutation = useMutation({
    mutationFn: (data: { id: string; status: Aluguel["status"] }) =>
      apiService.alugueis.changeStatus(data.id, data.status),
    async onSuccess(data, variables, onMutateResult, context) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["alugueis"] }),
        queryClient.invalidateQueries({ queryKey: ["aluguel", variables.id] }),
      ]);
    },
  });

  return mutation;
}
