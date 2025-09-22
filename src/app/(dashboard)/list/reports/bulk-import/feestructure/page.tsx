import BulkFeeStructureUpload from "@/components/BulkUpload/feestructure";
import SampleCSVPreview from "@/components/SampleCSVPreview";

export default function ReportsPage() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4">Bulk Import</h1>
      <BulkFeeStructureUpload />
      <div className="mt-10">
        <SampleCSVPreview type="feestructure" />

      </div>
    </div>
  );
}
