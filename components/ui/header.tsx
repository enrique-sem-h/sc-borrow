"use client";
import { useState } from "react";
import {
  Search,
  Bell,
  ClipboardList,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginModal from "@/components/ui/login-modal";
import RegisterModal from "./register-modal";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const auth = useAuth();
  const isAuth = auth?.isAuth ?? false;
  const user = auth?.user ?? null;

  const onRegisterBtnClick = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const onLoginBtnClick = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const navigate = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  function onRegisterSuccess(): void {
    toast("Registro feito com sucesso!");
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  }

  function onLoginSuccess(): void {
    setIsLoginOpen(false);
  }

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-3xl md:text-4xl font-['Shrikhand'] tracking-tight shrink-0"
          >
            BORROW
          </Link>

          <div className="flex items-center bg-[#f5f5f5] border border-gray-300 rounded-lg px-5 py-3 w-full max-w-xl">
            <input
              type="text"
              placeholder="Buscar"
              aria-label="Buscar itens"
              className="bg-transparent flex-1 outline-none text-lg placeholder:text-gray-500"
              onKeyDown={(e) => {
                // TODO: Realizar filtro de busca
              }}
            />
            <Search className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </div>

          <div className="hidden md:flex items-center gap-2 md:gap-4 text-lg text-gray-700">
            <button
              onClick={() => router.push("/Meusanuncios")}
              aria-label="Meus anúncios"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ClipboardList className="w-5 h-5" aria-hidden="true" />
              <span className="hidden lg:inline">Meus anúncios</span>
            </button>

            <button
              onClick={() => {
                /* TODO: ir para página "chat" */
              }}
              aria-label="Chat"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span className="hidden lg:inline">Chat</span>
            </button>

            <button
              onClick={() => {
                /* TODO: abrir as "notificações" */
              }}
              aria-label="Notificações"
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              onClick={() => {
                if (isAuth) {
                  router.push("/anunciar");
                } else {
                  toast("Logue-se para poder anunciar!");
                  setIsLoginOpen(true);
                }
              }}
              className="border border-gray-300 rounded-xl px-4 md:px-8 py-2 hover:bg-gray-100 transition text-sm md:text-base"
            >
              Anunciar
            </button>

            {isAuth ? (
              <button
                onClick={() => router.push("/meusdados")}
                aria-label="Perfil"
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg hover:opacity-80 transition shrink-0"
              >
                {user?.nome?.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="border border-gray-300 rounded-xl px-4 md:px-8 py-2 hover:bg-gray-100 transition text-sm md:text-base"
              >
                Entrar
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition shrink-0"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            <button
              onClick={() => navigate("/Meusanuncios")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
            >
              <ClipboardList className="w-5 h-5" />
              Meus anúncios
            </button>

            <button
              onClick={() => {
                /* TODO: ir para página "chat" */
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
            >
              <MessageCircle className="w-5 h-5" />
              Chat
            </button>

            <button
              onClick={() => {
                /* TODO: abrir as "notificações" */
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
            >
              <Bell className="w-5 h-5" />
              Notificações
            </button>

            <button
              onClick={() => navigate("/anunciar")}
              className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-gray-700"
            >
              Anunciar
            </button>

            {isAuth ? (
              <button
                onClick={() => navigate("/meusdados")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
              >
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-base shrink-0">
                  {user?.nome?.charAt(0).toUpperCase()}
                </span>
                Meu perfil
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLoginOpen(true);
                }}
                className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-gray-700"
              >
                Entrar
              </button>
            )}
          </div>
        )}
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={onRegisterBtnClick}
        onLoginSuccess={onLoginSuccess}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLogin={onLoginBtnClick}
        onSuccess={onRegisterSuccess}
      />
    </>
  );
}
