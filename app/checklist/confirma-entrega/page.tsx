"use client";

import { useState } from "react";
import { ChecklistForm, ChecklistFormData } from "@/components/forms/checklist-form";
import { SuccessFeedbackModal } from "@/components/ui/success-feedback";

export default function ConfirmaEntregaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (data: ChecklistFormData) => {
    setIsModalOpen(true);
    console.log("Fotos enviadas:", data.images);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <ChecklistForm
        titleDescription="Por favor, confirme o recebimento e integridade da Furadeira Tramontina"
        buttonText="Confirmar recebimento do produto"
        user={{ name: "Fulano", rating: "5,0", role: "Dono", location: "Localização: Santa Maria, DF" }}
        product={{
          name: "Furadeira Tramontina",
          dates: "12 - 14 Abr",
          price: "R$ 105",
          thumbnail: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400"
        }}
        onSubmitAction={handleFormSubmit}
      />

      <SuccessFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Entrega confirmada com sucesso!"
      />
    </div>
  );
}