"use client";
import { useAuth } from "@/contexts/AuthContext";
import { dbFirebase } from "@/infra/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  doc,
  addDoc,
  serverTimestamp,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";
import { ChevronLeft, Search, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";

interface Mensagem {
  id: string;
  texto: string;
  remetenteId: string;
  timestamp: string;
  lida: boolean;
}

interface Conversa {
  id: string;
  idAluguel: string;
  nomeLocador: string;
  nomeLocatario: string;
  idLocador: string;
  idLocatario: string;
  itemAcordo: string;
  periodoAcordo: string;
  ultimaMensagem: string;
  naoLidas: Record<string, number>;
}

type ChatFormValues = {
  mensagemTexto: string;
  buscaConversa: string;
};

function DashboardChatContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const mensagensEndRef = useRef<HTMLDivElement | null>(null);

  const usuarioLogadoId = user?.id || "";

  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);

  const { handleSubmit, control, reset, watch } = useForm<ChatFormValues>({
    defaultValues: { mensagemTexto: "", buscaConversa: "" },
  });

  const termoBusca = watch("buscaConversa");
  const conversasFiltradas = conversas.filter((c) => {
    const nomeOutro =
      c.idLocador === usuarioLogadoId ? c.nomeLocatario : c.nomeLocador;
    return (
      nomeOutro.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.itemAcordo.toLowerCase().includes(termoBusca.toLowerCase())
    );
  });

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    if (!usuarioLogadoId) return;

    const conversasRef = collection(dbFirebase, "conversas");
    const q = query(
      conversasRef,
      where("participantes", "array-contains", usuarioLogadoId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((d) => {
        const dados = d.data();
        return {
          id: d.id,
          idAluguel: dados.idAluguel || "",
          nomeLocador: dados.nomeLocador || "Proprietário",
          nomeLocatario: dados.nomeLocatario || "Locatário",
          idLocador: dados.idLocador || "",
          idLocatario: dados.idLocatario || "",
          itemAcordo: dados.itemAcordo || "Produto",
          periodoAcordo: dados.periodoAcordo || "",
          ultimaMensagem: dados.ultimaMensagem || "",
          naoLidas: dados.naoLidas || {},
        } as Conversa;
      });
      setConversas(lista);

      const idParam = params?.get("id");
      const aluguelIdParam = params?.get("aluguelId");
      if (idParam) {
        const alvo = lista.find((c) => c.id === idParam);
        if (alvo) setConversaAtiva(alvo);
      } else if (aluguelIdParam) {
        const alvo = lista.find((c) => c.idAluguel === aluguelIdParam);
        if (alvo) setConversaAtiva(alvo);
      }
    });

    return () => unsubscribe();
  }, [usuarioLogadoId, params]);

  const abrirConversa = async (c: Conversa) => {
    setConversaAtiva(c);
    if (!usuarioLogadoId) return;
    const naoLidasCount = c.naoLidas?.[usuarioLogadoId] || 0;
    if (naoLidasCount > 0) {
      try {
        await updateDoc(doc(dbFirebase, "conversas", c.id), {
          [`naoLidas.${usuarioLogadoId}`]: 0,
        });
      } catch (err) {
        console.error("Erro ao resetar naoLidas:", err);
      }
    }
  };

  useEffect(() => {
    if (!conversaAtiva) return;
    const caminhoColecao = collection(
      dbFirebase,
      "conversas",
      conversaAtiva.id,
      "mensagens",
    );
    const consultaFiltrada = query(caminhoColecao, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(consultaFiltrada, (snapshot) => {
      const batch = writeBatch(dbFirebase);
      let possuiNaoLida = false;

      const lista = snapshot.docs.map((snapshotDoc) => {
        const dados = snapshotDoc.data();
        let horaFormatada = "";
        if (dados.timestamp) {
          horaFormatada = dados.timestamp.toDate().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        if (dados.remetenteId !== usuarioLogadoId && dados.lida === false) {
          const mRef = doc(
            dbFirebase,
            "conversas",
            conversaAtiva.id,
            "mensagens",
            snapshotDoc.id,
          );
          batch.update(mRef, { lida: true });
          possuiNaoLida = true;
        }

        return {
          id: snapshotDoc.id,
          texto: dados.texto,
          remetenteId: dados.remetenteId,
          timestamp: horaFormatada,
          lida: dados.lida,
        } as Mensagem;
      });

      if (possuiNaoLida) {
        batch.commit().catch((err) =>
          console.error("Erro ao marcar mensagens como lidas:", err),
        );
      }

      setMensagens(lista);
    });
    return () => unsubscribe();
  }, [conversaAtiva, usuarioLogadoId]);

  const onEnviarMensagemSubmit = async (data: ChatFormValues) => {
    if (!conversaAtiva || !data.mensagemTexto.trim() || !usuarioLogadoId)
      return;

    const textoParaEnviar = data.mensagemTexto.trim();
    reset({ ...data, mensagemTexto: "" });

    const outroUserId =
      conversaAtiva.idLocador === usuarioLogadoId
        ? conversaAtiva.idLocatario
        : conversaAtiva.idLocador;

    try {
      await addDoc(
        collection(dbFirebase, "conversas", conversaAtiva.id, "mensagens"),
        {
          texto: textoParaEnviar,
          remetenteId: usuarioLogadoId,
          timestamp: serverTimestamp(),
          lida: false,
        },
      );

      await updateDoc(doc(dbFirebase, "conversas", conversaAtiva.id), {
        ultimaMensagem: textoParaEnviar,
        ultimaMensagemAt: serverTimestamp(),
        [`naoLidas.${outroUserId}`]: increment(1),
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex bg-white font-sans text-[#1a1a1a] min-h-0">
      <aside className="w-80 border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 h-full">
        <div className="space-y-3 overflow-y-auto flex-1">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition text-sm font-medium mb-4"
          >
            <ChevronLeft size={18} /> Voltar
          </button>
          {conversasFiltradas.map((c) => {
            const nomeOutro =
              c.idLocador === usuarioLogadoId ? c.nomeLocatario : c.nomeLocador;
            const badge = c.naoLidas?.[usuarioLogadoId] || 0;
            return (
              <button
                key={c.id}
                onClick={() => abrirConversa(c)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  conversaAtiva?.id === c.id
                    ? "bg-gray-100 font-bold"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </div>
                <div className="truncate text-left flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{nomeOutro}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {c.ultimaMensagem || c.itemAcordo}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="relative mt-4 pt-2 border-t border-gray-100">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Controller
            name="buscaConversa"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Procurar conversa..."
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-gray-700"
              />
            )}
          />
        </div>
      </aside>

      <section className="flex-1 flex flex-col bg-white">
        {conversaAtiva ? (
          <>
            <div className="px-8 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <span className="font-bold text-gray-900 block">
                  {conversaAtiva.idLocador === usuarioLogadoId
                    ? conversaAtiva.nomeLocatario
                    : conversaAtiva.nomeLocador}
                </span>
                <span className="text-xs text-gray-400">
                  {conversaAtiva.periodoAcordo}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              <p className="text-center text-xs text-gray-300 font-semibold py-2">
                Acordo: {conversaAtiva.itemAcordo}
              </p>
              {mensagens.map((m) => {
                const ehMinha = m.remetenteId === usuarioLogadoId;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${ehMinha ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {!ehMinha && (
                        <div className="w-7 h-7 bg-gray-200 rounded-full shrink-0 mb-1" />
                      )}
                      <div
                        className={`rounded-[22px] px-5 py-3 text-sm ${ehMinha ? "bg-gray-200 rounded-tr-sm" : "bg-gray-100 rounded-tl-sm"}`}
                      >
                        {m.texto}
                      </div>
                    </div>
                    {m.timestamp && (
                      <span className="text-[10px] text-gray-300 font-bold mt-1 px-9">
                        {m.timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={mensagensEndRef} />
            </div>
            <form
              onSubmit={handleSubmit(onEnviarMensagemSubmit)}
              className="p-6 border-t border-gray-100 flex items-center gap-4"
            >
              <Controller
                name="mensagemTexto"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-[#f8f9fa] rounded-full px-6 py-3 text-sm outline-none"
                  />
                )}
              />
              <button
                type="submit"
                className="p-3 bg-gray-100 hover:bg-blue-600 rounded-full transition text-gray-500"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Selecione uma conversa.
          </div>
        )}
      </section>
    </div>
  );
}

export default function DashboardChatPage() {
  return (
    <Suspense>
      <DashboardChatContent />
    </Suspense>
  );
}
