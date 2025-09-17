"use client";

import { useSearchParams } from "next/navigation";
import ClassTimetableContainer from "./ClassTimetableContainer";

interface Props {
  classes: { id: number }[];
}

const AdminTimetable = ({ classes }: Props) => {
  const searchParams = useSearchParams();
  const selectedClassId = Number(searchParams.get("classId")) || classes[0]?.id || 1;

  return <ClassTimetableContainer classId={selectedClassId} />;
};

export default AdminTimetable;
