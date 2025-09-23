import { FieldError, UseFormRegister } from "react-hook-form";
import React from "react";

type InputFieldProps = {
  label: string;
  type?: string;
  register: UseFormRegister<any>;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
  value?: string;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue = "",
  error,
  hidden,
  inputProps,
  placeholder = "",
  value,
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 md:w-1/4"}>
      {/* Label */}
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>

      {/* Input */}
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`ring-[1.5px] p-2 rounded-md text-sm w-full
          ${error ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-blue-400"}
        `}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        {...inputProps}
      />

      {/* Error Message */}
      {error?.message && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
