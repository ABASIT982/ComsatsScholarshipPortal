'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { TEMPLATE_OPTIONS } from '@/lib/form-templates';

// ADD THIS TYPE DEFINITION
type CustomField = {
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
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
    form_template: 'basic',
    custom_fields: [] as CustomField[] // FIX: Added type
  });

  // FIX: Added type to customFields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

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

    // Validate deadline is not in the past
    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      setError('Deadline cannot be in the past');
      setLoading(false);
      return;
    }

    // Prepare data with form configuration
    const submissionData = {
      ...formData,
      custom_fields: formData.form_template === 'custom' ? customFields : []
    };

    try {
      const response = await fetch('/api/scholarships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create scholarship');
      }

      // Success - redirect to scholarships list
      alert('Scholarship created successfully!');
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
      
      // Ensure at least one student type is selected
      if (types.length === 0) return prev;
      
      return { ...prev, student_types: types };
    });
  };

  // Add custom field - FIXED TYPE
  const addCustomField = () => {
    setCustomFields(prev => [
      ...prev, 
      { 
        type: 'text', 
        label: '', 
        name: '', 
        required: false,
        placeholder: ''
      }
    ]);
  };

  // Update custom field - FIXED TYPES
  const updateCustomField = (index: number, field: keyof CustomField, value: any) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-generate field name from label
    if (field === 'label') {
      updated[index].name = value.toLowerCase().replace(/\s+/g, '_');
    }
    
    setCustomFields(updated);
  };

  // Remove custom field
  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  // Set minimum date to today for deadline
  const today = new Date().toISOString().split('T')[0];

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
            <h1 className="text-3xl font-bold text-gray-900">Create Scholarship</h1>
            <p className="text-gray-600 mt-2">Add a new scholarship program for students</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
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
                placeholder="Include all details like:
• Amount and benefits
• Eligibility criteria  
• Required documents
• Selection process
• Any other important information"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                You can include amount, slots, eligibility criteria, required documents, and any other details in this description.
              </p>
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
              <p className="text-sm text-gray-500 mt-2">
                Select which student types can apply for this scholarship
              </p>
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

            {/* Custom Fields Builder (Only show for custom template) */}
            {formData.form_template === 'custom' && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Custom Form Fields</h3>
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Add Field
                  </button>
                </div>
                
                {customFields.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No custom fields added yet. Click "Add Field" to start building your form.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {customFields.map((field, index) => (
                      <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
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
                          placeholder="Field Label (e.g., Phone Number)"
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

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
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
                {loading ? 'Creating...' : 'Create Scholarship'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}