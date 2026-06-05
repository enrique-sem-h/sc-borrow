"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User, LayoutGrid, Key, DollarSign, MessageCircle,
  HelpCircle, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutModal } from "@/components/ui/logout-modal";

interface Transacao {
  id: number;
  descricao: string;
  item: string;
  valor: number;
  tipo: "entrada" | "saida";
}

const MOCK_TRANSACOES: Transacao[] = [
  { id: 1, descricao: "Pagamento Recebido de aluguel", item: "Barraca de camp", valor: 56.00, tipo: "entrada" },
  { id: 2, descricao: "Pagamento Recebido de aluguel", item: "Barraca de camp", valor: 56.00, tipo: "entrada" },
  { id: 3, descricao: "Pagamento Recebido de aluguel", item: "Barraca de camp", valor: 56.00, tipo: "entrada" },
  { id: 4, descricao: "Pagamento Recebido de aluguel", item: "Barraca de camp", valor: 56.00, tipo: "entrada" },
  { id: 5, descricao: "Pagamento Recebido de aluguel", item: "Barraca de camp", valor: 56.00, tipo: "entrada" },
  { id: 6, descricao: "Pagamento Recebido de aluguel", item: "Barraca de camp", valor: 56.00, tipo: "entrada" },
];

const MOCK_SALDO = 100.51;

const MenuItem = ({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition text-sm ${
      active
        ? "bg-gray-100 font-bold text-black"
        : "hover:bg-gray-50 text-gray-500 font-medium"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge ? (
      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
        {badge}
      </span>
    ) : null}
  </button>
);

export default function CarteiraPage() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const user = auth?.user;

  const [saldo, setSaldo] = useState<number>(0);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/carteira/api");
        if (res.ok) {
          const data = await res.json();
          setSaldo(data.saldo ?? MOCK_SALDO);
          setTransacoes(data.transacoes?.length ? data.transacoes : MOCK_TRANSACOES);
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

  const menuItems = [
    { id: "dados",    label: "Meus dados",    icon: <User size={20} />,           path: "/meusdados",     badge: undefined },
    { id: "anuncios", label: "Meus anúncios", icon: <LayoutGrid size={20} />,     path: "/Meusanuncios",  badge: 1 },
    { id: "alugueis", label: "Meus aluguéis", icon: <Key size={20} />,            path: "/meusalugueis",  badge: 1 },
    { id: "carteira", label: "Carteira",       icon: <DollarSign size={20} />,    path: "/carteira",      badge: undefined },
    { id: "chats",    label: "Chats",          icon: <MessageCircle size={20} />, path: "/chats",         badge: 2 },
    { id: "ajuda",    label: "Ajuda",          icon: <HelpCircle size={20} />,    path: "/ajuda",         badge: undefined },
  ];

  const handleLogout = () => {
    auth?.logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex p-8 gap-12 font-sans">

      <aside className="w-80 bg-white rounded-[32px] p-8 shadow-sm h-fit flex flex-col justify-between min-h-[520px]">
        <div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-4" />
            <h2 className="text-xl font-bold flex items-center gap-1.5">
              {user?.nome ?? "Usuário"}
              <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-4 h-4 text-[9px] font-extrabold">
                ✓
              </span>
            </h2>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              {user?.rep ? user.rep.toFixed(1) : "0.0"}
              <span className="text-gray-300 font-light">(Reputação)</span>
            </p>
          </div>

          <nav className="w-full space-y-1">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={(pathname ?? "") === item.path}
                onClick={() => router.push(item.path)}
                badge={item.badge}
              />
            ))}
          </nav>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 p-3 mt-8 text-gray-500 hover:text-red-600 transition font-medium border-t border-gray-100"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </aside>

      <section className="flex-1 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Carteira</h1>
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
      </section>

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
}
