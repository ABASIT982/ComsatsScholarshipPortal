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
  award_tier?: string;
  award_description?: string;
  student_name?: string;
}

interface Scholarship {
  id: string;
  title: string;
  number_of_awards: number;
  deadline: string;
  scholarship_mode?: string;
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
  const [isTiered, setIsTiered] = useState(false);

  useEffect(() => {
    const regNo = localStorage.getItem('studentRegno') || '';
    setStudentRegNo(regNo);
    fetchMeritList(regNo);
  }, [scholarshipId]);

  const fetchMeritList = async (regNo: string) => {
    setLoading(true);
    try {
      const { data: scholarshipData, error: scholarshipError } = await supabase
        .from('scholarships')
        .select('id, title, number_of_awards, deadline, scholarship_mode')
        .eq('id', scholarshipId)
        .single();

      if (scholarshipError) throw scholarshipError;
      setScholarship(scholarshipData);
      setIsTiered(scholarshipData?.scholarship_mode === 'tiered');

      const { data: meritData, error: meritError } = await supabase
        .from('merit_lists')
        .select('*, award_tier, award_description')
        .eq('scholarship_id', scholarshipId)
        .order('rank', { ascending: true });

      if (meritError) throw meritError;

      const meritWithNames = await Promise.all(
        (meritData || []).map(async (entry) => {
          const { data: appData } = await supabase
            .from('scholarship_applications')
            .select('application_data')
            .eq('scholarship_id', scholarshipId)
            .eq('student_regno', entry.student_regno)
            .single();
          
          const studentName = appData?.application_data?.student_name || entry.student_regno;
          
          return {
            ...entry,
            student_name: studentName
          };
        })
      );

      setMeritList(meritWithNames);
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

  const logoUrl = `${window.location.protocol}//${window.location.host}/images/comsats.jpg`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const styles = `
    <style>
      @media print {
        body { margin: 0; padding: 0; }
        @page { size: A4; margin: 1.5cm; }
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        background: white;
        padding: 20px;
      }
      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #1a5276;
        padding-bottom: 20px;
      }
      .logo-title-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-bottom: 5px;
      }
      .logo {
        max-width: 70px;
        max-height: 70px;
      }
      .university-name {
        font-size: 22px;
        font-weight: bold;
        color: #1a5276;
      }
      .campus-name {
        font-size: 14px;
        color: #2c3e50;
        text-align: center;
      }
      .document-title {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin: 25px 0 10px 0;
        text-transform: uppercase;
        color: #1a5276;
      }
      .scholarship-info {
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background: #f8f9fa;
      }
      .scholarship-title {
        font-size: 18px;
        font-weight: bold;
      }
      .meta-info {
        font-size: 12px;
        color: #7f8c8d;
        margin-top: 5px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th {
        background: #1a5276;
        color: white;
        padding: 10px;
        text-align: center;
        font-size: 13px;
      }
      td {
        padding: 8px;
        text-align: center;
        border-bottom: 1px solid #ddd;
        font-size: 12px;
      }
      .footer-stats {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
        padding-top: 10px;
        border-top: 1px solid #ddd;
      }
      .signatures {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
      }
      .signature-box {
        text-align: center;
        width: 250px;
      }
      .signature-line {
        border-top: 1px solid black;
        margin-top: 40px;
        padding-top: 5px;
      }
      .disclaimer {
        text-align: center;
        font-size: 10px;
        color: gray;
        margin-top: 20px;
      }
      .selected {
        color: #27ae60;
        font-weight: bold;
      }
      .waitlist {
        color: #e67e22;
        font-weight: bold;
      }
      .awarded {
        color: #8e44ad;
        font-weight: bold;
      }
      .your-rank {
        background: #dbeafe;
        font-weight: bold;
      }
    </style>
  `;

  let tableHeaders = `
    <th>Rank</th>
    <th>Student Name</th>
    <th>Registration No</th>
    <th>Score</th>
  `;
  
  if (isTiered) {
    tableHeaders += `
      <th>Awarded Tier</th>
      <th>Benefit</th>
    `;
  }
  tableHeaders += `<th>Status</th>`;

  let tableRows = '';
  if (isTiered) {
    tableRows = meritList.map(item => {
      let statusClass = '';
      if (item.status === 'selected') statusClass = 'selected';
      else if (item.status === 'waitlist') statusClass = 'waitlist';
      else if (item.status === 'awarded') statusClass = 'awarded';
      
      const isCurrentStudent = item.student_regno === studentRegNo;
      const rowClass = isCurrentStudent ? 'class="your-rank"' : '';
      
      return `
        <tr ${rowClass}>
          <td><b>${item.rank}</b>${isCurrentStudent ? ' <span style="background:#dbeafe; padding:2px 6px; border-radius:12px; font-size:10px;">You</span>' : ''}</td>
          <td>${item.student_name || item.student_regno}</td>
          <td>${item.student_regno}</td>
          <td><b>${item.total_score.toFixed(1)}%</b></td>
          <td>${item.award_tier || '-'}</td>
          <td>${item.award_description || '-'}</td>
          <td class="${statusClass}">${item.status.toUpperCase()}</td>
        </tr>
      `;
    }).join('');
  } else {
    tableRows = meritList.map(item => {
      let statusClass = '';
      if (item.status === 'selected') statusClass = 'selected';
      else if (item.status === 'waitlist') statusClass = 'waitlist';
      else if (item.status === 'awarded') statusClass = 'awarded';
      
      const isCurrentStudent = item.student_regno === studentRegNo;
      const rowClass = isCurrentStudent ? 'class="your-rank"' : '';
      
      return `
        <tr ${rowClass}>
          <td><b>${item.rank}</b>${isCurrentStudent ? ' <span style="background:#dbeafe; padding:2px 6px; border-radius:12px; font-size:10px;">You</span>' : ''}</td>
          <td>${item.student_name || item.student_regno}</td>
          <td>${item.student_regno}</td>
          <td><b>${item.total_score.toFixed(1)}%</b></td>
          <td class="${statusClass}">${item.status.toUpperCase()}</td>
        </tr>
      `;
    }).join('');
  }

  const selectedCount = meritList.filter(m => m.status === 'selected' || m.status === 'awarded').length;
  const totalApplicants = meritList.length;
  const waitlistCount = meritList.filter(m => m.status === 'waitlist').length;

  // Find current student's rank for highlighting
  const currentStudentRank = studentEntry?.rank;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Merit List - ${scholarship?.title}</title>
        ${styles}
      </head>
      <body>
        <div class="header">
          <div class="logo-title-row">
            <img src="${logoUrl}" alt="COMSATS Logo" class="logo" onerror="this.style.display='none'">
            <div class="university-name">COMSATS UNIVERSITY ISLAMABAD</div>
          </div>
          <div class="campus-name">ABBOTTABAD CAMPUS</div>
        </div>

        <div class="document-title">MERIT LIST</div>
        
        <div class="scholarship-info">
          <div class="scholarship-title">${scholarship?.title}</div>
          <div class="meta-info">Generated: ${currentDate}</div>
        </div>

        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer-stats">
          <span><b>Total Applicants:</b> ${totalApplicants}</span>
          <span><b>Total Selected:</b> ${selectedCount}</span>
          <span><b>Waitlist:</b> ${waitlistCount}</span>
        </div>

        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>Registrar</div>
            <div style="font-size: 11px;">COMSATS University Islamabad</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>Director</div>
            <div style="font-size: 11px;">Abbottabad Campus</div>
          </div>
        </div>

        <div class="disclaimer">
          * This is a system generated document. No signature is required. *
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

  const downloadAsCSV = () => {
    let headers = ['Rank', 'Student Name', 'Reg No', 'Score', 'Status'];
    if (isTiered) {
      headers = ['Rank', 'Student Name', 'Reg No', 'Score', 'Awarded Tier', 'Benefit', 'Status'];
    }

    let rows = meritList.map(item => {
      if (isTiered) {
        return [
          item.rank,
          item.student_name || item.student_regno,
          item.student_regno,
          item.total_score,
          item.award_tier || '-',
          item.award_description || '-',
          item.status
        ];
      }
      return [
        item.rank,
        item.student_name || item.student_regno,
        item.student_regno,
        item.total_score,
        item.status
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merit-list-${scholarship?.title.replace(/\s+/g, '-')}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string, isCurrentStudent: boolean) => {
    const baseClass = "px-3 py-1 text-xs rounded-full font-medium w-fit";
    
    if (isCurrentStudent) {
      switch(status) {
        case 'selected':
        case 'awarded':
          return <span className={`${baseClass} bg-green-100 text-green-800 border border-green-500`}>Selected</span>;
        case 'waitlist':
          return <span className={`${baseClass} bg-yellow-100 text-yellow-800 border border-yellow-500`}>Waitlist</span>;
        default:
          return <span className={`${baseClass} bg-gray-100 text-gray-800 border border-gray-500`}>Pending</span>;
      }
    }
    
    switch(status) {
      case 'selected':
      case 'awarded':
        return <span className={`${baseClass} bg-green-100 text-green-800`}>Selected</span>;
      case 'waitlist':
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>Waitlist</span>;
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
            Back
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Student Status Card - Simplified */}
        {studentEntry && (
          <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Merit Position</h2>
                  <p className="text-gray-500 text-sm">{scholarship?.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">#{studentEntry.rank}</div>
                <div className="text-xs text-gray-500">Rank</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Your Score</div>
                <div className="text-xl font-bold text-gray-900">{studentEntry.total_score}%</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Cutoff Score</div>
                <div className="text-xl font-bold text-gray-900">{cutoffScore.toFixed(1)}%</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1">{getStatusBadge(studentEntry.status, true)}</div>
              </div>
            </div>
            {isTiered && studentEntry.award_tier && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <p className="text-sm">
                    <span className="font-semibold text-purple-800">{studentEntry.award_tier}</span>
                    <span className="text-purple-600 ml-2">{studentEntry.award_description}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scholarship Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{scholarship?.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Deadline: {new Date(scholarship?.deadline || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>Seats: {isTiered ? 'Tiered' : scholarship?.number_of_awards}</span>
                </div>
                {isTiered && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Tiered</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadAsCSV}
                className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900 text-sm"
              >
                <Download size={16} />
                CSV
              </button>
              <button
                onClick={printMeritList}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Simplified */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-xs text-gray-500">Total Applicants</div>
            <div className="text-2xl font-bold text-gray-900">{meritList.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-xs text-gray-500">Selected</div>
            <div className="text-2xl font-bold text-green-600">{selectedCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-xs text-gray-500">Waitlist</div>
            <div className="text-2xl font-bold text-yellow-600">
              {meritList.filter(m => m.status === 'waitlist').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-xs text-gray-500">Cutoff Score</div>
            <div className="text-2xl font-bold text-blue-600">{cutoffScore.toFixed(1)}%</div>
          </div>
        </div>

        {/* Merit List Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm">Merit List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-16 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="w-48 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="w-32 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                  <th className="w-20 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  {isTiered && (
                    <>
                      <th className="w-32 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Awarded Tier</th>
                      <th className="w-48 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Benefit</th>
                    </>
                  )}
                  <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {meritList.map((entry) => {
                  const isCurrentStudent = entry.student_regno === studentRegNo;
                  return (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 ${isCurrentStudent ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
                          entry.rank <= 3 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : entry.status === 'selected' || entry.status === 'awarded'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.rank}
                        </span>
                       </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900 truncate max-w-[180px]" title={entry.student_name || entry.student_regno}>
                          {entry.student_name || entry.student_regno}
                          {isCurrentStudent && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">You</span>}
                        </div>
                       </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{entry.student_regno}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{entry.total_score.toFixed(1)}%</td>
                      {isTiered && (
                        <>
                          <td className="px-4 py-3 font-medium text-blue-600 text-sm">{entry.award_tier || '-'}</td>
                          <td className="px-4 py-3 text-gray-500 text-sm truncate max-w-[180px]" title={entry.award_description || '-'}>
                            {entry.award_description || '-'}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3">
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