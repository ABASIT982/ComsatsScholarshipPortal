'use client';

import { useState } from 'react';
import { Calculator, RefreshCw, Download, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function CalculateScoresPage() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastCalculated, setLastCalculated] = useState('2024-01-15 14:30');
  
  const calculateScores = () => {
    setIsCalculating(true);
    // Simulate calculation
    setTimeout(() => {
      setIsCalculating(false);
      setLastCalculated(new Date().toLocaleString());
    }, 2000);
  };

  const statistics = [
    { label: 'Total Applications', value: '1,247', change: '+12%', color: 'blue' },
    { label: 'Calculated Scores', value: '1,150', change: '+92%', color: 'green' },
    { label: 'Pending Calculation', value: '97', change: '-8%', color: 'yellow' },
    { label: 'Average Score', value: '78.5', change: '+2.3', color: 'purple' },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Calculate Merit Scores</h1>
        </div>
        <p className="text-gray-600">Calculate merit scores based on defined criteria for all applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statistics.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                stat.color === 'green' ? 'bg-green-100 text-green-800' :
                stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calculation Panel */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Score Calculation</h2>
            <p className="text-gray-600">Calculate merit scores for all pending applications</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              <Download size={20} />
              Export Data
            </button>
            <button
              onClick={calculateScores}
              disabled={isCalculating}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  Calculate Scores
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-600" size={20} />
            <div>
              <p className="font-medium">Last calculated: {lastCalculated}</p>
              <p className="text-sm text-gray-600">Next scheduled calculation: Today, 18:00</p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">1,150</p>
            <p className="text-sm text-gray-600">Applications calculated</p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <span className="font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">97</p>
            <p className="text-sm text-gray-600">Awaiting calculation</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-purple-600" size={20} />
              <span className="font-medium">Average Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">2.4s</p>
            <p className="text-sm text-gray-600">Per application</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/merit/criteria" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium">Update Criteria</p>
                <p className="text-sm text-gray-600">Modify calculation weights</p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/merit/lists" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium">View Lists</p>
                <p className="text-sm text-gray-600">See calculated merit lists</p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/merit/reports" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-medium">Generate Reports</p>
                <p className="text-sm text-gray-600">Detailed analysis reports</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}