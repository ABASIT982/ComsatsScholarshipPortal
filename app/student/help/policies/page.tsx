'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, ChevronUp, FileText, Shield } from 'lucide-react'

interface Policy {
  id: string
  title: string
  content: string
  category: string
}

export default function StudentPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/help/policies')
      const data = await response.json()
      setPolicies(data.items || [])
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(policies.map(p => p.category))]

  const filteredItems = policies.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading policies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {/* <Shield className="w-8 h-8 text-blue-600" /> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scholarship Policies</h1>
            <p className="text-gray-500 text-sm mt-1">Important policies for scholarship applicants</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Policies List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No policies available</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900 text-left">{item.title}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {item.category}
                  </span>
                </div>
                {openId === item.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openId === item.id && (
                <div className="px-6 pb-4 text-gray-600 text-sm border-t border-gray-100 pt-4 leading-relaxed whitespace-pre-line">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}