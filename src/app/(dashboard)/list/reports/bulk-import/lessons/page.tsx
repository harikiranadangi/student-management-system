import BulkLessonsUpload from "@/components/BulkUpload/lessons";
import SampleCSVPreview from "@/components/SampleCSVPreview";

export default function ReportsPage() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4">Bulk Import</h1>
      <BulkLessonsUpload />
      <div className="mt-10">
        <SampleCSVPreview type="lessons" />
      </div>
    </div>
  );
}
