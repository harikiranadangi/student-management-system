import BulkGradeUpload from "@/components/BulkUpload/BulkGradeUpload";
import SampleCSVPreview from "@/components/SampleCSVPreview";

export default function ReportsPage() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4">Bulk Import</h1>
      <BulkGradeUpload />
      <div className="mt-10">
        <SampleCSVPreview type="grades" />

      </div>
    </div>
  );
}
