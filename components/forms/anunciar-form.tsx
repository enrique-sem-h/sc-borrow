"use client";
import { errors } from "formidable";
import { UploadCloud, ImageIcon, CrossIcon, X } from "lucide-react";
import { DOMAttributes, ReactNode, useRef } from "react";
import { Control, Controller, UseFormReturn } from "react-hook-form";
import { FieldError } from "../ui/field";
import FormInput, {
  SelectFormInput,
  TextAreaFormInput,
} from "../ui/form-input";

const formatCurrency = (value: number | undefined): string => {
  if (!value) return "";
  return value.toFixed(2).replace(".", ",");
};

const parseCurrency = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: number) => void
) => {
  const digits = e.target.value.replace(/\D/g, "");
  onChange(digits ? parseInt(digits, 10) / 100 : 0);
};

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

type AnunciarFormProps = {
  onSubmit: (data: any) => void;
  formHook: UseFormReturn<any>;
  loading: boolean;
  edit?: boolean;
};

const AnunciarForm: React.FC<AnunciarFormProps> = ({
  formHook,
  onSubmit,
  loading,
  edit = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = formHook;

  return (
    <form className="flex flex-row" onSubmit={handleSubmit(onSubmit)}>
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
            <p className="text-lg font-medium text-gray-500">Upload de fotos</p>
            <p className="text-xs text-gray-300 mt-2">
              Clique para adicionar foto
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6 shrink-0  ">
            {[1, 2, 3, 4].map((i, index) => {
              let url: string | null = null;
              const file = (watch("fotos") || []).at(index);

              if (file) {
                if (file instanceof File) {
                  url = file ? URL.createObjectURL(file) : null;
                } else {
                  url = file.url;

                  if (!url?.startsWith("http") && !url?.startsWith("/")) {
                    url = `/${url}`;
                  }
                }
              }
              function onRemoveImageBtnClick(index: number): void {
                console.log("awdawd");

                const allFotos = formHook.watch("fotos");
                const newImages = [...allFotos];

                newImages.splice(index, 1);

                formHook.setValue("fotos", newImages);
              }

              return (
                <div
                  key={i}
                  className="aspect-square bg-[#f8f9fa] rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative  group transition-all duration-300"
                >
                  {!url && <ImageIcon size={20} className="text-gray-300" />}
                  {url && (
                    <>
                      <img src={url} className="w-full h-full object-cover" />
                      <button
                        className="absolute top-[1px] right-[1px] group-hover:visible invisible cursor-pointer"
                        type="button"
                        onClick={() => onRemoveImageBtnClick(index)}
                      >
                        <X className="" color="red" />
                      </button>
                    </>
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
          <FieldError>{errors.fotos && (errors.fotos?.message as string)}</FieldError>
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
                          <option value="Ferramentas">Ferramentas</option>
                          <option value="Camping">Camping</option>
                          <option value="Equipamentos de festa">Equipamentos de festa</option>
                          <option value="Lazer">Lazer</option>
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
                    render={({ field, fieldState }) => (
                      <FormInput
                        placeholder="0,00"
                        error={fieldState.error?.message}
                        value={formatCurrency(field.value)}
                        onChange={(e) => parseCurrency(e, field.onChange)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
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
                  render={({ field, fieldState }) => (
                    <FormInput
                      placeholder="0,00"
                      error={fieldState.error?.message}
                      value={formatCurrency(field.value)}
                      onChange={(e) => parseCurrency(e, field.onChange)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  )}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <p className="font-serif text-2xl font-bold mb-4">Ações finais</p>

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
  );
};

export default AnunciarForm;
