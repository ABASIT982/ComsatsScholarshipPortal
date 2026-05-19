'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Layers } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { TEMPLATE_OPTIONS } from '@/lib/form-templates';

type CustomField = {
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  max_value: number | null;
};

type Tier = {
  id: string;
  tier_name: string;
  min_score: number;
  max_score: number;
  award_description: string;
  award_amount: string;
};

export default function CreateScholarshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'active',
    student_types: ['undergraduate'],
    form_template: 'custom',
    custom_fields: [] as CustomField[],
    number_of_awards: 0
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([
    { type: 'number', label: 'FSC Marks', name: 'fsc_marks', required: true, placeholder: 'Enter FSC marks', max_value: 1100 },
    { type: 'number', label: 'Matric Marks', name: 'matric_marks', required: true, placeholder: 'Enter Matric marks', max_value: 1100 },
    { type: 'number', label: 'NTS Score', name: 'nts_score', required: true, placeholder: 'Enter NTS score', max_value: 100 },
  ]);

  // Scholarship Mode (Admin chooses)
  const [scholarshipMode, setScholarshipMode] = useState<'single' | 'tiered'>('single');

  // Tiers - Start empty, admin adds what they want
  const [tiers, setTiers] = useState<Tier[]>([]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!formData.title.trim() || !formData.description.trim() || !formData.deadline) {
    toast.error('Please fill all required fields', {
      duration: 3000,
      position: 'top-center',
      style: { background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '10px 16px' },
    });
    setLoading(false);
    return;
  }

  if (scholarshipMode === 'single' && (!formData.number_of_awards || formData.number_of_awards <= 0)) {
    toast.error('Number of awards required for single mode', {
      duration: 3000,
      position: 'top-center',
      style: { background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '10px 16px' },
    });
    setLoading(false);
    return;
  }

  if (scholarshipMode === 'tiered' && tiers.length === 0) {
    toast.error('Please add at least one tier', {
      duration: 3000,
      position: 'top-center',
      style: { background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '10px 16px' },
    });
    setLoading(false);
    return;
  }

  const deadlineDate = new Date(formData.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (deadlineDate < today) {
    toast.error('Deadline cannot be in the past', {
      duration: 3000,
      position: 'top-center',
      style: { background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '10px 16px' },
    });
    setLoading(false);
    return;
  }

  const currentTiers = [...tiers];
  
  const submissionData = {
    title: formData.title,
    description: formData.description,
    deadline: formData.deadline,
    status: formData.status,
    student_types: formData.student_types,
    form_template: formData.form_template,
    custom_fields: customFields,
    number_of_awards: scholarshipMode === 'single' ? formData.number_of_awards : 0,
    scholarship_mode: scholarshipMode,
    tiers: scholarshipMode === 'tiered' ? currentTiers : []
  };

  try {
    const response = await fetch('/api/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create scholarship');
    }

    toast.success(`${formData.title} created`, {
      duration: 3000,
      position: 'top-center',
      style: { background: '#dcfce7', color: '#166534', borderRadius: '8px', padding: '10px 16px' },
    });

    setTimeout(() => {
      router.push('/admin/scholarships');
    }, 1500);
    
  } catch (err: any) {
    toast.error(`Failed: ${err.message}`, {
      duration: 3000,
      position: 'top-center',
      style: { background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '10px 16px' },
    });
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentTypeChange = (studentType: string, checked: boolean) => {
    setFormData(prev => {
      const types = checked
        ? [...prev.student_types, studentType]
        : prev.student_types.filter(t => t !== studentType);
      if (types.length === 0) return prev;
      return { ...prev, student_types: types };
    });
  };

  const addCustomField = () => {
    setCustomFields(prev => [...prev, {
      type: 'number',
      label: '',
      name: '',
      required: false,
      placeholder: '',
      max_value: null
    }]);
  };

  const updateCustomField = (index: number, field: keyof CustomField, value: any) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'label') {
      updated[index].name = value.toLowerCase().replace(/\s+/g, '_');
    }
    setCustomFields(updated);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  // Tier functions - Admin has full control
  const addTier = () => {
    setTiers(prev => [...prev, {
      id: Date.now().toString(),
      tier_name: '',
      min_score: 0,
      max_score: 100,
      award_description: '',
      award_amount: ''
    }]);
  };

  const updateTier = (index: number, field: keyof Tier, value: any) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const removeTier = (index: number) => {
    setTiers(prev => prev.filter((_, i) => i !== index));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Toast Container */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
            },
          }}
        />

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Scholarship</h1>
            <p className="text-gray-600 mt-2">Add a new scholarship program for students</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scholarship Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., CAMS Merit Scholarship"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description & Details *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Include all details like eligibility criteria, benefits, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Student Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Types *</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.student_types.includes('undergraduate')}
                    onChange={(e) => handleStudentTypeChange('undergraduate', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Undergraduate Students</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.student_types.includes('graduate')}
                    onChange={(e) => handleStudentTypeChange('graduate', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Graduate Students</span>
                </label>
              </div>
            </div>

            {/* Scholarship Mode Selection - Admin Chooses */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Scholarship Award Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="scholarshipMode"
                    value="single"
                    checked={scholarshipMode === 'single'}
                    onChange={(e) => setScholarshipMode(e.target.value as 'single')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Single Scholarship</span>
                  <span className="text-xs text-gray-500 ml-2">All selected students get same award</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="scholarshipMode"
                    value="tiered"
                    checked={scholarshipMode === 'tiered'}
                    onChange={(e) => setScholarshipMode(e.target.value as 'tiered')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Tiered Scholarship</span>
                  <span className="text-xs text-gray-500 ml-2">Students get different awards based on score</span>
                </label>
              </div>
            </div>

            {/* Single Mode: Number of Awards */}
            {scholarshipMode === 'single' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Awards *</label>
                <input
                  type="number"
                  name="number_of_awards"
                  value={formData.number_of_awards}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="How many students will get this scholarship?"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Top N students will be selected</p>
              </div>
            )}

            {/* Tiered Mode: Admin Creates Tiers */}
            {scholarshipMode === 'tiered' && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Layers size={20} />
                    Scholarship Tiers
                  </h3>
                  <button
                    type="button"
                    onClick={addTier}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Tier
                  </button>
                </div>

                {tiers.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No tiers added yet. Click "Add Tier" to create scholarship categories.</p>
                    <p className="text-sm text-gray-400 mt-1">Example: Gold (90-100%), Silver (75-89%), Bronze (60-74%)</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tiers.map((tier, index) => (
                      <div key={tier.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tier Name</label>
                            <input
                              type="text"
                              value={tier.tier_name}
                              onChange={(e) => updateTier(index, 'tier_name', e.target.value)}
                              placeholder="e.g., CAT-A, Gold, President's"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Min Score (%)</label>
                            <input
                              type="number"
                              value={tier.min_score}
                              onChange={(e) => updateTier(index, 'min_score', parseFloat(e.target.value))}
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Max Score (%)</label>
                            <input
                              type="number"
                              value={tier.max_score}
                              onChange={(e) => updateTier(index, 'max_score', parseFloat(e.target.value))}
                              placeholder="100"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Award Description</label>
                            <input
                              type="text"
                              value={tier.award_description}
                              onChange={(e) => updateTier(index, 'award_description', e.target.value)}
                              placeholder="e.g., Tuition Fee Waiver"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Award Amount</label>
                            <input
                              type="text"
                              value={tier.award_amount}
                              onChange={(e) => updateTier(index, 'award_amount', e.target.value)}
                              placeholder="e.g., 75% or Rs.40,000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTier(index)}
                          className="mt-3 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Remove Tier
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-3">
                  Students will be automatically assigned to the tier matching their calculated percentage score.
                  Make sure score ranges don't overlap.
                </p>
              </div>
            )}

            {/* Form Template Selection */}
            <div>
              <label htmlFor="form_template" className="block text-sm font-medium text-gray-700 mb-2">Application Form Type *</label>
              <select
                id="form_template"
                name="form_template"
                value={formData.form_template}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                {TEMPLATE_OPTIONS.map(template => (
                  <option key={template.value} value={template.value}>{template.label}</option>
                ))}
              </select>
            </div>

            {/* Custom Fields Builder */}
            {formData.form_template === 'custom' && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Custom Form Fields</h3>
                  <button type="button" onClick={addCustomField} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Add Field</button>
                </div>

                {customFields.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No custom fields added yet. Click "Add Field" to start building your form.</p>
                ) : (
                  <div className="space-y-4">
                    {customFields.map((field, index) => (
                      <div key={index} className="flex flex-wrap gap-4 p-4 border border-gray-200 rounded-lg">
                        <select value={field.type} onChange={(e) => updateCustomField(index, 'type', e.target.value)} className="px-3 py-2 border rounded">
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="textarea">Text Area</option>
                          <option value="file">File Upload</option>
                        </select>
                        <input type="text" placeholder="Field Label" value={field.label} onChange={(e) => updateCustomField(index, 'label', e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                        <input type="text" placeholder="Placeholder" value={field.placeholder} onChange={(e) => updateCustomField(index, 'placeholder', e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                        {field.type === 'number' && (
                          <input type="number" placeholder="Max Value" value={field.max_value || ''} onChange={(e) => updateCustomField(index, 'max_value', parseFloat(e.target.value))} className="w-32 px-3 py-2 border rounded" />
                        )}
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={field.required} onChange={(e) => updateCustomField(index, 'required', e.target.checked)} />
                          <span>Required</span>
                        </label>
                        <button type="button" onClick={() => removeCustomField(index)} className="bg-red-600 text-white px-3 py-2 rounded">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Deadline & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} min={today} className="w-full px-4 py-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
              <button type="button" onClick={() => router.back()} className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                <Save size={20} />
                {loading ? 'Creating...' : 'Create Scholarship'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}