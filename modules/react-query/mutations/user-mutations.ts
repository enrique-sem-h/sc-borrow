import { queryClient } from "@/contexts/Providers";
import apiService from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export function useResgatarSaldo() {
  const mutation = useMutation({
    mutationFn: apiService.users.resgatar,
    async onSuccess(data, variables, onMutateResult, context) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["carteira"] }),
        queryClient.invalidateQueries({ queryKey: ["saldo"] }),
      ]);
    },
  });

  return mutation;
}
