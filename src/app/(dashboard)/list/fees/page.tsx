import Link from "next/link";

export default function FeesDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Fees Management</h1>
      <p>Manage all fee-related tasks from here.</p>

      <div className="mt-4 space-y-2">
        <Link href="/list/fees/collect" className="block text-blue-600 underline">💰 Fee Collection</Link>
        <Link href="/list/fees/ledger" className="block text-blue-600 underline">📖 Fee Ledger</Link>
        <Link href="/list/fees/feemanagement" className="block text-blue-600 underline">📜 Fee Management</Link>
        <Link href="/list/fees/daywisecollection" className="block text-blue-600 underline">📂 Payment History</Link>
      </div>
    </div>
  );
}
