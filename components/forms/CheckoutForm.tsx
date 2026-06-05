import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message!);
      } else {
        setMessage("Ocorreu um erro inesperado.");
      }
      return;
    }

    if (paymentIntent.status === "succeeded") {
      
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      {/* O Payment Element renderiza automaticamente campos de cartão, PIX, etc., baseado na sua conta Stripe */}
      <PaymentElement />

      <button
        className="w-full py-4 bg-green-300 hover:bg-green-400 transition rounded-xl font-serif text-lg font-bold text-gray-800"
        disabled={isLoading || !stripe || !elements}
        style={{ marginTop: "20px" }}
      >
        {isLoading ? "Processando..." : "Pagar Agora"}
      </button>

      {message && (
        <div style={{ color: "red", marginTop: "15px" }}>{message}</div>
      )}
    </form>
  );
}
