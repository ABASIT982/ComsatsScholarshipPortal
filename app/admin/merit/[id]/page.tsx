'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Mail,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Printer
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MeritEntry {
  id: string;
  rank: number;
  student_regno: string;
  total_score: number;
  status: 'selected' | 'waitlist' | 'awarded' | 'pending';
  score_breakdown: Record<string, number>;
  application_data?: any;
}

interface Scholarship {
  id: string;
  title: string;
  number_of_awards: number;
  scoring_criteria: any[];
}

export default function MeritListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [meritList, setMeritList] = useState<MeritEntry[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [scholarshipId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch scholarship details
      const { data: scholarshipData, error: scholarshipError } = await supabase
        .from('scholarships')
        .select('id, title, number_of_awards, scoring_criteria')
        .eq('id', scholarshipId)
        .single();

      if (scholarshipError) throw scholarshipError;
      setScholarship(scholarshipData);

      // Fetch merit list
      const { data: meritData, error: meritError } = await supabase
        .from('merit_lists')
        .select('*')
        .eq('scholarship_id', scholarshipId)
        .order('rank', { ascending: true });

      if (meritError) throw meritError;

      // Get student names from applications
      const meritWithNames = await Promise.all(
        (meritData || []).map(async (entry) => {
          const { data: appData } = await supabase
            .from('scholarship_applications')
            .select('application_data')
            .eq('scholarship_id', scholarshipId)
            .eq('student_regno', entry.student_regno)
            .maybeSingle();
          
          return {
            ...entry,
            application_data: appData?.application_data || {}
          };
        })
      );

      setMeritList(meritWithNames);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMeritList = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/admin/merit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate merit list');
      }

      alert('Merit list generated successfully!');
      fetchData(); // Refresh data
      
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (entryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('merit_lists')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (error) throw error;

      // Update local state
      setMeritList(prev => 
        prev.map(item => 
          item.id === entryId ? { ...item, status: newStatus as any } : item
        )
      );

    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const exportAsCSV = () => {
    const headers = ['Rank', 'Student Name', 'Reg No', 'Total Score', 'Status'];
    const rows = filteredMeritList.map(item => [
      item.rank,
      item.application_data?.student_name || 'Unknown',
      item.student_regno,
      item.total_score,
      item.status
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merit-list-${scholarship?.title.replace(/\s+/g, '-')}.csv`;
    a.click();
  };

  const printMeritList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print');
      return;
    }

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f3f4f6; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .rank { font-weight: bold; }
        .selected { color: #059669; }
        .waitlist { color: #d97706; }
        .awarded { color: #7c3aed; }
      </style>
    `;

    const tableRows = filteredMeritList.map(item => `
      <tr>
        <td class="rank">${item.rank}</td>
        <td>${item.application_data?.student_name || 'Unknown'}</td>
        <td>${item.student_regno}</td>
        <td>${item.total_score.toFixed(1)}</td>
        <td class="${item.status}">${item.status}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Merit List - ${scholarship?.title}</title>
          ${styles}
        </head>
        <body>
          <h1>${scholarship?.title}</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name</th>
                <th>Reg No</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const filteredMeritList = meritList.filter(item => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = 
      item.student_regno.toLowerCase().includes(searchTerm) ||
      (item.application_data?.student_name || '').toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-green-100 text-green-800';
      case 'awarded': return 'bg-purple-100 text-purple-800';
      case 'waitlist': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading merit list...</div>
        </div>
      </div>
    );
  }

  const selectedCount = meritList.filter(m => m.status === 'selected' || m.status === 'awarded').length;
  const awardTarget = scholarship?.number_of_awards || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button at the very top with proper spacing */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Header moved down */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Merit List</h1>
            <p className="text-gray-600 mt-2">{scholarship?.title}</p>
          </div>
          
          <div className="flex gap-3">
            {meritList.length === 0 ? (
              <button
                onClick={generateMeritList}
                disabled={generating}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} className={generating ? 'animate-spin' : ''} />
                {generating ? 'Generating...' : 'Generate Merit List'}
              </button>
            ) : (
              <>
                <button
                  onClick={printMeritList}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Printer size={20} />
                  Print
                </button>
                <button
                  onClick={exportAsCSV}
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                >
                  <Download size={20} />
                  Export CSV
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {meritList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Total Applicants</div>
              <div className="text-2xl font-bold text-gray-900">{meritList.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Selected ({awardTarget})</div>
              <div className="text-2xl font-bold text-green-600">{selectedCount}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Waitlist</div>
              <div className="text-2xl font-bold text-yellow-600">
                {meritList.filter(m => m.status === 'waitlist').length}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Cutoff Score</div>
              <div className="text-2xl font-bold text-blue-600">
                {awardTarget > 0 && meritList.length >= awardTarget
                  ? meritList[awardTarget - 1]?.total_score.toFixed(1)
                  : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {meritList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Award size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Merit List Generated</h3>
            <p className="text-gray-600 mb-6">
              Generate a merit list to see ranked applicants based on scoring criteria.
            </p>
            <button
              onClick={generateMeritList}
              disabled={generating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={20} className={generating ? 'animate-spin' : ''} />
              {generating ? 'Generating...' : 'Generate Merit List Now'}
            </button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or registration number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="selected">Selected</option>
                    <option value="waitlist">Waitlist</option>
                    <option value="awarded">Awarded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Merit List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMeritList.map((entry) => (
                    <React.Fragment key={entry.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                              entry.rank <= 3 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : entry.status === 'selected' || entry.status === 'awarded'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {entry.application_data?.student_name || 'Unknown Student'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {entry.student_regno}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-lg text-gray-900">{entry.total_score.toFixed(1)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={entry.status}
                            onChange={(e) => updateStatus(entry.id, e.target.value)}
                            className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(entry.status)} border-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="selected">Selected</option>
                            <option value="waitlist">Waitlist</option>
                            <option value="awarded">Awarded</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Score Breakdown"
                            >
                              {expandedRow === entry.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="View Application"
                            >
                              <Eye size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - Score Breakdown */}
                      {expandedRow === entry.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-blue-50">
                            <div className="p-4 bg-white rounded-lg shadow-inner">
                              <h4 className="font-semibold mb-3">Score Breakdown</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(entry.score_breakdown || {}).map(([key, value]) => (
                                  <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-600">{key.replace(/_/g, ' ')}</div>
                                    <div className="text-xl font-bold text-blue-600">
                                      {typeof value === 'number' ? value.toFixed(1) : value}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}