import { FieldError } from "react-hook-form";

type InputFieldProps ={
    label:string;
    type?:any;
    register:string;
    name:string;
    defaultValue:string;
    error:FieldError;
    inputProps:React.InputHTMLAttributes<HTMLInputElement>;
}

const InputField = ({
    label,
    type = 'text',
    register,
    name,
    defaultValue,
    error,
    inputProps
}: InputFieldProps) => {
  return (
    <div className='flex flex-col gap-2 md:w-1/4'>
        <label className="text-xs text-gray-500">Username</label>
        <input type="text" {...register("username")} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
        {errors.username?.message && <p className="text-xs text-red-400">{errors.name?.message?.toString()}</p>}
        </div>
  );
  
};

export default InputField;