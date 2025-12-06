'use client';

import { useState } from 'react';
import { FileText, Download, BarChart3, PieChart, TrendingUp, Calendar, Filter, Eye } from 'lucide-react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('overview');
  
  const reports = [
    { id: 'overview', name: 'Merit Overview', icon: BarChart3, color: 'blue', count: '1,247' },
    { id: 'category', name: 'Category Analysis', icon: PieChart, color: 'green', count: '4' },
    { id: 'trend', name: 'Trend Analysis', icon: TrendingUp, color: 'purple', count: '12 months' },
    { id: 'annual', name: 'Annual Report', icon: Calendar, color: 'yellow', count: '2024' },
  ];

  const generatedReports = [
    { id: 1, name: 'Fall 2024 Merit Report', date: '2024-01-15', size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'Category-wise Analysis', date: '2024-01-10', size: '1.8 MB', type: 'Excel' },
    { id: 3, name: 'Monthly Trend Report', date: '2024-01-05', size: '3.2 MB', type: 'PDF' },
    { id: 4, name: 'Scholarship Allocation', date: '2024-01-01', size: '1.5 MB', type: 'Excel' },
  ];

  const generateReport = () => {
    alert(`Generating ${selectedReport} report...`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Merit Reports</h1>
        </div>
        <p className="text-gray-600">Generate and view detailed merit analysis reports</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div 
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`bg-white rounded-xl shadow-md p-6 border-2 cursor-pointer transition-all ${
                selectedReport === report.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  report.color === 'blue' ? 'bg-blue-100' :
                  report.color === 'green' ? 'bg-green-100' :
                  report.color === 'purple' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  <Icon className={`${
                    report.color === 'blue' ? 'text-blue-600' :
                    report.color === 'green' ? 'text-green-600' :
                    report.color === 'purple' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.count} entries</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Generate Report</h2>
            <p className="text-gray-600">Generate detailed merit analysis reports</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              Filter Options
            </button>
            <button
              onClick={generateReport}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FileText size={20} />
              Generate Report
            </button>
          </div>
        </div>

        {/* Report Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Detailed Merit Analysis</option>
                <option>Category-wise Report</option>
                <option>Trend Analysis</option>
                <option>Allocation Summary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex gap-2">
                <input type="date" className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
                <span className="self-center">to</span>
                <input type="date" className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="format" defaultChecked className="mr-2" />
                  PDF
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" />
                  Excel
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" />
                  CSV
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Include Charts</label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                Include visual charts and graphs
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Previously Generated Reports */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Generated Reports</h2>
          <p className="text-gray-600">Previously generated merit reports</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {generatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="text-gray-400" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">{report.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {report.size}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      report.type === 'PDF' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                        <Eye size={16} />
                        View
                      </button>
                      <button className="flex items-center gap-1 text-green-600 hover:text-green-800 ml-4">
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}