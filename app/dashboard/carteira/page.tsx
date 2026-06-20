"use client";
import { ResgatarSaldoModal } from "@/components/ui/resgatar-saldo-modal";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useResgatarSaldo } from "@/modules/react-query/mutations/user-mutations";
import {
  useGetCarteira,
  useGetSaldo,
} from "@/modules/react-query/queries/user-queries";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

type DashboardCarteiraPageProps = {
  className?: string;
  children: ReactNode;
};

const DashboardCarteiraPage: React.FC<DashboardCarteiraPageProps> = ({
  className,
  children,
}) => {
  const [showResgatarSaldoModal, setShowResgatarSaldoModal] = useState(false);
  const { user } = useAuth()!;
  const carteiraQuery = useGetCarteira();
  const saldoQuery = useGetSaldo();

  const loadingCarteira = carteiraQuery.isLoading;
  const loadingSaldo = saldoQuery.isLoading;

  const resgatarSaldoMutation = useResgatarSaldo();

  const [loadingResgatarSaldo, setLoadingResgatarSaldo] = useState(false);

  const carteiraData = carteiraQuery.data?.data;
  const saldoData = saldoQuery.data?.data;

  async function handleConfirm() {
    try {
      setLoadingResgatarSaldo(true);

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 2000);
      });

      await resgatarSaldoMutation.mutateAsync();

      setShowResgatarSaldoModal(false);
      setLoadingResgatarSaldo(false);

      toast("Saldo resgatado com sucesso", {
        type: "success",
      });
    } catch (error) {
      toast("Erro ao resgatar saldo", {
        type: "error",
      });
    }
  }

  return (
    <>
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
        Carteira
      </h1>
      <div className="border-t border-gray-300 mb-8" />

      <p className="text-lg font-bold text-gray-900 mb-4">BorrowPay:</p>

      <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-6 py-5 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-base font-bold text-gray-700">Saldo:</span>
          {loadingSaldo && <Spinner className="size-5" />}
          {saldoData != null && (
            <span className="text-2xl font-bold text-gray-900">
              R${" "}
              {saldoData.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowResgatarSaldoModal(true)}
          className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 transition rounded-xl text-sm font-semibold text-gray-700"
        >
          Resgatar saldo
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-center">
          {loadingCarteira && <Spinner className="size-5" />}
        </div>
        {carteiraData &&
          carteiraData.map((t, i) => (
            <div
              key={t.id}
              className={`flex items-center justify-between px-6 py-4 ${
                i % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <span className="text-sm text-gray-800">
                <span className="font-bold">{t.message}</span>
                {" - "}
                <span className="text-gray-400">
                  {t.aluguel.anuncio.titulo}
                </span>
              </span>
              <span className="text-sm font-semibold text-gray-800 shrink-0 ml-4">
                R${" "}
                {t.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
      </div>

      <ResgatarSaldoModal
        loading={loadingResgatarSaldo}
        isOpen={showResgatarSaldoModal}
        onClose={() => setShowResgatarSaldoModal(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default DashboardCarteiraPage;
