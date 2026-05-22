import { ComponentProps, InputHTMLAttributes, ReactNode } from "react";
import { Input } from "./input";
import { Field, FieldError } from "./field";
import { cn } from "@/lib/utils";

type FormInputProps = ComponentProps<typeof Input> & {
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

export default FormInput;
