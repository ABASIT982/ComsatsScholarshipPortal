'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Sparkles, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

interface RecommendedScholarship {
  id: string
  title: string
  description: string
  deadline: string
  amount: string
  matchPercentage: number
  selectionProbability: number
  reason: string
  matchDetails: any
}

export default function RecommendedScholarshipsPage() {
  const [recommendations, setRecommendations] = useState<RecommendedScholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const studentRegno = localStorage.getItem('studentRegno') || localStorage.getItem('studentToken')
      
      const response = await fetch(`/api/recommendations?student_regno=${studentRegno}`)
      const data = await response.json()
      
      if (response.ok) {
        setRecommendations(data.recommendations || [])
      } else {
        setError(data.error || 'Failed to fetch recommendations')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return days
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Finding best matches for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recommended Scholarships</h1>
        <p className="text-gray-500 text-sm mt-1">Scholarships tailored for you</p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {!loading && recommendations.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No recommendations yet</h3>
          <p className="text-gray-500 text-sm">Apply for scholarships first to get personalized recommendations.</p>
          <Link
            href="/student/scholarships"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Browse Scholarships
          </Link>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-4">
          {/* Stats summary */}
          <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">{recommendations.length} scholarships found</span>
            <span className="text-sm font-medium text-blue-600">Top match {recommendations[0]?.matchPercentage}%</span>
          </div>

          {/* Recommendation cards */}
          {recommendations.map((scholarship) => {
            const daysLeft = getDaysRemaining(scholarship.deadline)

            return (
              <div key={scholarship.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                      {scholarship.matchPercentage}% Match
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">{scholarship.title}</h2>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3">{scholarship.description}</p>

                {/* Amount */}
                {scholarship.amount && (
                  <div className="text-sm font-medium text-blue-600 mb-3">
                    {scholarship.amount}
                  </div>
                )}

                {/* Why recommended */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-gray-700">Why recommended</span>
                  </div>
                  <p className="text-gray-600 text-xs">{scholarship.reason}</p>
                  
                  {/* Match details */}
                  {scholarship.matchDetails && Object.keys(scholarship.matchDetails).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(scholarship.matchDetails).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex items-center gap-1 text-xs">
                            {value.matched !== false ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-gray-400" />
                            )}
                            <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                            {value.value && <span className="font-medium text-gray-800">{value.value}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/student/scholarships/${scholarship.id}`}
                    className="flex-1 text-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/student/scholarships/${scholarship.id}/apply`}
                    className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium ${
                      daysLeft > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}