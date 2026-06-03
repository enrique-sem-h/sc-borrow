"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  User, LayoutGrid, Key, DollarSign, MessageCircle, HelpCircle, LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LogoutModal } from '@/components/ui/logout-modal';
import { AvaliarModal } from '@/components/ui/rate-modal';

interface Usuario {
  id: string;
  nome: string;
  rep: number;
  saldo: number;
}

interface Aluguel {
  id: string;
  titulo: string;
  data_inicio: string;
  data_fim: string;
  valor_total: number;
  status: 'ativo' | 'em_andamento' | 'concluido';
  foto_principal?: string | null;
  notificacoes?: number;
}

const MenuItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
      active
        ? 'bg-gray-100 font-bold text-black'
        : 'hover:bg-gray-50 text-gray-500 font-medium'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  </button>
);

const StatusBadge = ({ status, onAvaliar }: { status: Aluguel['status']; onAvaliar?: () => void }) => {
  if (status === 'ativo') {
    return (
      <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Ativo
      </span>
    );
  }
  if (status === 'em_andamento') {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Em andamento
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        Concluído
      </span>
      <button
        onClick={onAvaliar}
        className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-300 transition"
      >
        Avaliar
      </button>
    </div>
  );
};

const MOCK_ALUGUEIS: Aluguel[] = [
  {
    id: '1',
    titulo: 'Barraca de camp',
    data_inicio: '10 Abr',
    data_fim: '14 Abr',
    valor_total: 150,
    status: 'ativo',
    foto_principal: null,
    notificacoes: 1,
  },
  {
    id: '2',
    titulo: 'Prancha de surf',
    data_inicio: '12 Abr',
    data_fim: '14 Abr',
    valor_total: 50,
    status: 'em_andamento',
    foto_principal: null,
  },
  {
    id: '3',
    titulo: 'Caixa de som',
    data_inicio: '05 Abr',
    data_fim: '07 Abr',
    valor_total: 80,
    status: 'concluido',
    foto_principal: null,
  },
];

export default function MeusAlugueisPage() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [aluguelParaAvaliar, setAluguelParaAvaliar] = useState<Aluguel | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const res = await fetch('/meusalugueis/api');
        if (res.ok) {
          const dados = await res.json();
          setAlugueis(dados.length > 0 ? dados : MOCK_ALUGUEIS);
        } else {
          setAlugueis(MOCK_ALUGUEIS);
        }

        setUsuario({
          id: 'user-teste-123',
          nome: 'Fulano da Silvia',
          rep: 5.0,
          saldo: 0,
        });
      } catch (error) {
        setAlugueis(MOCK_ALUGUEIS);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const menuItems = [
    { id: 'dados',     label: 'Meus dados',    icon: <User size={20} />,        path: '/meusdados' },
    { id: 'anuncios',  label: 'Meus anúncios', icon: <LayoutGrid size={20} />,  path: '/Meusanuncios' },
    { id: 'alugueis',  label: 'Meus aluguéis', icon: <Key size={20} />,         path: '/meusalugueis' },
    { id: 'carteira',  label: 'Carteira',       icon: <DollarSign size={20} />,  path: '/carteira' },
    { id: 'chats',     label: 'Chats',          icon: <MessageCircle size={20} />, path: '/chats' },
    { id: 'ajuda',     label: 'Ajuda',          icon: <HelpCircle size={20} />,  path: '/ajuda' },
  ];

  const handleLogout = () => {
    auth?.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <p className="text-gray-500 font-medium animate-pulse">Carregando aluguéis...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex p-8 gap-12 font-sans">

      <aside className="w-80 bg-white rounded-[32px] p-8 shadow-sm h-fit flex flex-col justify-between min-h-[520px]">
        <div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gray-300" />
            </div>
            <h2 className="text-xl font-bold flex items-center gap-1.5">
              {usuario?.nome}
              <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-4 h-4 text-[9px] font-extrabold">
                ✓
              </span>
            </h2>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              {usuario?.rep ? usuario.rep.toFixed(1) : '0.0'}{' '}
              <span className="text-gray-300 font-light">(Reputação)</span>
            </p>
          </div>

          <nav className="w-full space-y-1">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={(pathname ?? '') === item.path}
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
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Meus aluguéis</h1>
          <button className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
            Histórico
          </button>
        </div>

        {alugueis.length === 0 ? (
          <div className="bg-white p-8 rounded-[28px] border text-center text-gray-400">
            Você não possui nenhum aluguel no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {alugueis.map((aluguel) => (
              <div key={aluguel.id} className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100">

                <div className="bg-[#e9ecef] rounded-2xl h-48 mb-4 relative overflow-hidden flex items-center justify-center">
                  {aluguel.foto_principal ? (
                    <img src={aluguel.foto_principal} alt={aluguel.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 text-xs font-medium">Sem imagem</div>
                  )}
                  {aluguel.notificacoes && aluguel.notificacoes > 0 ? (
                    <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {aluguel.notificacoes}
                    </span>
                  ) : null}
                </div>

                <div className="px-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{aluguel.titulo}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {aluguel.data_inicio} - {aluguel.data_fim}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">R$ {aluguel.valor_total}</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <StatusBadge
                      status={aluguel.status}
                      onAvaliar={() => setAluguelParaAvaliar(aluguel)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />

      <AvaliarModal
        isOpen={!!aluguelParaAvaliar}
        onClose={() => setAluguelParaAvaliar(null)}
        itemNome={aluguelParaAvaliar?.titulo ?? ''}
        periodoLocacao={aluguelParaAvaliar ? `${aluguelParaAvaliar.data_inicio} - ${aluguelParaAvaliar.data_fim}` : ''}
      />
    </main>
  );
}
