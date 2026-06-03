import { ComponentProps, InputHTMLAttributes, ReactNode } from "react";
import { Input } from "./input";
import { Field, FieldError } from "./field";
import { cn } from "@/lib/utils";

type FormInputProps = ComponentProps<typeof Input> & {
  className?: string;
  error?: string | null;
};

type FormTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  error?: string | null;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
  error?: string | null;
};

const FormInput: React.FC<FormInputProps> = ({
  className,
  children,
  error,
  ...props
}) => {
  return (
    <>
      <Field className={cn(className)}>
        <Input {...props} />
        {!!error && <FieldError>{error}</FieldError>}
      </Field>
    </>
  );
};

export const TextAreaFormInput: React.FC<FormTextAreaProps> = ({
  error,
  ...props
}) => {
  return (
    <Field>
      <textarea
        className="w-full bg-white border border-gray-200 rounded-2xl p-4 h-28 resize-none text-sm outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all placeholder:text-gray-300"
        {...props}
      />
      {!!error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

export const SelectFormInput: React.FC<SelectProps> = ({
  error,
  children,
  ...props
}) => {
  return (
    <Field>
      <select
        className="w-full bg-white border border-gray-200 rounded-xl p-3 appearance-none outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all text-gray-600 text-sm"
        {...props}
      >
        {children}
      </select>
      {!!error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

export default FormInput;
