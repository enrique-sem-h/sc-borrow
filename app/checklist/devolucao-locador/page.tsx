"use client";

import { useState } from "react";
import { ChecklistForm, ChecklistFormData } from "@/components/forms/checklist-form";
import { SuccessFeedbackModal } from "@/components/ui/success-feedback";

export default function DevolucaoLocadorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (data: ChecklistFormData) => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <ChecklistForm
        titleDescription="Por favor, confirme o estado do item antes de entregar ao dono"
        buttonText="Enviar solicitação de devolução"
        footerNotice="Após confirmação de devolução do locador, o valor do caução será reprocessado e devolvido à sua carteira em até 24h"
        user={{ name: "Fulano", rating: "5,0", role: "Dono", location: "Localização: Santa Maria, DF" }}
        product={{
          name: "Prancha de surf",
          dates: "12 - 14 Abr",
          price: "R$ 50",
          thumbnail: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400"
        }}
        onSubmitAction={handleFormSubmit}
      />

      <SuccessFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Solicitação de devolução enviada com sucesso!"
      />
    </div>
  );
}