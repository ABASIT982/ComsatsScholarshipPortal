'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Award, 
  Calendar, 
  Download, 
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Share2,
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
  student_name?: string;
}

interface Scholarship {
  id: string;
  title: string;
  number_of_awards: number;
  deadline: string;
}

export default function StudentMeritDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [meritList, setMeritList] = useState<MeritEntry[]>([]);
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentEntry, setStudentEntry] = useState<MeritEntry | null>(null);

  useEffect(() => {
    // Get student registration from localStorage or context
    const regNo = localStorage.getItem('student_regno') || '2023001'; // Replace with actual auth
    setStudentRegNo(regNo);
    fetchMeritList(regNo);
  }, [scholarshipId]);

const fetchMeritList = async (regNo: string) => {
  setLoading(true);
  try {
    // Fetch scholarship details
    const { data: scholarshipData, error: scholarshipError } = await supabase
      .from('scholarships')
      .select('id, title, number_of_awards, deadline')
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

    // 🔥 FIX: Get student names from applications
    const meritWithNames = await Promise.all(
      (meritData || []).map(async (entry) => {
        // Get application data for this student
        const { data: appData } = await supabase
          .from('scholarship_applications')
          .select('application_data')
          .eq('scholarship_id', scholarshipId)
          .eq('student_regno', entry.student_regno)
          .single();
        
        // Extract student name from application_data
        const studentName = appData?.application_data?.student_name || entry.student_regno;
        
        return {
          ...entry,
          student_name: studentName
        };
      })
    );

    setMeritList(meritWithNames);

    // Find current student
    const currentStudent = meritWithNames?.find(m => m.student_regno === regNo) || null;
    setStudentEntry(currentStudent);

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
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
      h1 { color: #333; font-size: 24px; margin-bottom: 5px; }
      .date { color: #666; margin-bottom: 20px; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { background: #f3f4f6; padding: 10px; text-align: left; font-size: 12px; font-weight: bold; }
      td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    </style>
  `;

  const tableRows = meritList.map(entry => `
    <tr>
      <td>${entry.rank}</td>
      <td>${entry.student_name || entry.student_regno}</td>
      <td>${entry.student_regno}</td>
      <td>${entry.total_score.toFixed(1)}</td>
      <td>${entry.status}</td>
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
        <div class="date">Generated: ${new Date().toLocaleDateString()}</div>
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

const downloadAsCSV = () => {
  const headers = ['Rank', 'Student Name', 'Reg No', 'Total Score', 'Status'];
  const rows = meritList.map(item => [
    item.rank,
    item.student_name || item.student_regno, // Add student name here
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

  const getStatusBadge = (status: string, isCurrentStudent: boolean) => {
    const baseClass = "px-3 py-1 text-xs rounded-full font-medium flex items-center gap-1 w-fit";
    
    if (isCurrentStudent) {
      switch(status) {
        case 'selected':
        case 'awarded':
          return <span className={`${baseClass} bg-green-100 text-green-800 border-2 border-green-500`}><CheckCircle size={12} /> You are SELECTED! 🎉</span>;
        case 'waitlist':
          return <span className={`${baseClass} bg-yellow-100 text-yellow-800 border-2 border-yellow-500`}><Clock size={12} /> You are on WAITLIST</span>;
        default:
          return <span className={`${baseClass} bg-gray-100 text-gray-800 border-2 border-gray-500`}><XCircle size={12} /> Your Status: Pending</span>;
      }
    }
    
    switch(status) {
      case 'selected':
      case 'awarded':
        return <span className={`${baseClass} bg-green-100 text-green-800`}><CheckCircle size={12} /> Selected</span>;
      case 'waitlist':
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800`}><Clock size={12} /> Waitlist</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-800`}>Pending</span>;
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
  const cutoffScore = selectedCount > 0 ? meritList[selectedCount - 1]?.total_score : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Merit Lists
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Student Status Card */}
        {studentEntry && (
          <div className="bg-white rounded-xl shadow-md border-2 border-blue-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Merit Position</h2>
                  <p className="text-gray-600">Scholarship: {scholarship?.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">#{studentEntry.rank}</div>
                <div className="text-gray-600">Rank</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Your Score</div>
                <div className="text-2xl font-bold text-gray-900">{studentEntry.total_score}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Cutoff Score</div>
                <div className="text-2xl font-bold text-gray-900">{cutoffScore.toFixed(1)}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Status</div>
                <div className="mt-1">{getStatusBadge(studentEntry.status, true)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Scholarship Info & Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{scholarship?.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Deadline: {new Date(scholarship?.deadline || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>Total Seats: {scholarship?.number_of_awards}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadAsCSV}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
              >
                <Download size={18} />
                CSV
              </button>
<button
  onClick={printMeritList}
  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
>
  <Printer size={18} />
  Print
</button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Applicants</div>
            <div className="text-2xl font-bold text-gray-900">{meritList.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">Selected ({scholarship?.number_of_awards})</div>
            <div className="text-2xl font-bold text-green-600">{selectedCount}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">Waitlist</div>
            <div className="text-2xl font-bold text-yellow-600">
              {meritList.filter(m => m.status === 'waitlist').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">Cutoff Score</div>
            <div className="text-2xl font-bold text-blue-600">{cutoffScore.toFixed(1)}</div>
          </div>
        </div>

        {/* Merit List Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Complete Merit List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {meritList.map((entry) => {
                  const isCurrentStudent = entry.student_regno === studentRegNo;
                  return (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 ${isCurrentStudent ? 'bg-blue-50 font-medium' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            entry.rank <= 3 
                              ? 'bg-yellow-100 text-yellow-800 font-bold' 
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
                          {entry.student_name || entry.student_regno}
                          {isCurrentStudent && <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">You</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{entry.student_regno}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg text-gray-900">{entry.total_score.toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(entry.status, isCurrentStudent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}