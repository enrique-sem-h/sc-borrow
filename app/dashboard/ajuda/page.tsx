"use client";
import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

type DashboardAjudaPageProps = {
  children: ReactNode;
};

const faqs = [
  {
    question: "Como fazer um bom anúncio?",
    answer:
      "Capriche nas fotos: use boa iluminação e mostre o item de vários ângulos. Descreva o estado de conservação com honestidade, informe as dimensões quando relevante e defina um preço justo consultando itens semelhantes na plataforma. Quanto mais completo o anúncio, maior a chance de aluguel.",
  },
  {
    question: "Como evitar fraudes na hora de alugar um item?",
    answer:
      "Sempre realize a negociação e o pagamento dentro da plataforma. Nunca transfira dinheiro diretamente para o locador antes de confirmar o aluguel pelo sistema. Verifique o perfil e as avaliações do usuário antes de fechar negócio e prefira combinações em locais públicos para a entrega.",
  },
  {
    question: "Quais são as melhores formas de combinar uma retirada?",
    answer:
      "Use o chat interno da plataforma para alinhar dia, horário e local. Prefira locais públicos e movimentados como shopping centers, estações de metrô ou agências dos Correios. Confirme os detalhes pelo menos 24 horas antes para evitar imprevistos.",
  },
  {
    question: "Como posso testar o produto em locais públicos?",
    answer:
      "Na entrega, peça ao locador para demonstrar o funcionamento do item na hora. Verifique visualmente por danos, riscos ou peças faltando e teste as funcionalidades principais antes de assinar o checklist de recebimento. Caso haja divergência em relação ao anúncio, você pode cancelar o aluguel sem custo.",
  },
  {
    question: "O que acontece se o item for devolvido com danos?",
    answer:
      "Ao devolver o item, ambas as partes preenchem o checklist de devolução. Caso seja identificado um dano causado durante o aluguel, o locatário é responsável pelo ressarcimento combinado entre as partes. Recomendamos registrar o estado do item com fotos tanto na entrega quanto na devolução.",
  },
  {
    question: "Como funciona o cancelamento de um aluguel?",
    answer:
      "Você pode cancelar um aluguel antes do início do período combinado sem nenhum custo. Após o início do aluguel, o cancelamento pode estar sujeito a taxas dependendo do tempo decorrido. Para cancelar, acesse 'Meus aluguéis', selecione o aluguel desejado e clique em 'Cancelar aluguel'.",
  },
];

const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-100 hover:bg-gray-200 transition text-left text-sm font-medium text-gray-800"
      >
        <span>{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed bg-white">
          {answer}
        </div>
      )}
    </div>
  );
};

const DashboardAjudaPage: React.FC<DashboardAjudaPageProps> = ({
  children,
}) => {
  return (
    <>
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
        Atendimento ao cliente
      </h1>
      <div className="border-t border-gray-300 mb-8" />

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">FAQ</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <FaqItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardAjudaPage;
