import FormModal from "./FormModal";

export type FormContainerProps = {
    table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
  }

const FormContainer = ({
    table,
    type,
    data,
    id,
  }: FormContainerProps ) => {
  return (
    <div className="container"><FormModal table={table} type={type} data={data} id={id}/>
    
    </div>
  );
};

export default FormContainer;