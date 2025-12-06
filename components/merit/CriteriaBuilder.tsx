'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface Criteria {
  id: number;
  name: string;
  weight: number;
  maxScore: number;
  type: 'percentage' | 'scale' | 'boolean';
}

export default function CriteriaBuilder() {
  const [criteria, setCriteria] = useState<Criteria[]>([
    { id: 1, name: 'Academic Score', weight: 40, maxScore: 100, type: 'percentage' },
    { id: 2, name: 'Entrance Exam', weight: 30, maxScore: 100, type: 'percentage' },
    { id: 3, name: 'Financial Need', weight: 15, maxScore: 10, type: 'scale' },
    { id: 4, name: 'Interview Score', weight: 10, maxScore: 10, type: 'scale' },
    { id: 5, name: 'Document Verified', weight: 5, maxScore: 1, type: 'boolean' },
  ]);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const addCriterion = () => {
    const newCriterion: Criteria = {
      id: Date.now(),
      name: 'New Criteria',
      weight: 0,
      maxScore: 100,
      type: 'percentage',
    };
    setCriteria([...criteria, newCriterion]);
  };

  const removeCriterion = (id: number) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriterion = (id: number, field: keyof Criteria, value: any) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const saveCriteria = () => {
    // API call would go here
    alert('Criteria saved successfully!');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Merit Criteria</h2>
          <p className="text-gray-600">Define how merit scores are calculated</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addCriterion}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Criteria
          </button>
          <button
            onClick={saveCriteria}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Save size={20} />
            Save Criteria
          </button>
        </div>
      </div>

      {/* Weight Summary */}
      <div className={`mb-6 p-4 rounded-lg ${totalWeight === 100 ? 'bg-green-50' : 'bg-yellow-50'} border ${totalWeight === 100 ? 'border-green-200' : 'border-yellow-200'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${totalWeight === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="font-semibold">
              Total Weight: {totalWeight}%
              {totalWeight !== 100 && ' (Must equal 100%)'}
            </span>
          </div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${totalWeight === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min(totalWeight, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-4">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={criterion.name}
                  onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                />
                <div className="flex gap-4 mt-2">
                  <select
                    value={criterion.type}
                    onChange={(e) => updateCriterion(criterion.id, 'type', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="percentage">Percentage (0-100)</option>
                    <option value="scale">Scale (1-10)</option>
                    <option value="boolean">Boolean (Yes/No)</option>
                  </select>
                  <div className="text-sm text-gray-600">
                    Max Score: 
                    <input
                      type="number"
                      value={criterion.maxScore}
                      onChange={(e) => updateCriterion(criterion.id, 'maxScore', parseInt(e.target.value))}
                      className="ml-2 w-16 border rounded px-2 py-1"
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeCriterion(criterion.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Weight Slider */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium">Weight: {criterion.weight}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={criterion.weight}
                onChange={(e) => updateCriterion(criterion.id, 'weight', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}