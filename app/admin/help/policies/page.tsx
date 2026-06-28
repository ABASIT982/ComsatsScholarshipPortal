'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, X, CheckCircle, FileText, XCircle } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Policy {
  id: string
  title: string
  content: string
  category: string
  is_active: boolean
  display_order: number
}

// ✅ Category Color Mapping (Same as FAQ & Guidelines)
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    general: 'bg-blue-100 text-blue-700',
    application: 'bg-green-100 text-green-700',
    documents: 'bg-purple-100 text-purple-700',
    merit_list: 'bg-orange-100 text-orange-700',
    awards: 'bg-yellow-100 text-yellow-700',
    eligibility: 'bg-red-100 text-red-700',
    appeals: 'bg-pink-100 text-pink-700',
    technical: 'bg-indigo-100 text-indigo-700'
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

export default function AdminPoliciesPage() {
  const [items, setItems] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Policy | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    is_active: true,
    display_order: 0
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/help/policies')
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Error fetching policies:', error)
      toast.error('Failed to load policies')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const url = editingItem
        ? `/api/admin/help/policies/${editingItem.id}`
        : '/api/admin/help/policies'
      
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(editingItem ? 'Policy updated!' : 'Policy created!')
        setShowModal(false)
        setEditingItem(null)
        setFormData({ title: '', content: '', category: 'general', is_active: true, display_order: 0 })
        fetchItems()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this policy?')) return

    try {
      const response = await fetch(`/api/admin/help/policies/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Policy deleted!')
        fetchItems()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleEdit = (item: Policy) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      is_active: item.is_active,
      display_order: item.display_order
    })
    setShowModal(true)
  }

  const handleToggleStatus = async (item: Policy) => {
    try {
      const response = await fetch(`/api/admin/help/policies/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_active: !item.is_active })
      })

      if (response.ok) {
        toast.success(`Policy ${!item.is_active ? 'activated' : 'deactivated'}`)
        fetchItems()
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = ['general', 'application', 'documents', 'merit_list', 'awards', 'eligibility', 'appeals', 'technical']

  if (loading) {
    return (
      <div className="p-6 text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading policies...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policies Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage scholarship policies</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setFormData({ title: '', content: '', category: 'general', is_active: true, display_order: 0 })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Policy
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No policies found</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Policy" to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">{item.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="flex items-center justify-center mx-auto"
                      >
                        {item.is_active ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {item.display_order}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Policy' : 'Create Policy'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter policy title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter policy content..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Active (visible to students)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}