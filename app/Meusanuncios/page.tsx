"use client";

import React, { useState } from 'react';
import { 
  User, LayoutGrid, Key, DollarSign, MessageCircle, 
  HelpCircle, Edit3, Trash2, Star 
} from 'lucide-react';

import { DeleteModal } from '@/components/ui/delete-modal';
import { SuccessModal } from '@/components/ui/success-delete-modal';

const MenuItem = ({ icon, label, active = false}: any) => (
  <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
    active ? 'bg-gray-100 font-bold text-black' : 'hover:bg-gray-50 text-gray-500 font-medium'
  }`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
  </div>
);

// TERMINAR ESSA PAGINA

export default function MeusAnunciosPage() {
  const [modalType, setModalType] = useState<'none' | 'confirm' | 'success'>('none');
  
  const itemExcluir = "Furadeira Tramontina"; 

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex p-8 gap-12 font-sans">
      
      <aside className="w-80 bg-white rounded-[32px] p-8 shadow-sm h-fit">
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <h2 className="text-xl font-bold flex items-center gap-1">
            Fulano da Silvia 
            <span className="text-blue-600 text-[10px] translate-y-[-2px]">●</span>
          </h2>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            ★ 5.0 <span className="text-gray-300 font-light">(19 avaliações)</span>
          </p>
        </div>

        <nav className="w-full space-y-1">
          <MenuItem icon={<User size={20} />} label="Meus dados" />
          <MenuItem icon={<LayoutGrid size={20} />} label="Meus anúncios" active badge={1} />
          <MenuItem icon={<Key size={20} />} label="Meus aluguéis" />
          <MenuItem icon={<DollarSign size={20} />} label="Carteira" />
          <MenuItem icon={<MessageCircle size={20} />} label="Chats" badge={2} />
          <MenuItem icon={<HelpCircle size={20} />} label="Ajuda" />
        </nav>
      </aside>

      <section className="flex-1">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-10">
          Meus anúncios ativos
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {[1].map((i) => (
            <div key={i} className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 relative group">
              
              <div className="bg-[#e9ecef] rounded-2xl h-48 mb-4 relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    //onClick={() => setModalType()} // editar caminho
                    className="bg-white/90 p-1.5 rounded-lg shadow-sm hover:bg-white text-gray-600 transition"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => setModalType('confirm')}
                    className="bg-white/90 p-1.5 rounded-lg shadow-sm hover:bg-white text-gray-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="px-1">
                <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-tight">
                  Furadeira Tramontina
                </h3>
                <div className="flex justify-between items-end mt-1">
                  <p className="font-extrabold text-lg text-gray-900">R$ 35/dia</p>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-[13px] font-bold">5.0</span>
                    <Star size={14} className="fill-gray-900 text-gray-900" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DeleteModal 
        isOpen={modalType === 'confirm'} 
        onClose={() => setModalType('none')}
        onConfirm={() => setModalType('success')} 
        itemName={itemExcluir}
      />

      <SuccessModal 
        isOpen={modalType === 'success'} 
        onClose={() => setModalType('none')}
        itemName={itemExcluir}
      />

    </main>
  );
}