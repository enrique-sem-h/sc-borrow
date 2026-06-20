"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

import { PagamentoSucessoModal } from "@/components/ui/payment-success";

interface CheckoutFormProps {
  itemNome: string;
  valorTotal: string;
}

export default function CheckoutForm({
  itemNome,
  valorTotal,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const expectedPaymentStatus = ["succeeded", "processing"];

  const [isLoading, setIsLoading] = useState(false);
  const [aluguelId, setAluguelId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success",
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {},
      },
      redirect: "if_required",
    });

    if (error) {
      setModalStatus("error");
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    if (paymentIntent && expectedPaymentStatus.includes(paymentIntent.status)) {
      try {
        const token = localStorage.getItem("token") ?? "";
        const resp = await fetch("/api/checkout/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        const result = await resp.json();
        if (result.aluguelId) {
          setAluguelId(result.aluguelId);
        }
      } catch (err) {
        console.error("Erro ao finalizar aluguel:", err);
      }
      setModalStatus("success");
      setIsModalOpen(true);
    } else {
      setModalStatus("error");
      setIsModalOpen(true);
    }

    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalStatus === "success") {
      router.push(
        aluguelId
          ? `/dashboard/chat?aluguelId=${aluguelId}`
          : "/dashboard/meus-alugueis",
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <PaymentElement />

        <button
          className="w-full py-4 bg-green-300 hover:bg-green-400 transition rounded-xl font-serif text-lg font-bold text-gray-800"
          disabled={isLoading || !stripe || !elements}
          style={{ marginTop: "20px" }}
        >
          {isLoading ? "Processando..." : "Pagar Agora"}
        </button>
      </form>

      <PagamentoSucessoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        status={modalStatus}
        itemNome={itemNome}
        valorTotal={valorTotal}
      />
    </>
  );
}
