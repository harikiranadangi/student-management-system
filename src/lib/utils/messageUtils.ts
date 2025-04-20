    // messageUtils.ts

import { MessageType } from "../../../types";

type Student = {
  name: string;
  grade: string;
};

export function getMessageContent(type: MessageType, student: Student): string {
  const { name, grade } = student;

  switch (type) {
    case "ABSENT":
      return `INFO: Dear Parent, your ward ${name} (${grade}) is absent for the day. Please ensure regular attendance. - KOTAK SALESIAN SCHOOL`;
    case "FEE_RELATED":
      return `INFO: Dear Parent, ${name}'s fee is due. Kindly make the payment at the earliest to avoid inconvenience. - KOTAK SALESIAN SCHOOL`;
    case "ANNOUNCEMENT":
      return `INFO: Dear Parent, ${name}'s class will be closed tomorrow due to a holiday. - KOTAK SALESIAN SCHOOL`;
    case "GENERAL":
      return `INFO: Dear Parent, please note the important announcement regarding ${name}'s class. - KOTAK SALESIAN SCHOOL`;
    default:
      return `INFO: Dear Parent, a new announcement has been made regarding ${name}. Please check the details. - KOTAK SALESIAN SCHOOL`;
  }
}
