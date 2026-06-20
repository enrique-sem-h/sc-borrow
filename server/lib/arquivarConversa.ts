import { dbFirebase } from "@/infra/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

export async function arquivarConversasPorAnuncio(idAnuncio: string, motivo: string) {
  const conversasRef = collection(dbFirebase, "conversas");
  const snap = await getDocs(query(conversasRef, where("idAnuncio", "==", idAnuncio)));

  await Promise.all(
    snap.docs.map(async (d) => {
      await updateDoc(doc(dbFirebase, "conversas", d.id), {
        arquivada: true,
        arquivadaEm: serverTimestamp(),
      });
      await addDoc(collection(dbFirebase, "conversas", d.id, "mensagens"), {
        texto: motivo,
        remetenteId: "sistema",
        tipo: "sistema",
        timestamp: serverTimestamp(),
        lida: false,
      });
    }),
  );
}

export async function arquivarConversaPorAluguel(idAluguel: string, motivo: string) {
  const conversasRef = collection(dbFirebase, "conversas");
  const snap = await getDocs(query(conversasRef, where("idAluguel", "==", idAluguel)));

  await Promise.all(
    snap.docs.map(async (d) => {
      await updateDoc(doc(dbFirebase, "conversas", d.id), {
        arquivada: true,
        arquivadaEm: serverTimestamp(),
      });
      await addDoc(collection(dbFirebase, "conversas", d.id, "mensagens"), {
        texto: motivo,
        remetenteId: "sistema",
        tipo: "sistema",
        timestamp: serverTimestamp(),
        lida: false,
      });
    }),
  );
}
