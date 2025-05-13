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
        <div className={hidden ?"hidden" : "flex flex-col gap-2 md:w-1/4"}>
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type={type}
                {...register(name)} // Register the input with name directly
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                defaultValue={defaultValue}
                placeholder={placeholder}
                {...inputProps}
            />
            {error?.message && (
                <p className="text-xs text-red-400">{error.message}</p>
            )}
        </div>
    );
};

export default InputField;
