"use client";
import { ChevronLeft, Image as ImageIcon, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return (parseInt(digits, 10) / 100).toFixed(2).replace(".", ",");
}

export default function EditarAnuncioPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const params = useParams();
  const idAnuncio = params?.id;

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoDiario, setPrecoDiario] = useState("");
  const [caucao, setCaucao] = useState("");
  const [disponivel, setDisponivel] = useState(true);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!idAnuncio) return;

    async function buscarDadosAnuncio() {
      try {
        setLoading(true);
        const res = await fetch(`/Meusanuncios/${idAnuncio}/api`);
        if (res.ok) {
          const data = await res.json();
          setTitulo(data.titulo);
          setDescricao(data.descricao);
          setCategoria(data.categoria);
          setPrecoDiario(maskCurrency((data.valorDiario * 100).toString()));
          setCaucao(maskCurrency((data.caucao * 100).toString()));
        } else {
          alert("Erro ao carregar o anúncio informado.");
          router.push("/Meusanuncios");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarDadosAnuncio();
  }, [idAnuncio, router]);

  const handleSalvarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !categoria || !descricao || !precoDiario || !caucao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSalvando(true);
      const cleanPreco = precoDiario.replace(".", "").replace(",", ".");
      const cleanCaucao = caucao.replace(".", "").replace(",", ".");

      const res = await fetch(`/Meusanuncios/${idAnuncio}/api`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          category: categoria,
          valor_diario: cleanPreco,
          caucao: cleanCaucao,
        }),
      });

      if (res.ok) {
        setShowModal(true);
      } else {
        alert("Erro ao salvar alterações.");
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 font-medium animate-pulse">Buscando informações do anúncio...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans text-[#1a1a1a]">
      <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" />

      <header className="px-12 py-6 flex items-center gap-6 shrink-0">
        <button onClick={() => router.back()} className="hover:bg-gray-100 p-2 rounded-full transition-all">
          <ChevronLeft size={32} strokeWidth={2.5} className="text-gray-800" />
        </button>

        <h2 className="text-4xl font-serif font-bold tracking-tight">
          Editar anúncio: <span className="font-serif font-bold text-gray-600">{titulo}</span>
        </h2>
      </header>

      <div className="flex-1 flex flex-row gap-10 px-12 pb-8 min-h-0 max-w-[1600px] mx-auto w-full items-stretch">
        <section className="w-[340px] xl:w-[380px] flex flex-col shrink-0 self-start">
          <h3 className="text-lg font-serif mb-4 text-gray-800 ml-1">Galeria de fotos</h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-[420px] bg-[#f8f9fa] rounded-[40px] border border-gray-100 flex items-center justify-center mb-6 cursor-pointer hover:bg-gray-100 transition-all"
          />

          <div className="grid grid-cols-4 gap-3 mb-6 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-[#f8f9fa] rounded-2xl border border-gray-100 flex items-center justify-center">
                <ImageIcon size={20} className="text-gray-300" />
              </div>
            ))}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-2xl border border-gray-300 text-lg font-serif font-medium hover:bg-gray-50 transition-all text-gray-700"
          >
            Adicionar fotos
          </button>
        </section>

        <section className="flex-[2.5] bg-[#fcfcfc] rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/40 flex flex-col min-h-0 self-start max-h-[82vh]">
          <div className="px-12 pt-8 pb-4 shrink-0">
            <h3 className="text-2xl font-serif text-gray-900 font-bold">Informações básicas</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-12 pb-10 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <Label text="Título do anúncio" required />
                <Input value={titulo} onChange={(e: any) => setTitulo(e.target.value)} />
              </div>

              <div className="col-span-4">
                <Label text="Categoria" required />
                <div className="relative">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 appearance-none outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all text-gray-600 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Camping">Camping</option>
                    <option value="Equipamentos de festa">Equipamentos de festa</option>
                    <option value="Lazer">Lazer</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[10px]">▼</div>
                </div>
              </div>
            </div>

            <div>
              <Label text="Descrição detalhada" required />
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 h-28 resize-none outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label text="Preço diário" required />
                <div className="relative">
                  <Input
                    value={precoDiario}
                    onChange={(e: any) => setPrecoDiario(maskCurrency(e.target.value))}
                    placeholder="0,00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs italic font-sans">/ dia *</span>
                </div>
              </div>

              <div>
                <Label text="Depósito de caução" required />
                <Input
                  value={caucao}
                  onChange={(e: any) => setCaucao(maskCurrency(e.target.value))}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xl font-serif font-bold text-gray-800">Disponibilidade</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${disponivel ? "text-green-500" : "text-gray-400"}`}>
                  {disponivel ? "● Disponível" : "○ Indisponível"}
                </span>
                <button
                  onClick={() => setDisponivel((v) => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${disponivel ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${disponivel ? "left-[26px]" : "left-[2px]"}`} />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <p className="font-serif text-2xl font-bold mb-4">Ações finais</p>
              <button
                onClick={handleSalvarAlteracoes}
                disabled={salvando}
                className="w-full py-4 rounded-2xl border-2 border-blue-400 text-blue-600 font-serif text-xl font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all bg-white shadow-lg shadow-blue-50 disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </section>
      </div>
       
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-[36px] p-10 shadow-2xl border border-gray-100">
            
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check size={38} className="text-green-600" strokeWidth={3} />
            </div>

            <h3 className="text-3xl font-serif font-bold text-center text-gray-900 mb-3">
              Anúncio alterado!
            </h3>

            <p className="text-center text-gray-500 leading-relaxed mb-8">
              Suas modificações foram salvas no banco de dados com sucesso.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Fechar
              </button>

              <button
                onClick={() => router.push("/Meusanuncios")}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-medium shadow-md shadow-blue-200"
              >
                Ir para Meus anúncios
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </main>
  );
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-gray-700 text-sm font-serif font-semibold mb-1.5 ml-1">
      {text}
      {required && <span className="text-red-500 ml-1 font-sans">*</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all placeholder:text-gray-300"
    />
  );
}