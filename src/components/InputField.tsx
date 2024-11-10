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
  return <div className="container">Content</div>
  
};

export default InputField;