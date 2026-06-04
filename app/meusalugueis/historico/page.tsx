"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface AluguelHistorico {
  id: string;
  titulo: string;
  data_inicio: string;
  data_fim: string;
  foto_principal?: string | null;
}

const MOCK_HISTORICO: AluguelHistorico[] = [
  { id: '1', titulo: 'Barraca de camp',  data_inicio: '10', data_fim: '14 Abr', foto_principal: null },
  { id: '2', titulo: 'Caixa de som',     data_inicio: '05', data_fim: '07 Abr', foto_principal: null },
  { id: '3', titulo: 'Prancha de surf',  data_inicio: '12', data_fim: '14 Abr', foto_principal: null },
  { id: '4', titulo: 'Barraca de camp',  data_inicio: '10', data_fim: '14 Abr', foto_principal: null },
  { id: '5', titulo: 'Caixa de som',     data_inicio: '05', data_fim: '07 Abr', foto_principal: null },
  { id: '6', titulo: 'Prancha de surf',  data_inicio: '12', data_fim: '14 Abr', foto_principal: null },
];

export default function HistoricoAlugueisPage() {
  const router = useRouter();
  const [historico, setHistorico] = useState<AluguelHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const res = await fetch('/meusalugueis/historico/api');
        if (res.ok) {
          const dados = await res.json();
          setHistorico(dados.length > 0 ? dados : MOCK_HISTORICO);
        } else {
          setHistorico(MOCK_HISTORICO);
        }
      } catch {
        setHistorico(MOCK_HISTORICO);
      } finally {
        setLoading(false);
      }
    }

    carregarHistorico();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <p className="text-gray-500 font-medium animate-pulse">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex items-start justify-center p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[32px] p-10 shadow-sm">

        <div className="flex items-center justify-center relative mb-10">
          <button
            onClick={() => router.push('/meusalugueis')}
            className="absolute left-0 p-2 rounded-xl hover:bg-gray-100 transition text-gray-600"
          >
            <ChevronLeft size={28} />
          </button>

          <h1 className="text-3xl font-['Shrikhand'] tracking-tight bg-gray-100 px-8 py-3 rounded-full">
            Histórico de alugueis
          </h1>
        </div>

        {historico.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            Nenhum aluguel concluído ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {historico.map((item) => (
              <div key={item.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-[#e9ecef] h-44 flex items-center justify-center overflow-hidden">
                  {item.foto_principal ? (
                    <img
                      src={item.foto_principal}
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs font-medium">Sem imagem</div>
                  )}
                </div>

                <div className="p-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{item.titulo}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.data_inicio} - {item.data_fim}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold shrink-0">
                    Avaliado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
