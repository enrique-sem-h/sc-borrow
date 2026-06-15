"use client";
import { LogoutModal } from "@/components/ui/logout-modal";
import { AvaliarModal } from "@/components/ui/rate-modal";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { alugueis } from "@/infra/database/schemas/alugueisSchema";
import { useGetAlugueis } from "@/modules/react-query/queries/aluguel-queries";
import { useGetAnuncios } from "@/modules/react-query/queries/anuncios-queries";
import {
  User,
  LayoutGrid,
  Key,
  DollarSign,
  MessageCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type DasboardLayoutProps = {
  children: ReactNode;
};

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

const DasboardLayout: React.FC<DasboardLayoutProps> = ({ children }) => {
  const alugueisQuery = useGetAlugueis("locatario");
  const anunciosQuery = useGetAnuncios();
  const alugueis = alugueisQuery.data?.data;
  const anuncios = anunciosQuery.data?.data?.anuncios;
  const aluguelCount = alugueis?.length || 0;
  const anuncioCount = anuncios?.length || 0;
  const chatCount = 0;
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const pathname = usePathname();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    auth?.logout();
    router.push("/");
  };

  const menuItems = [
    {
      id: "dados",
      label: "Meus dados",
      icon: <User size={20} />,
      path: "/dashboard/meus-dados",
    },
    {
      id: "anuncios",
      label: "Meus anúncios",
      icon: <LayoutGrid size={20} />,
      path: "/dashboard/meus-anuncios",
      badge: anuncioCount > 0 ? anuncioCount : undefined,
    },
    {
      id: "alugueis",
      label: "Meus aluguéis",
      icon: <Key size={20} />,
      path: "/dashboard/meus-alugueis",
      badge: aluguelCount > 0 ? aluguelCount : undefined,
    },
    ,
    {
      id: "carteira",
      label: "Carteira",
      icon: <DollarSign size={20} />,
      path: "/dashboard/carteira",
    },
    {
      id: "chats",
      label: "Chats",
      icon: <MessageCircle size={20} />,
      path: "/dashboard/chat",
      badge: chatCount > 0 ? chatCount : undefined,
    },
    {
      id: "ajuda",
      label: "Ajuda",
      icon: <HelpCircle size={20} />,
      path: "/dashboard/ajuda",
    },
  ];
  return (
    <main className="min-h-screen bg-[#f8f9fa] flex p-8 gap-12 font-sans">
      <aside className="w-80 bg-white rounded-[32px] p-8 shadow-sm h-fit flex flex-col justify-between min-h-[520px]">
        <div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gray-300" />
            </div>
            <h2 className="text-xl font-bold flex items-center gap-1.5">
              {user?.nome ?? "Usuário"}
              <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-4 h-4 text-[9px] font-extrabold">
                ✓
              </span>
            </h2>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              {user?.rep ? user.rep.toFixed(1) : "0.0"}{" "}
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

      <section className="flex-1">{children}</section>

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
};

export default DasboardLayout;
