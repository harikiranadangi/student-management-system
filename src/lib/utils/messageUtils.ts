import { MessageType } from "../../../types";

type Student = {
  name: string;
  className: string;
  amount?: number;
  term?: string;
};

export function getMessageContent(type: MessageType, student: Student): string {
  const { name, className, amount, term } = student;

  switch (type) {
    case "ABSENT":
      return `Dear Parent, we regret to inform you that ${name} (${className}) was absent from school today. We kindly request you to ensure their regular attendance for better academic progress. - KOTAK SALESIAN SCHOOL`;

    case "FEE_RELATED":
      return `Dear Parent, this is a reminder that the fee payment for ${name} (${className}) is due for ${term}. Please arrange the payment of ₹${amount ?? ""} at your earliest convenience to avoid any disruptions in their education. - KOTAK SALESIAN SCHOOL`;

    case "FEE_COLLECTION":
      return `Dear Parent, the fee for ${name} (${className}) has been successfully collected for ${term}. Amount received: ₹${amount ?? ""}. Thank you for your cooperation. - KOTAK SALESIAN SCHOOL`;

    case "ANNOUNCEMENT":
      return `Dear Parent, we would like to inform you that ${name} (${className})'s class will be closed tomorrow due to a holiday. We hope your ward enjoys the break. - KOTAK SALESIAN SCHOOL`;

    case "GENERAL":
      return `Dear Parent, please take note of the important announcement regarding ${name}'s (${className}) class. We encourage you to stay updated. - KOTAK SALESIAN SCHOOL`;

    default:
      return `Dear Parent, a new announcement has been made regarding ${name} (${className}). Please check the details at your earliest convenience. - KOTAK SALESIAN SCHOOL`;
  }
}
