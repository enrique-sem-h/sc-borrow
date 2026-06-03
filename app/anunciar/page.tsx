"use client";
import { FieldError } from "@/components/ui/field";
import FormInput, {
  SelectFormInput,
  TextAreaFormInput,
} from "@/components/ui/form-input";
import { AnuncioInsert } from "@/infra/database/schemas/anunciosSchema";
import { UsuarioInsert } from "@/infra/database/schemas/usuariosSchema";
import { insertAnuncioSchema } from "@/modules/zod/schemas/anunciosSchemas";
import { insertUserSchema } from "@/modules/zod/schemas/usuarioSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  UploadCloud,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormType = AnuncioInsert & {
  fotos: Array<File>;
};

const schema = insertAnuncioSchema;

export default function CriarAnuncioPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fotos: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onFormSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    console.log(formData.entries().toArray());
  };

  return (
    <main className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans text-[#1a1a1a]">
      <header className="px-12 py-6 flex items-center gap-6 shrink-0">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-100 p-2 rounded-full transition-all"
        >
          <ChevronLeft size={32} strokeWidth={2.5} className="text-gray-800" />
        </button>

        <h2 className="text-4xl font-serif font-bold tracking-tight">
          Criar anúncio
        </h2>
      </header>
      <form className="flex flex-row" onSubmit={handleSubmit(onFormSubmit)}>
        <Controller
          name="fotos"
          control={control}
          render={({ field, fieldState }) => {
            const { value, ...fieldRest } = field;
            const currentFiles = Array.isArray(value) ? value : [];
            return (
              <input
                // ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                files
                //
                {...fieldRest}
                ref={(element) => {
                  fieldRest.ref(element);
                  fileInputRef.current = element;
                }}
                value=""
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const fileArray = Array.from(files);
                    const allFiles = [...currentFiles, ...fileArray];
                    field.onChange(allFiles);
                  }
                }}
              />
            );
          }}
        />
        <div className="flex-1 flex flex-row gap-10 px-12 pb-8 min-h-0 max-w-[1600px] mx-auto w-full items-stretch">
          <section className="w-[340px] xl:w-[380px] flex flex-col shrink-0 self-start">
            <h3 className="text-lg font-serif mb-4 text-gray-800 ml-1">
              Galeria de fotos
            </h3>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-[420px] bg-white rounded-[40px] shadow-xl shadow-gray-100 border border-gray-100 flex flex-col items-center justify-center mb-6 transition-all hover:bg-gray-50 cursor-pointer"
            >
              <UploadCloud
                size={48}
                className="text-gray-300 mb-4"
                strokeWidth={1}
              />
              <p className="text-lg font-medium text-gray-500">
                Upload de fotos
              </p>
              <p className="text-xs text-gray-300 mt-2">
                Clique para adicionar foto
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6 shrink-0  ">
              {[1, 2, 3, 4].map((i, index) => {
                const file = (watch("fotos") || []).at(index);
                const url = file ? URL.createObjectURL(file) : null;
                return (
                  <div
                    key={i}
                    className="aspect-square bg-[#f8f9fa] rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden"
                  >
                    {!url && <ImageIcon size={20} className="text-gray-300" />}
                    {url && (
                      <img src={url} className="w-full h-full object-cover" />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-2xl border border-gray-300 text-lg font-serif font-medium hover:bg-gray-50 transition-all text-gray-700"
            >
              Adicionar fotos
            </button>
            <FieldError>{errors.fotos && errors.fotos?.message}</FieldError>
          </section>

          <section className="flex-[2.5] bg-[#fcfcfc] rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/40 flex flex-col min-h-0 self-start max-h-[82vh]">
            <div className="px-12 pt-8 pb-4 shrink-0">
              <h3 className="text-2xl font-serif text-gray-900 font-bold">
                Informações básicas
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto px-12 pb-10 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <Label text="Título do anúncio" required />
                  <Controller
                    name="titulo"
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <FormInput
                          placeholder="Ex: Furadeira de Impacto Bosch"
                          error={fieldState.error?.message}
                          {...field}
                        />
                      );
                    }}
                  />
                </div>

                <div className="col-span-4">
                  <Label text="Categoria" required />
                  <div className="relative">
                    <Controller
                      name="categoria"
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <SelectFormInput
                            error={fieldState.error?.message}
                            {...field}
                          >
                            <option value="">Selecione...</option>
                            <option value="Moda e Acessórios">
                              Moda e Acessórios
                            </option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Beleza e Cuidados">
                              Beleza e Cuidados
                            </option>
                            <option value="Casa e decoração">
                              Casa e decoração
                            </option>
                            <option value="Animais e Acessórios">
                              Animais e Acessórios
                            </option>
                          </SelectFormInput>
                        );
                      }}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label text="Descrição detalhada" required />
                <Controller
                  name="descricao"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <TextAreaFormInput
                        error={fieldState.error?.message}
                        placeholder="Conte detalhes sobre o produto, voltagem, acessórios inclusos..."
                        {...field}
                      />
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label text="Preço diário" required />
                  <div className="relative">
                    <Controller
                      name="valorDiario"
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <FormInput
                            placeholder="0,00"
                            error={fieldState.error?.message}
                            {...field}
                            type="number"
                            min={0}
                          />
                        );
                      }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs italic font-sans">
                      / dia *
                    </span>
                  </div>
                </div>

                <div>
                  <Label text="Depósito de caução" required />
                  <Controller
                    name="caucao"
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <FormInput
                          placeholder="0,00"
                          error={fieldState.error?.message}
                          {...field}
                          type="number"
                          min={0}
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <p className="font-serif text-2xl font-bold mb-4">
                  Ações finais
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl border-2 border-blue-400 text-blue-600 font-serif text-xl font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all bg-white shadow-lg shadow-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Publicando..." : "Salvar anúncio"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </form>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-[36px] p-10 shadow-2xl border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check size={38} className="text-green-600" strokeWidth={3} />
            </div>

            <h3 className="text-3xl font-serif font-bold text-center text-gray-900 mb-3">
              Anúncio salvo!
            </h3>

            <p className="text-center text-gray-500 leading-relaxed mb-8">
              Seu anúncio foi publicado com sucesso.
            </p>

            <div className="flex gap-4">
              <button className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                Fechar
              </button>

              <button
                onClick={() => router.push("/Meusanuncios")}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium"
              >
                Ir para Meus anúncios
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </main>
  );
}

function Label({
  text,
  required,
  optional,
}: {
  text: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="block text-gray-700 text-sm font-serif font-semibold mb-1.5 ml-1">
      {text}
      {required && <span className="text-red-500 ml-1 font-sans">*</span>}
      {optional && (
        <span className="text-gray-400 text-[10px] ml-2 font-sans italic font-normal">
          (opcional)
        </span>
      )}
    </label>
  );
}

function Input({ ...props }) {
  return (
    <input
      type="text"
      {...props}
      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all placeholder:text-gray-300"
    />
  );
}
