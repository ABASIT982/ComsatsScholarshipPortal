'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Award, Layers } from 'lucide-react';
import { TEMPLATE_OPTIONS } from '@/lib/form-templates';

type CustomField = {
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  max_value: number | null;
};

type ScoringCriterion = {
  id: string;
  fieldName: string;
  fieldLabel: string;
  weight: number;
  maxValue?: number;
};

type Tier = {
  id: string;
  tier_name: string;
  min_score: number;
  max_score: number;
  award_description: string;
  award_amount: string;
};

export default function EditScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'criteria' | 'tiers'>('details');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'active',
    student_types: ['undergraduate'],
    form_template: 'basic',
    custom_fields: [] as CustomField[],
    number_of_awards: 0,
    scholarship_mode: 'single'  // NEW
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [scoringCriteria, setScoringCriteria] = useState<ScoringCriterion[]>([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [tiers, setTiers] = useState<Tier[]>([]);  // NEW

  // Fetch scholarship data on component mount
  useEffect(() => {
    fetchScholarship();
  }, [scholarshipId]);

  // Calculate total weight whenever criteria changes
  useEffect(() => {
    const total = scoringCriteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    setTotalWeight(total);
  }, [scoringCriteria]);

  const fetchScholarship = async () => {
    try {
      console.log('🔄 Fetching scholarship for edit:', scholarshipId);
      
      const response = await fetch(`/api/scholarships/${scholarshipId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scholarship');
      }

      if (data.scholarship) {
        console.log('✅ Scholarship data loaded:', data.scholarship);
        
        setFormData({
          title: data.scholarship.title,
          description: data.scholarship.description,
          deadline: data.scholarship.deadline.split('T')[0],
          status: data.scholarship.status,
          student_types: data.scholarship.student_types || ['undergraduate'],
          form_template: data.scholarship.form_template || 'basic',
          custom_fields: data.scholarship.custom_fields || [],
          number_of_awards: data.scholarship.number_of_awards || 0,
          scholarship_mode: data.scholarship.scholarship_mode || 'single'  // NEW
        });

        // Set custom fields if they exist
        if (data.scholarship.custom_fields) {
          setCustomFields(data.scholarship.custom_fields);
        }

        // Set scoring criteria if it exists
        if (data.scholarship.scoring_criteria) {
          setScoringCriteria(data.scholarship.scoring_criteria);
        }

        // NEW: Set tiers if they exist
        if (data.scholarship.tiers && data.scholarship.tiers.length > 0) {
          setTiers(data.scholarship.tiers);
        }
      }
    } catch (err: any) {
      console.error('❌ Error fetching scholarship:', err);
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Basic validation
  if (!formData.title.trim() || !formData.description.trim() || !formData.deadline) {
    setError('Please fill in all required fields');
    setLoading(false);
    return;
  }

  // ✅ FIX: Only validate scoring criteria if on criteria tab
  if (activeTab === 'criteria') {
    if (scoringCriteria.length === 0) {
      setError('Please add at least one scoring criterion');
      setLoading(false);
      return;
    }
    if (totalWeight !== 100) {
      setError(`Total weight must be 100%. Current: ${totalWeight}%`);
      setLoading(false);
      return;
    }
  }

  // Validate tiers for tiered mode (only if on tiers tab)
  if (activeTab === 'tiers' && formData.scholarship_mode === 'tiered' && tiers.length === 0) {
    setError('Please add at least one tier for tiered scholarship mode');
    setLoading(false);
    return;
  }

  // Prepare submission data - keep existing data for fields not in current tab
  const submissionData = {
    ...formData,
    custom_fields: formData.form_template === 'custom' ? customFields : [],
    scoring_criteria: scoringCriteria,  // Keep existing criteria
    number_of_awards: formData.scholarship_mode === 'single' ? formData.number_of_awards : 0,
    scholarship_mode: formData.scholarship_mode,
    tiers: formData.scholarship_mode === 'tiered' ? tiers : []
  };

  try {
    const response = await fetch(`/api/scholarships/${scholarshipId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update scholarship');
    }

    alert('Scholarship updated successfully!');
    router.push('/admin/scholarships');
    
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle student type selection
  const handleStudentTypeChange = (studentType: string, checked: boolean) => {
    setFormData(prev => {
      const types = checked 
        ? [...prev.student_types, studentType]
        : prev.student_types.filter(t => t !== studentType);
      
      if (types.length === 0) return prev;
      return { ...prev, student_types: types };
    });
  };

  // Add custom field
  const addCustomField = () => {
    setCustomFields(prev => [
      ...prev, 
      { 
        type: 'text', 
        label: '', 
        name: '', 
        required: false,
        placeholder: '',
        max_value: null
      }
    ]);
  };

  // Update custom field
  const updateCustomField = (index: number, field: keyof CustomField, value: any) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'label') {
      updated[index].name = value.toLowerCase().replace(/\s+/g, '_');
    }
    
    setCustomFields(updated);
  };

  // Remove custom field
  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  // NEW: Tier functions
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

  // ============ SCORING CRITERIA FUNCTIONS ============

  // Add new criterion
  const addCriterion = () => {
    const availableFields = getAvailableFormFields();
    if (availableFields.length === 0) {
      alert('No form fields available. Add custom fields first.');
      return;
    }

    const firstField = availableFields[0];
    const newCriterion: ScoringCriterion = {
      id: `criterion_${Date.now()}_${Math.random()}`,
      fieldName: firstField.name,
      fieldLabel: firstField.label,
      weight: 0
    };
    setScoringCriteria(prev => [...prev, newCriterion]);
  };

  // Update criterion
  const updateCriterion = (index: number, field: keyof ScoringCriterion, value: any) => {
    const updated = [...scoringCriteria];
    
    if (field === 'fieldName') {
      // Find the selected field to get its label
      const allFields = getAllFormFields();
      const selectedField = allFields.find(f => f.name === value);
      if (selectedField) {
        updated[index] = { 
          ...updated[index], 
          fieldName: value,
          fieldLabel: selectedField.label
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    
    setScoringCriteria(updated);
  };

  // Remove criterion
  const removeCriterion = (index: number) => {
    setScoringCriteria(prev => prev.filter((_, i) => i !== index));
  };

  // Get all form fields (template + custom)
  type FormFieldOption = {
    name: string;
    label: string;
    type: string;
  };

  const getAllFormFields = (): FormFieldOption[] => {
    const fields: FormFieldOption[] = [];
    
    if (formData.form_template !== 'custom') {
      // This would come from your template definitions
    }
    
    customFields.forEach(field => {
      if (field.label && field.name) {
        fields.push({
          name: field.name,
          label: field.label,
          type: field.type
        });
      }
    });
    
    return fields;
  };

  const getAvailableFormFields = (): FormFieldOption[] => {
    const allFields = getAllFormFields();
    const usedFieldNames = scoringCriteria.map(c => c.fieldName);
    return allFields.filter(f => !usedFieldNames.includes(f.name));
  };

  // Set minimum date to today for deadline
  const today = new Date().toISOString().split('T')[0];

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading scholarship...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Scholarship</h1>
            <p className="text-gray-600 mt-2">Update scholarship program details</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Scholarship Details
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'criteria'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Scoring Criteria {scoringCriteria.length > 0 && `(${scoringCriteria.length})`}
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'tiers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers size={16} />
            Tiers {formData.scholarship_mode === 'tiered' && tiers.length > 0 && `(${tiers.length})`}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'details' ? (
            /* ============ DETAILS TAB ============ */
            <div className="space-y-6">
              {/* NEW: Scholarship Mode Selection */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">Scholarship Award Type</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scholarship_mode"
                      value="single"
                      checked={formData.scholarship_mode === 'single'}
                      onChange={(e) => setFormData(prev => ({ ...prev, scholarship_mode: e.target.value }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Single Scholarship (All get same)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scholarship_mode"
                      value="tiered"
                      checked={formData.scholarship_mode === 'tiered'}
                      onChange={(e) => setFormData(prev => ({ ...prev, scholarship_mode: e.target.value }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Tiered Scholarship (Different awards)</span>
                  </label>
                </div>
              </div>

              {/* Number of Awards - Only for Single Mode */}
              {formData.scholarship_mode === 'single' && (
                <div>
                  <label htmlFor="number_of_awards" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Scholarships to Award *
                  </label>
                  <input
                    type="number"
                    id="number_of_awards"
                    name="number_of_awards"
                    value={formData.number_of_awards}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required={formData.scholarship_mode === 'single'}
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Top N students will be selected from the merit list
                  </p>
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Scholarship Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Need-Based Scholarship 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description & Details *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Include all details like eligibility, benefits, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                  required
                  disabled={loading}
                />
              </div>

              {/* Student Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Types *
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.student_types.includes('undergraduate')}
                      onChange={(e) => handleStudentTypeChange('undergraduate', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span className="text-gray-700">Undergraduate Students</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.student_types.includes('graduate')}
                      onChange={(e) => handleStudentTypeChange('graduate', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span className="text-gray-700">Graduate Students</span>
                  </label>
                </div>
              </div>

              {/* Form Template Selection */}
              <div>
                <label htmlFor="form_template" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Form Type *
                </label>
                <select
                  id="form_template"
                  name="form_template"
                  value={formData.form_template}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={loading}
                >
                  {TEMPLATE_OPTIONS.map(template => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  {TEMPLATE_OPTIONS.find(t => t.value === formData.form_template)?.description}
                </p>
              </div>

              {/* Custom Fields Builder */}
              {formData.form_template === 'custom' && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Custom Form Fields</h3>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Field
                    </button>
                  </div>
                  
                  {customFields.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                      No custom fields added yet. Click "Add Field" to start building your form.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {customFields.map((field, index) => (
                        <div key={index} className="flex flex-wrap gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <select
                            value={field.type}
                            onChange={(e) => updateCustomField(index, 'type', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="textarea">Text Area</option>
                            <option value="file">File Upload</option>
                          </select>
                          
                          <input
                            type="text"
                            placeholder="Field Label"
                            value={field.label}
                            onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          
                          <input
                            type="text"
                            placeholder="Placeholder (optional)"
                            value={field.placeholder}
                            onChange={(e) => updateCustomField(index, 'placeholder', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          
                          {field.type === 'number' && (
                            <input
                              type="number"
                              placeholder="Max Value"
                              value={field.max_value || ''}
                              onChange={(e) => updateCustomField(index, 'max_value', parseFloat(e.target.value))}
                              className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                          
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateCustomField(index, 'required', e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Required</span>
                          </label>
                          
                          <button
                            type="button"
                            onClick={() => removeCustomField(index)}
                            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Deadline & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          ) : activeTab === 'criteria' ? (
            /* ============ CRITERIA TAB ============ */
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">How Scoring Works</h3>
                <p className="text-sm text-blue-700">
                  Add criteria based on the form fields above. Each criterion gets a weight percentage.
                  Total must equal 100%. Scores will be calculated automatically when you generate the merit list.
                </p>
              </div>

              {/* Scoring Criteria List */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Scoring Criteria</h3>
                  <button
                    type="button"
                    onClick={addCriterion}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Criterion
                  </button>
                </div>
                
                {scoringCriteria.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <Award size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No scoring criteria added yet.</p>
                    <p className="text-sm text-gray-400">Click "Add Criterion" to define how scores are calculated.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-4">
                      {scoringCriteria.map((criterion, index) => {
                        const availableFields = getAllFormFields();
                        return (
                          <div key={criterion.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex-1">
                              <select
                                value={criterion.fieldName}
                                onChange={(e) => updateCriterion(index, 'fieldName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select a field</option>
                                {availableFields.map(field => (
                                  <option key={field.name} value={field.name}>
                                    {field.label} ({field.type})
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="w-32">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={criterion.weight}
                                  onChange={(e) => updateCriterion(index, 'weight', parseInt(e.target.value) || 0)}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  placeholder="%"
                                />
                                <span className="text-gray-600">%</span>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeCriterion(index)}
                              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Weight Total */}
                    <div className={`p-4 rounded-lg ${
                      totalWeight === 100 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Weight:</span>
                        <span className={`text-xl font-bold ${
                          totalWeight === 100 ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                          {totalWeight}%
                        </span>
                      </div>
                      {totalWeight !== 100 && (
                        <p className="text-sm text-yellow-700 mt-1">
                          Total must equal 100%. Currently {totalWeight}%.
                        </p>
                      )}
                    </div>

                    {/* Preview Section */}
                    {scoringCriteria.length > 0 && totalWeight === 100 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Score Calculation Preview</h4>
                        <p className="text-sm text-gray-600">
                          When you generate the merit list, each student's score will be calculated as:
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          {scoringCriteria.map((c, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-blue-600">{c.fieldLabel}:</span>
                              <span className="text-gray-700">(student's value × {c.weight}%)</span>
                            </div>
                          ))}
                          <div className="border-t mt-2 pt-2 font-medium">
                            Total = Sum of all weighted values
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* ============ TIERS TAB (NEW) ============ */
            <div className="space-y-6">
              {formData.scholarship_mode !== 'tiered' ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <p className="text-yellow-800">
                    This scholarship is in Single mode. To use tiers, go to Details tab and change Award Type to "Tiered Scholarship".
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Layers size={20} />
                      Scholarship Tiers
                    </h3>
                    <button
                      type="button"
                      onClick={addTier}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Tier
                    </button>
                  </div>

                  {tiers.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
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
                                placeholder="e.g., CAT-A, Gold"
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
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Updating...' : 'Update Scholarship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}