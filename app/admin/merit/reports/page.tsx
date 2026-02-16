'use client';
import { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MeritEntry {
  id: string;
  rank: number;
  student_regno: string;
  total_score: number;
  status: string;
  student_name?: string;
}

interface Scholarship {
  id: string;
  title: string;
  number_of_awards: number;
}

export default function MeritReportsPage() {
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<string>('all');
  const [meritList, setMeritList] = useState<MeritEntry[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedScholarship) {
      fetchMeritList(selectedScholarship);
    }
  }, [selectedScholarship]);

  const fetchData = async () => {
    try {
      const { data: scholarshipsData } = await supabase
        .from('scholarships')
        .select('id, title, number_of_awards')
        .order('created_at', { ascending: false });

      setScholarships(scholarshipsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeritList = async (scholarshipId: string) => {
    try {
      let query = supabase
        .from('merit_lists')
        .select('*')
        .order('rank', { ascending: true });

      if (scholarshipId !== 'all') {
        query = query.eq('scholarship_id', scholarshipId);
      }

      const { data: meritData } = await query;

      if (meritData) {
        // Get student names for each entry
        const meritWithNames = await Promise.all(
          meritData.map(async (entry) => {
            const { data: appData } = await supabase
              .from('scholarship_applications')
              .select('application_data')
              .eq('scholarship_id', entry.scholarship_id)
              .eq('student_regno', entry.student_regno)
              .maybeSingle();
            
            return {
              ...entry,
              student_name: appData?.application_data?.student_name || entry.student_regno
            };
          })
        );

        setMeritList(meritWithNames);

        // Calculate stats
        const total = meritWithNames.length;
        const selected = meritWithNames.filter(m => m.status === 'selected' || m.status === 'awarded').length;
        const waitlist = meritWithNames.filter(m => m.status === 'waitlist').length;
        const pending = meritWithNames.filter(m => m.status === 'pending').length;
        const avgScore = meritWithNames.reduce((sum, m) => sum + m.total_score, 0) / total || 0;

        setStats({
          total_applications: total,
          total_selected: selected,
          total_waitlist: waitlist,
          total_pending: pending,
          average_score: Number(avgScore.toFixed(2)),
          selection_rate: Number(((selected / total) * 100).toFixed(2)) || 0
        });
      }
    } catch (error) {
      console.error('Error fetching merit list:', error);
    }
  };

const downloadPDF = () => {
  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Merit List Report', 14, 22);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Scholarship info
    doc.setFontSize(12);
    const scholarshipTitle = selectedScholarship === 'all' 
      ? 'All Scholarships' 
      : scholarships.find(s => s.id === selectedScholarship)?.title || '';
    doc.text(`Scholarship: ${scholarshipTitle}`, 14, 38);

    // Stats table
    if (stats) {
      autoTable(doc, {
        startY: 45,
        head: [['Metric', 'Value']],
        body: [
          ['Total Applications', stats.total_applications.toString()],
          ['Total Selected', stats.total_selected.toString()],
          ['Waitlist', stats.total_waitlist.toString()],
          ['Pending', stats.total_pending.toString()],
          ['Average Score', stats.average_score.toString()],
          ['Selection Rate', `${stats.selection_rate}%`],
        ],
      });
    }

    // Merit list table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Rank', 'Student Name', 'Reg No', 'Score', 'Status']],
      body: meritList.map(m => [
        m.rank.toString(),
        m.student_name || m.student_regno,
        m.student_regno,
        m.total_score.toFixed(1),
        m.status
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`merit-report-${Date.now()}.pdf`);
  } catch (error) {
    console.error('PDF Error:', error);
    alert('Error generating PDF. Please try again.');
  }
};


  const downloadCSV = () => {
    try {
      // FIXED: Headers with both Name and Reg No
      const headers = ['Rank', 'Student Name', 'Reg No', 'Score', 'Status'];
      const rows = meritList.map(m => [
        m.rank,
        m.student_name || m.student_regno, // This shows name
        m.student_regno,                   // This shows reg no
        m.total_score,
        m.status
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merit-list-${Date.now()}.csv`;
      a.click();
    } catch (error) {
      console.error('CSV Error:', error);
      alert('Error generating CSV file. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Merit List Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive analytics and export options</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <FileText size={18} />
              PDF
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            >
              <Download size={18} />
              CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship</label>
              <select
                value={selectedScholarship}
                onChange={(e) => setSelectedScholarship(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Scholarships</option>
                {scholarships.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.total_applications}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Selected</p>
                    <p className="text-2xl font-bold text-green-600">{stats.total_selected}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Waitlist</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.total_waitlist}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Selection Rate</p>
                    <p className="text-2xl font-bold">{stats.selection_rate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Merit List Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Merit List</h3>
                <span className="text-sm text-gray-600">Total: {meritList.length} students</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Reg No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {meritList.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{entry.rank}</td>
                        <td className="px-6 py-4">{entry.student_name || entry.student_regno}</td>
                        <td className="px-6 py-4">{entry.student_regno}</td>
                        <td className="px-6 py-4">{entry.total_score.toFixed(1)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            entry.status === 'selected' || entry.status === 'awarded' ? 'bg-green-100 text-green-800' :
                            entry.status === 'waitlist' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}