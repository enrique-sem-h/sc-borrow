"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User, LayoutGrid, Key, DollarSign, MessageCircle,
  HelpCircle, LogOut, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { LogoutModal } from "@/components/ui/logout-modal";

const faqs = [
  {
    question: "Como fazer um bom anúncio?",
    answer:
      "Capriche nas fotos: use boa iluminação e mostre o item de vários ângulos. Descreva o estado de conservação com honestidade, informe as dimensões quando relevante e defina um preço justo consultando itens semelhantes na plataforma. Quanto mais completo o anúncio, maior a chance de aluguel.",
  },
  {
    question: "Como evitar fraudes na hora de alugar um item?",
    answer:
      "Sempre realize a negociação e o pagamento dentro da plataforma. Nunca transfira dinheiro diretamente para o locador antes de confirmar o aluguel pelo sistema. Verifique o perfil e as avaliações do usuário antes de fechar negócio e prefira combinações em locais públicos para a entrega.",
  },
  {
    question: "Quais são as melhores formas de combinar uma retirada?",
    answer:
      "Use o chat interno da plataforma para alinhar dia, horário e local. Prefira locais públicos e movimentados como shopping centers, estações de metrô ou agências dos Correios. Confirme os detalhes pelo menos 24 horas antes para evitar imprevistos.",
  },
  {
    question: "Como posso testar o produto em locais públicos?",
    answer:
      "Na entrega, peça ao locador para demonstrar o funcionamento do item na hora. Verifique visualmente por danos, riscos ou peças faltando e teste as funcionalidades principais antes de assinar o checklist de recebimento. Caso haja divergência em relação ao anúncio, você pode cancelar o aluguel sem custo.",
  },
  {
    question: "O que acontece se o item for devolvido com danos?",
    answer:
      "Ao devolver o item, ambas as partes preenchem o checklist de devolução. Caso seja identificado um dano causado durante o aluguel, o locatário é responsável pelo ressarcimento combinado entre as partes. Recomendamos registrar o estado do item com fotos tanto na entrega quanto na devolução.",
  },
  {
    question: "Como funciona o cancelamento de um aluguel?",
    answer:
      "Você pode cancelar um aluguel antes do início do período combinado sem nenhum custo. Após o início do aluguel, o cancelamento pode estar sujeito a taxas dependendo do tempo decorrido. Para cancelar, acesse 'Meus aluguéis', selecione o aluguel desejado e clique em 'Cancelar aluguel'.",
  },
];

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

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-100 hover:bg-gray-200 transition text-left text-sm font-medium text-gray-800"
      >
        <span>{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed bg-white">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function AjudaPage() {
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
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Atendimento ao cliente
        </h1>
        <div className="border-t border-gray-300 mb-8" />

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
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
