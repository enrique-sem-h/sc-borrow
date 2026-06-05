"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  LayoutGrid,
  Key,
  DollarSign,
  MessageCircle,
  HelpCircle,
  Edit3,
  Trash2,
  Star,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

import { DeleteModal } from "@/components/ui/delete-modal";
import { SuccessModal } from "@/components/ui/success-delete-modal";
import { LogoutModal } from "@/components/ui/logout-modal";
import { Anuncio } from "@/infra/database/schemas/anunciosSchema";
import { useGetAnuncios } from "@/modules/react-query/queries/anuncios-queries";
import { useDeleteAnuncio } from "@/modules/react-query/mutations/anuncios-mutations";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";

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

export default function MeusAnunciosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { chatCount, aluguelCount, anuncioCount } = useNotifications();
  const user = auth?.user;

  const [modalType, setModalType] = useState<"none" | "confirm" | "success">("none");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Anuncio | null>(null);

  const anunciosQuery = useGetAnuncios();
  const anuncioDeleteMutation = useDeleteAnuncio();
  const anuncios = anunciosQuery.data?.data?.anuncios || [];

  const menuItems = [
    { id: "dados", label: "Meus dados", icon: <User size={20} />, path: "/meusdados" },
    { id: "anuncios", label: "Meus anúncios", icon: <LayoutGrid size={20} />, path: "/Meusanuncios", badge: anuncioCount > 0 ? anuncioCount : undefined },
    { id: "alugueis", label: "Meus aluguéis", icon: <Key size={20} />, path: "/meusalugueis", badge: aluguelCount > 0 ? aluguelCount : undefined },
    { id: "carteira", label: "Carteira", icon: <DollarSign size={20} />, path: "/carteira" },
    { id: "chats", label: "Chats", icon: <MessageCircle size={20} />, path: "/chats", badge: chatCount > 0 ? chatCount : undefined },
    { id: "ajuda", label: "Ajuda", icon: <HelpCircle size={20} />, path: "/ajuda" },
  ];

  const handleOpenDeleteModal = (anuncio: Anuncio) => {
    setItemSelecionado(anuncio);
    setModalType("confirm");
  };

  const handleConfirmDelete = async () => {
    if (!itemSelecionado) {
      setModalType("none");
      return;
    }
    try {
      await anuncioDeleteMutation.mutateAsync(itemSelecionado.id);
      setModalType("success");
    } catch (error) {
      toast("Não foi possível deletar o anúncio", { type: "error" });
      setModalType("none");
    }
  };

  const handleLogout = () => {
    auth?.logout();
    router.push("/");
  };

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
                badge={item.badge}
                active={
                  (pathname ?? "") === item.path ||
                  ((pathname ?? "").startsWith("/Meusanuncios") && item.id === "anuncios")
                }
                onClick={() => router.push(item.path)}
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

      <section className="flex-1">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-10">
          Meus anúncios ativos
        </h1>

        {anuncios?.length === 0 ? (
          <div className="bg-white p-8 rounded-[28px] border text-center text-gray-400">
            Você não possui nenhum anúncio ativo no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
            {anuncios.map((anuncio) => {
              const mainImage = anuncio.fotos.find((foto) => foto.principal);
              return (
                <div key={anuncio.id} className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 relative group">
                  <div className="bg-[#e9ecef] rounded-2xl h-48 mb-4 relative overflow-hidden flex items-center justify-center">
                    {mainImage ? (
                      <img src={mainImage.url} alt={anuncio.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 text-xs font-medium">Sem imagem</div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button onClick={() => router.push(`/Meusanuncios/${anuncio.id}/editar`)} className="bg-white/95 p-1.5 rounded-lg shadow-sm hover:bg-white text-gray-600 transition">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleOpenDeleteModal(anuncio)} className="bg-white/95 p-1.5 rounded-lg shadow-sm hover:bg-white text-gray-600 transition hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-tight">{anuncio.titulo}</h3>
                    <div className="flex justify-between items-end mt-1">
                      <p className="font-extrabold text-lg text-gray-900">R$ {anuncio.valorDiario.toFixed(2).replace(".", ",")} /dia</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <DeleteModal isOpen={modalType === "confirm"} onClose={() => setModalType("none")} onConfirm={handleConfirmDelete} itemName={itemSelecionado?.titulo || ""} />
      <SuccessModal isOpen={modalType === "success"} onClose={() => setModalType("none")} itemName={itemSelecionado?.titulo || ""} />
      <LogoutModal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onConfirm={handleLogout} />
    </main>
  );
}