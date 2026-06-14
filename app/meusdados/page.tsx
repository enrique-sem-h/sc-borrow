"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User, LayoutGrid, Key, DollarSign, MessageCircle,
  HelpCircle, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { LogoutModal } from "@/components/ui/logout-modal";

const MenuItem = ({ icon, label, active, onClick, badge }: any) => (
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

const Campo = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-base font-bold text-gray-900 mb-2">{label}</label>
    <div className="w-full border-2 rounded-xl px-5 py-3 text-lg text-gray-600 bg-gray-50 border-gray-200">
      {value || "—"}
    </div>
  </div>
);

export default function MeusDadosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { chatCount, aluguelCount, anuncioCount } = useNotifications();
  const user = auth?.user;

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { id: "dados",    label: "Meus dados",    icon: <User size={20} />,           path: "/meusdados" },
    { id: "anuncios", label: "Meus anúncios", icon: <LayoutGrid size={20} />,     path: "/Meusanuncios", badge: anuncioCount > 0 ? anuncioCount : undefined },
    { id: "alugueis", label: "Meus aluguéis", icon: <Key size={20} />,            path: "/meusalugueis", badge: aluguelCount > 0 ? aluguelCount : undefined },
    { id: "carteira", label: "Carteira",       icon: <DollarSign size={20} />,    path: "/carteira" },
    { id: "chats",    label: "Chats",          icon: <MessageCircle size={20} />, path: "/chats", badge: chatCount > 0 ? chatCount : undefined },
    { id: "ajuda",    label: "Ajuda",          icon: <HelpCircle size={20} />,    path: "/ajuda" },
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
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Meus dados</h1>
        <div className="border-t border-gray-300 mb-8" />

        <div className="space-y-6">
          <Campo label="Nome completo:" value={user?.nome ?? ""} />

          <div className="grid grid-cols-2 gap-6">
            <Campo label="CPF:" value={user?.cpf ?? ""} />
            <Campo label="E-mail:" value={user?.email ?? ""} />
          </div>

          <Campo label="Celular:" value={user?.telefone ?? ""} />

          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Endereço:</label>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="CEP:" value={user?.cep ?? ""} />
              <Campo label="UF:" value={user?.uf ?? ""} />
              <div className="col-span-2">
                <Campo label="Logradouro:" value={user?.logradouro ?? ""} />
              </div>
              <div className="col-span-2">
                <Campo label="Bairro:" value={user?.bairro ?? ""} />
              </div>
              <Campo label="Número:" value={user?.numero ? String(user.numero) : ""} />
              <Campo label="Complemento:" value={user?.complemento ?? ""} />
            </div>
          </div>
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
