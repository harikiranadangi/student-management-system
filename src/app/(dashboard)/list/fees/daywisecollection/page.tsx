import DailyCollectionReport from "@/components/DailyCollectionReport";

export default function FeeTransactionsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fee Transactions</h1>
      <DailyCollectionReport />
    </div>
  );
}
