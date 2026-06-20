import { Aluguel } from "@/server/types";

const StatusBadge = ({
  status,
  onAvaliar,
}: {
  status: Aluguel["status"];
  onAvaliar?: () => void;
}) => {
  if (status === "CANCELLED") {
    return (
      <span className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Cancelado
      </span>
    );
  }
  if (status === "WAITING_FOR_DISPATCH") {
    return (
      <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Esperando entrega
      </span>
    );
  }
  if (status === "WAITING_FOR_CONFIRM") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Esperando confirmação
      </span>
    );
  }
  if (status === "WAITING_FOR_DELIVERY") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Em rota
      </span>
    );
  }
  if (status === "ITEM_IN_HAND") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Objeto em mãos
      </span>
    );
  }

  if (status === "WAITING_FOR_RETURN_CONFIRM") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Em rota
      </span>
    );
  }
  if (status === "COMPLETED") {
    return (
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          Concluído
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAvaliar?.();
          }}
          className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-300 transition"
        >
          Avaliar
        </button>
      </div>
    );
  }
};

export default StatusBadge;
