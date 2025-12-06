'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Eye, 
  Printer,
  Users,
  Award,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Report {
  id: number;
  name: string;
  description: string;
  type: 'merit' | 'financial' | 'application' | 'allocation';
  format: 'pdf' | 'excel' | 'csv';
  generatedDate: string;
  size: string;
  downloads: number;
}

interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const reportTemplates: ReportTemplate[] = [
    { id: 1, name: 'Merit Analysis', description: 'Detailed merit score analysis and ranking', icon: BarChart3, color: 'blue' },
    { id: 2, name: 'Application Stats', description: 'Application statistics and trends', icon: Users, color: 'green' },
    { id: 3, name: 'Financial Summary', description: 'Scholarship allocation and budget', icon: DollarSign, color: 'purple' },
    { id: 4, name: 'Allocation Report', description: 'Scholarship allocation details', icon: Award, color: 'yellow' },
    { id: 5, name: 'Monthly Summary', description: 'Monthly performance overview', icon: Calendar, color: 'pink' },
    { id: 6, name: 'Trend Analysis', description: 'Performance trends over time', icon: TrendingUp, color: 'indigo' },
  ];

  const generatedReports: Report[] = [
    { id: 1, name: 'Fall 2024 Merit Analysis', description: 'Complete merit analysis for Fall semester', type: 'merit', format: 'pdf', generatedDate: '2024-01-15', size: '2.4 MB', downloads: 45 },
    { id: 2, name: 'Application Statistics Q4 2024', description: 'Quarterly application statistics', type: 'application', format: 'excel', generatedDate: '2024-01-10', size: '1.8 MB', downloads: 32 },
    { id: 3, name: 'Scholarship Allocation Report', description: 'Allocation details for current year', type: 'allocation', format: 'pdf', generatedDate: '2024-01-05', size: '3.2 MB', downloads: 28 },
    { id: 4, name: 'Financial Summary 2024', description: 'Annual financial overview', type: 'financial', format: 'excel', generatedDate: '2024-01-01', size: '4.1 MB', downloads: 19 },
    { id: 5, name: 'Monthly Performance Jan 2024', description: 'January performance metrics', type: 'application', format: 'pdf', generatedDate: '2024-01-28', size: '1.5 MB', downloads: 22 },
    { id: 6, name: 'Category-wise Analysis', description: 'Analysis by student categories', type: 'merit', format: 'csv', generatedDate: '2024-01-20', size: '0.9 MB', downloads: 15 },
  ];

  const stats = [
    { label: 'Total Reports', value: '24', icon: FileText, color: 'blue' },
    { label: 'This Month', value: '6', icon: Calendar, color: 'green' },
    { label: 'Total Downloads', value: '161', icon: Download, color: 'purple' },
    { label: 'Avg. Size', value: '2.3 MB', icon: BarChart3, color: 'yellow' },
  ];

  const generateReport = (templateId: number) => {
    const template = reportTemplates.find(t => t.id === templateId);
    alert(`Generating ${template?.name} report...`);
  };

  const downloadReport = (reportId: number) => {
    const report = generatedReports.find(r => r.id === reportId);
    alert(`Downloading ${report?.name}...`);
  };

  const previewReport = (reportId: number) => {
    const report = generatedReports.find(r => r.id === reportId);
    alert(`Previewing ${report?.name}...`);
  };

  const filteredReports = selectedReportType === 'all' 
    ? generatedReports 
    : generatedReports.filter(report => report.type === selectedReportType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'merit': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'application': return 'bg-purple-100 text-purple-800';
      case 'allocation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'excel': return 'bg-green-100 text-green-800';
      case 'csv': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'merit': return <BarChart3 className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'application': return <Users className="w-4 h-4" />;
      case 'allocation': return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
            <p className="text-gray-600">Generate and analyze comprehensive scholarship reports</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  <Icon className={`${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quick Report Templates</h2>
            <p className="text-gray-600">Generate reports with pre-defined templates</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Filter size={20} />
            Custom Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div 
                key={template.id}
                onClick={() => generateReport(template.id)}
                className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${
                    template.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                    template.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                    template.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                    template.color === 'yellow' ? 'bg-yellow-100 group-hover:bg-yellow-200' :
                    template.color === 'pink' ? 'bg-pink-100 group-hover:bg-pink-200' :
                    'bg-indigo-100 group-hover:bg-indigo-200'
                  }`}>
                    {/* <Icon className={`${
                      template.color === 'blue' ? 'text-blue-600' :
                      template.color === 'green' ? 'text-green-600' :
                      template.color === 'purple' ? 'text-purple-600' :
                      template.color === 'yellow' ? 'text-yellow-600' :
                      template.color === 'pink' ? 'text-pink-600' :
                      'text-indigo-600'
                    }`} size={24} /> */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Click to generate</span>
                  <FileText className="text-gray-400 group-hover:text-blue-500" size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Filter Reports</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedReportType('all')}
                className={`px-4 py-2 rounded-lg ${selectedReportType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                All Reports
              </button>
              <button
                onClick={() => setSelectedReportType('merit')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedReportType === 'merit' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <BarChart3 size={16} />
                Merit Reports
              </button>
              <button
                onClick={() => setSelectedReportType('application')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedReportType === 'application' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <Users size={16} />
                Application
              </button>
              <button
                onClick={() => setSelectedReportType('allocation')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedReportType === 'allocation' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <Award size={16} />
                Allocation
              </button>
              <button
                onClick={() => setSelectedReportType('financial')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedReportType === 'financial' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <DollarSign size={16} />
                Financial
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Generated Reports</h2>
              <p className="text-gray-600">Previously generated and downloaded reports</p>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredReports.length} of {generatedReports.length} reports
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downloads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-600">{report.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getTypeColor(report.type)}`}>
                      {getTypeIcon(report.type)}
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getFormatColor(report.format)}`}>
                      {report.format.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {report.generatedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      {report.size}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Download size={14} className="text-gray-400" />
                      {report.downloads}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => previewReport(report.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => downloadReport(report.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        title="Print"
                      >
                        <Printer size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try changing your filters or generate a new report</p>
          </div>
        )}

        {/* Footer Summary */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total reports: {generatedReports.length} • 
              Total downloads: {generatedReports.reduce((sum, report) => sum + report.downloads, 0)} • 
              Total size: {(generatedReports.reduce((sum, report) => sum + parseFloat(report.size), 0)).toFixed(1)} MB
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Download size={20} />
              Export All as ZIP
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Report Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="font-medium">Merit Analysis Report Generated</p>
              <p className="text-sm text-gray-600">2 minutes ago • 2.4 MB • PDF format</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Download className="text-blue-600" size={20} />
            <div>
              <p className="font-medium">Application Statistics Downloaded</p>
              <p className="text-sm text-gray-600">1 hour ago • by Admin User</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <Clock className="text-yellow-600" size={20} />
            <div>
              <p className="font-medium">Monthly Summary Scheduled</p>
              <p className="text-sm text-gray-600">Will generate automatically at end of month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}