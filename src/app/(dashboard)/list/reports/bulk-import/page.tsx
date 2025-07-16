import UploadStudentsPage from "@/components/BulkUploadStudents";
import SampleCSVPreview from "@/components/SampleCSVPreview";

export default function ReportsPage() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4">Bulk Import</h1>
      <UploadStudentsPage />
      <div className="mt-10">
        <SampleCSVPreview />
      </div>
    </div>
  );
}
