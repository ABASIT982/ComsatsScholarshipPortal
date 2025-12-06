import CriteriaBuilder from '@/components/merit/CriteriaBuilder';

export default function CriteriaPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Merit Criteria Configuration</h1>
        <p className="text-gray-600 mt-2">Define how merit scores are calculated for scholarship allocation</p>
      </div>
      <CriteriaBuilder />
    </div>
  );
}