import MeritListTable from '@/components/merit/MeritListTable';

export default function MeritListsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Merit Lists</h1>
        <p className="text-gray-600 mt-2">View and manage all generated merit lists</p>
      </div>
      <MeritListTable />
    </div>
  );
}