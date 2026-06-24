'use client'

import { useState, useEffect } from 'react'
import { Archive, ArrowLeft, RefreshCw, Trash2, RotateCcw, Search, Award, X } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function ScholarshipArchivePage() {
  const [archivedScholarships, setArchivedScholarships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean
    id: string
    title: string
    action: 'restore' | 'reset' | 'delete'
  }>({
    show: false,
    id: '',
    title: '',
    action: 'restore'
  })

  useEffect(() => {
    fetchArchived()
  }, [])

  const fetchArchived = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/scholarships/archive')
      const data = await response.json()
      
      if (response.ok) {
        setArchivedScholarships(data.scholarships || [])
      } else {
        toast.error(data.error || 'Failed to load archived scholarships', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '10px 16px',
          },
        })
      }
    } catch (error) {
      toast.error('Failed to load archived scholarships', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          padding: '10px 16px',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  // Restore confirmation toast
  const handleRestoreClick = (id: string, title: string) => {
    toast.dismiss()
    toast(
      (t) => (
        <div className="text-center">
          <p className="font-semibold text-gray-800 mb-2">Restore Scholarship?</p>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-xs text-gray-500 mb-3">All applications and data will remain intact.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                confirmRestore(id)
              }}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 min-w-[80px]"
            >
              Restore
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 min-w-[80px]"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: 'top-center',
        style: {
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: '320px',
        },
      }
    )
  }

  const confirmRestore = async (id: string) => {
    setActionId(id)
    try {
      const response = await fetch(`/api/admin/scholarships/archive/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.dismiss()
        toast.success(data.message || 'Scholarship restored successfully!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#dcfce7',
            color: '#166534',
            borderRadius: '8px',
            padding: '10px 16px',
          },
        })
        fetchArchived()
        setConfirmModal({ show: false, id: '', title: '', action: 'restore' })
      } else {
        toast.error(data.error || 'Failed to restore', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '10px 16px',
          },
        })
      }
    } catch (error) {
      toast.error('Error restoring scholarship', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          padding: '10px 16px',
        },
      })
    } finally {
      setActionId(null)
    }
  }

  // Reset confirmation toast
  const handleResetClick = (id: string, title: string) => {
    toast.dismiss()
    toast(
      (t) => (
        <div className="text-center">
          <p className="font-semibold text-gray-800 mb-2">Reset Scholarship?</p>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-xs text-yellow-600 mb-1">All applications and merit lists will be deleted.</p>
          <p className="text-xs text-green-600 mb-3">The scholarship will become active again.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                confirmReset(id)
              }}
              className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 min-w-[100px]"
            >
              Reset & Clear
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 min-w-[80px]"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: 'top-center',
        style: {
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: '340px',
        },
      }
    )
  }

  const confirmReset = async (id: string) => {
    setActionId(id)
    try {
      const response = await fetch(`/api/admin/scholarships/archive/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.dismiss()
        toast.success(data.message || 'Scholarship reset successfully! All applications cleared.', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#dcfce7',
            color: '#166534',
            borderRadius: '8px',
            padding: '10px 16px',
          },
        })
        fetchArchived()
        setConfirmModal({ show: false, id: '', title: '', action: 'reset' })
      } else {
        toast.error(data.error || 'Failed to reset', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '10px 16px',
          },
        })
      }
    } catch (error) {
      toast.error('Error resetting scholarship', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          padding: '10px 16px',
        },
      })
    } finally {
      setActionId(null)
    }
  }

  // Delete confirmation toast
  const handleDeleteClick = (id: string, title: string) => {
    toast.dismiss()
    toast(
      (t) => (
        <div className="text-center">
          <p className="font-bold text-red-600 mb-2">Delete Scholarship?</p>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-xs text-red-500 font-semibold mb-2">This action cannot be undone!</p>
          <p className="text-xs text-gray-500 mb-4">All applications, merit lists, and tiers will be deleted.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                confirmDelete(id)
              }}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 min-w-[100px]"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 min-w-[80px]"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: 'top-center',
        style: {
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: '340px',
        },
      }
    )
  }

  const confirmDelete = async (id: string) => {
    setActionId(id)
    try {
      const response = await fetch(`/api/admin/scholarships/archive/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.dismiss()
        toast.success(data.message || 'Scholarship permanently deleted', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '10px 16px',
          },
        })
        fetchArchived()
        setConfirmModal({ show: false, id: '', title: '', action: 'delete' })
      } else {
        toast.error(data.error || 'Failed to delete', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '10px 16px',
          },
        })
      }
    } catch (error) {
      toast.error('Error deleting scholarship', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          padding: '10px 16px',
        },
      })
    } finally {
      setActionId(null)
    }
  }

  const getModalContent = (action: 'restore' | 'reset' | 'delete', title: string) => {
    switch (action) {
      case 'restore':
        return {
          title: 'Restore Scholarship',
          description: (
            <>Are you sure you want to restore <strong>"{title}"</strong>?<br />
            <span className="text-green-600">All applications and data will remain intact.</span></>
          ),
          confirmText: 'Restore',
          confirmBg: 'bg-green-600 hover:bg-green-700'
        }
      case 'reset':
        return {
          title: 'Reset Scholarship',
          description: (
            <>Are you sure you want to reset <strong>"{title}"</strong>?<br />
            <span className="text-yellow-600">All applications and merit lists will be deleted.</span><br />
            <span className="text-green-600">The scholarship will become active again.</span></>
          ),
          confirmText: 'Reset & Clear All',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'delete':
        return {
          title: 'Delete Scholarship',
          description: (
            <>Are you sure you want to permanently delete <strong>"{title}"</strong>?<br />
            <span className="text-red-600">This action cannot be undone.</span><br />
            <span className="text-red-600">All applications, merit lists, and tiers will be deleted.</span></>
          ),
          confirmText: 'Delete Permanently',
          confirmBg: 'bg-red-600 hover:bg-red-700'
        }
    }
  }

  const filtered = archivedScholarships.filter(sch =>
    sch.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sch.id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isProcessing = actionId !== null

  if (loading) {
    return (
      <div className="p-6 text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading archived scholarships...</p>
      </div>
    )
  }

  return (
    <>
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
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/scholarships" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scholarship Archive</h1>
              <p className="text-gray-500 text-sm">View, restore, reset, or permanently delete archived scholarships</p>
            </div>
          </div>
          <button
            onClick={fetchArchived}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search archived scholarships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              {filtered.length} found
            </div>
          </div>
        </div>

        {/* Archived List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {archivedScholarships.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No archived scholarships found</p>
              <p className="text-sm text-gray-400 mt-1">
                Scholarships will appear here when they are expired or inactive
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Applications</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((sch: any) => {
                    const isProcessingThis = actionId === sch.id
                    
                    return (
                      <tr key={sch.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{sch.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            new Date(sch.deadline) < new Date()
                              ? 'bg-red-100 text-red-700'
                              : sch.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {new Date(sch.deadline) < new Date() ? 'Expired' : sch.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{sch.applications || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleRestoreClick(sch.id, sch.title)}
                              disabled={isProcessingThis}
                              className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-xs"
                              title="Restore - Keep all data"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restore
                            </button>
                            
                            <button
                              onClick={() => handleResetClick(sch.id, sch.title)}
                              disabled={isProcessingThis}
                              className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-xs"
                              title="Reset - Clear all applications"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Reset
                            </button>
                            
                            <button
                              onClick={() => handleDeleteClick(sch.id, sch.title)}
                              disabled={isProcessingThis}
                              className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-xs"
                              title="Delete - Permanently remove"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}