"use client";
import { ReactNode, useEffect, useState } from "react";

type DashboardCarteiraPageProps = {
  className?: string;
  children: ReactNode;
};

interface Transacao {
  id: number;
  descricao: string;
  item: string;
  valor: number;
  tipo: "entrada" | "saida";
}

const MOCK_SALDO = 100.51;

const MOCK_TRANSACOES: Transacao[] = [
  {
    id: 1,
    descricao: "Pagamento Recebido de aluguel",
    item: "Barraca de camp",
    valor: 56.0,
    tipo: "entrada",
  },
  {
    id: 2,
    descricao: "Pagamento Recebido de aluguel",
    item: "Barraca de camp",
    valor: 56.0,
    tipo: "entrada",
  },
  {
    id: 3,
    descricao: "Pagamento Recebido de aluguel",
    item: "Barraca de camp",
    valor: 56.0,
    tipo: "entrada",
  },
  {
    id: 4,
    descricao: "Pagamento Recebido de aluguel",
    item: "Barraca de camp",
    valor: 56.0,
    tipo: "entrada",
  },
  {
    id: 5,
    descricao: "Pagamento Recebido de aluguel",
    item: "Barraca de camp",
    valor: 56.0,
    tipo: "entrada",
  },
  {
    id: 6,
    descricao: "Pagamento Recebido de aluguel",
    item: "Barraca de camp",
    valor: 56.0,
    tipo: "entrada",
  },
];

const DashboardCarteiraPage: React.FC<DashboardCarteiraPageProps> = ({
  className,
  children,
}) => {
  const [saldo, setSaldo] = useState<number>(0);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/carteira/api");
        if (res.ok) {
          const data = await res.json();
          setSaldo(data.saldo ?? MOCK_SALDO);
          setTransacoes(
            data.transacoes?.length ? data.transacoes : MOCK_TRANSACOES,
          );
        } else {
          setSaldo(MOCK_SALDO);
          setTransacoes(MOCK_TRANSACOES);
        }
      } catch {
        setSaldo(MOCK_SALDO);
        setTransacoes(MOCK_TRANSACOES);
      }
    }
    carregar();
  }, []);
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
          <span className="text-2xl font-bold text-gray-900">
            R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 transition rounded-xl text-sm font-semibold text-gray-700"
        >
          Resgatar saldo
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-gray-100">
        {transacoes.map((t, i) => (
          <div
            key={t.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i % 2 === 0 ? "bg-gray-100" : "bg-white"
            }`}
          >
            <span className="text-sm text-gray-800">
              <span className="font-bold">{t.descricao}</span>
              {" - "}
              <span className="text-gray-400">{t.item}</span>
            </span>
            <span className="text-sm font-semibold text-gray-800 shrink-0 ml-4">
              R$ {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardCarteiraPage;
