"use client";

import { useState } from "react";
import { ChecklistForm, ChecklistFormData } from "@/components/forms/checklist-form";
import { SuccessFeedbackModal } from "@/components/ui/success-feedback";

export default function ConfirmaDevolucaoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (data: ChecklistFormData) => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <ChecklistForm
        titleDescription="Por favor, confirme o recebimento e integridade da Furadeira Tramontina"
        buttonText="Confirmar recebimento e finalizar devolução"
        footerNotice="Ao confirmar, o caução do locatário será reprocessado e os fundos da locação liberados"
        user={{ name: "Zé", rating: "4,8", role: "Locatário", location: "Localização: Santa Maria, DF" }}
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
        message="Devolução confirmada com sucesso!"
      />
    </div>
  );
}