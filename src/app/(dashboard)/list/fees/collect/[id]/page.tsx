import CollectFeesForm from "@/components/forms/FeeCollectionForm";

const CollectFeesPage = async ({ params }: { params: { id: string } }) => {
  const studentId = params.id; // ✅ No need to await `params.id`
  
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Fee Collection</h1>
      <CollectFeesForm id={studentId} />
    </div>
  );
};

export default CollectFeesPage;
