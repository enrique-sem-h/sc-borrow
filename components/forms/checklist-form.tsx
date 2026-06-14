"use client";

import { useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Plus, X, ChevronLeft } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { z } from "zod";

export const checklistSchema = z.object({
  images: z.array(z.string()).min(1, {
    message: "Por favor, adicione pelo menos uma foto para comprovar a integridade.",
  }),
});

export type ChecklistFormData = z.infer<typeof checklistSchema>;

interface UserProfile {
  name: string;
  rating: string;
  role: "Dono" | "Locatário";
  location: string;
}

interface ProductInfo {
  name: string;
  dates: string;
  price: string;
  thumbnail: string;
}

interface ChecklistFormProps {
  titleDescription: string;
  buttonText: string;
  footerNotice?: string;
  user: UserProfile;
  product: ProductInfo;
  onSubmitAction: (data: ChecklistFormData) => void;
  onBack: () => void; 
}
export function ChecklistForm({
  titleDescription,
  buttonText,
  footerNotice,
  user,
  product,
  onSubmitAction,
  onBack, 
}: ChecklistFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
    defaultValues: { images: [] },
  });

  const currentImages = watch("images");

  const handleSlotClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      setValue("images", [...currentImages, fileUrl], { shouldValidate: true });
      event.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-12 relative transition-all">
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/png, image/jpeg" 
      />

      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 md:top-12 md:left-12 text-gray-400 hover:text-black transition p-1 rounded-full hover:bg-gray-50"
        aria-label="Voltar para a página anterior"
      >
        <ChevronLeft size={32} strokeWidth={1.5} />
      </button>

      <div className="text-center mb-10 pt-4 md:pt-0">
        <h2 className="text-3xl font-serif font-bold text-gray-950 mb-2">
          Checklist de integridade do item
        </h2>
        <p className="text-gray-500 text-sm md:text-base font-medium">{titleDescription}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitAction)} className="space-y-10">
        
        <div>
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            {[0, 1, 2].map((slotIndex) => {
              const imageSrc = currentImages[slotIndex];
              return (
                <div
                  key={slotIndex}
                  className="w-28 h-28 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-2xl relative flex items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition overflow-hidden shrink-0 group"
                >
                  {imageSrc ? (
                    <>
                      <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(slotIndex)}
                        className="absolute top-1.5 right-1.5 bg-black/80 text-white p-1 rounded-full hover:bg-black transition opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSlotClick}
                      className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition gap-1.5"
                    >
                      <Plus size={24} />
                      <span className="text-[10px] md:text-xs font-semibold">Add Foto</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {errors.images && (
            <p className="text-center text-sm text-red-500 font-semibold mt-4 animate-pulse">
              {errors.images.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-between bg-white h-32">
            <div className="flex gap-3">
              <div className="w-11 h-11 bg-gray-200 rounded-full shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {user.role}: {user.name} ({user.rating} ★, verificado)
                </h4>
                <p className="text-xs text-gray-400 mt-1 font-medium">{user.location}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/chats")}
              className="border border-gray-300 text-gray-700 text-xs py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition w-32 shadow-sm"
            >
              <MessageCircle size={14} />
              Abrir chat
            </button>
          </div>

          <div className="border border-gray-200/80 rounded-2xl p-4 flex gap-4 bg-white h-32 items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
              <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between h-20">
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {product.name}
                </h4>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{product.dates}</p>
              </div>
              <span className="text-sm font-bold text-gray-900">{product.price}</span>
            </div>
          </div>
        </div>

        <div className="text-center max-w-xl mx-auto pt-2 space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 text-base py-3.5 rounded-xl font-bold transition shadow-md"
          >
            {isSubmitting ? "A processar..." : buttonText}
          </button>

          {footerNotice && (
            <p className="text-xs text-gray-400 leading-relaxed text-left font-medium max-w-md mx-auto px-1">
              <strong>Aviso:</strong> {footerNotice}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}