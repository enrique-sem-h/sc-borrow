"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User, LayoutGrid, Key, DollarSign, MessageCircle,
  HelpCircle, LogOut, Pencil, Eye, EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import FormInput from "@/components/ui/form-input";
import { LogoutModal } from "@/components/ui/logout-modal";

const meusDadosSchema = z.object({
  nome:     z.string().min(1, "Nome obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  email:    z.string().email("Email inválido"),
});

type MeusDadosForm = z.infer<typeof meusDadosSchema>;

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

export default function MeusDadosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { chatCount, aluguelCount, anuncioCount } = useNotifications();
  const user = auth?.user;

  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { handleSubmit, control } = useForm<MeusDadosForm>({
    resolver: zodResolver(meusDadosSchema),
    defaultValues: {
      nome:     user?.nome     ?? "",
      telefone: user?.telefone ?? "",
      email:    user?.email    ?? "",
    },
  });

  const menuItems = [
    { id: "dados",    label: "Meus dados",    icon: <User size={20} />,          path: "/meusdados" },
    { id: "anuncios", label: "Meus anúncios", icon: <LayoutGrid size={20} />,    path: "/Meusanuncios", badge: anuncioCount > 0 ? anuncioCount : undefined },
    { id: "alugueis", label: "Meus aluguéis", icon: <Key size={20} />,           path: "/meusalugueis", badge: aluguelCount > 0 ? aluguelCount : undefined },
    { id: "carteira", label: "Carteira",       icon: <DollarSign size={20} />,   path: "/carteira" },
    { id: "chats",    label: "Chats",          icon: <MessageCircle size={20} />, path: "/chats", badge: chatCount > 0 ? chatCount : undefined },
    { id: "ajuda",    label: "Ajuda",          icon: <HelpCircle size={20} />,    path: "/ajuda" },
  ];

  const handleLogout = () => {
    auth?.logout();
    router.push("/");
  };

  const onSubmit = async (data: MeusDadosForm) => {
    await fetch("/meusdados/api", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const enderecoFormatado = user
    ? `${user.logradouro}, ${user.bairro}, ${user.uf} ${user.cep}`
    : "";

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Nome completo:</label>
            <Controller
              name="nome"
              control={control}
              render={({ field, fieldState }) => (
                <div className="relative">
                  <FormInput placeholder="Nome completo" error={fieldState.error?.message} {...field} />
                  <Pencil size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              )}
            />
          </div>

          <div className="flex gap-3 items-start">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value="••••••••••••••••"
                readOnly
                className="w-full border-2 rounded-xl px-5 py-3 text-lg outline-none text-gray-400 bg-white border-gray-200 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="button" className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-sm font-semibold text-gray-700 shrink-0">
              Alterar senha
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">CPF:</label>
              <input type="text" value={user?.cpf ?? ""} readOnly className="w-full border-2 rounded-xl px-5 py-3 text-lg outline-none text-gray-500 bg-gray-50 border-gray-200" />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Data de nascimento:</label>
              <input type="date" className="w-full border-2 rounded-xl px-5 py-3 text-lg outline-none text-gray-500 bg-white border-gray-200 focus:border-gray-400 transition" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Celular:</label>
              <Controller
                name="telefone"
                control={control}
                render={({ field, fieldState }) => <FormInput placeholder="(61) 00000-0000" error={fieldState.error?.message} {...field} />}
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">E-mail:</label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => <FormInput placeholder="email@exemplo.com" error={fieldState.error?.message} {...field} />}
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Endereço:</label>
            <div className="flex gap-3 items-center border-2 border-gray-200 rounded-xl px-5 py-3 bg-white">
              <span className="flex-1 text-gray-600 text-sm">{enderecoFormatado}</span>
              <button type="button" className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-sm font-semibold text-gray-700 shrink-0">
                Alterar endereço
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-gray-200 hover:bg-gray-300 transition rounded-2xl text-xl font-serif font-bold text-gray-800">
            Salvar alterações
          </button>
        </form>
      </section>

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
}