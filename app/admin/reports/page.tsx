'use client';

import { useEffect, useState } from 'react';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('applications');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reports?type=${reportType}`);
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      setError('Failed to load report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;
    
    let csvContent = "";
    let headers = "";
    let rows: any[] = [];

    if (reportType === 'applications' && data.applications) {
      headers = "Student Name,Reg No,Email,Level,Scholarship,Status,Submitted Date\n";
      rows = data.applications.map((app: any) => [
        `"${app.students?.full_name || 'N/A'}"`,
        app.student_regno,
        `"${app.students?.email || 'N/A'}"`,
        `"${app.students?.level || 'N/A'}"`,
        `"${app.scholarships?.title || 'N/A'}"`,
        app.status,
        new Date(app.created_at).toLocaleDateString()
      ]);
    } 
    else if (reportType === 'scholarship_wise' && data.scholarships) {
      headers = "Scholarship,Deadline,Total Apps,Approved,Pending,Rejected,Awards Available\n";
      rows = data.scholarships.map((sch: any) => [
        `"${sch.title}"`,
        sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A',
        sch.totalApplications,
        sch.approved,
        sch.pending,
        sch.rejected,
        sch.numberOfAwards || 'N/A'
      ]);
    }
    else if (reportType === 'student_wise' && data.students) {
      headers = "Reg No,Student Name,Email,Level,Total Apps,Approved,Pending,Rejected\n";
      rows = data.students.map((student: any) => [
        student.regno,
        `"${student.full_name}"`,
        `"${student.email}"`,
        `"${student.level}"`,
        student.totalApplications,
        student.approved,
        student.pending,
        student.rejected
      ]);
    }
    else if (reportType === 'merit_list' && data.meritLists) {
      headers = "Rank,Scholarship,Student Name,Reg No,Total Score,Status\n";
      rows = data.meritLists.map((item: any) => [
        item.rank,
        `"${item.scholarships?.title || 'N/A'}"`,
        `"${item.students?.full_name || 'N/A'}"`,
        item.student_regno,
        item.total_score || 'N/A',
        item.status
      ]);
    }

    csvContent = headers + rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = document.querySelector('.print-area');
    if (!printContent) return;
    
    const logoUrl = `${window.location.protocol}//${window.location.host}/images/comsats.jpg`;
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const reportTitle = reportType.replace(/_/g, ' ').toUpperCase();
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print');
      return;
    }

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
        .report-info {
          text-align: center;
          margin: 20px 0;
          padding: 10px;
          background: #f8f9fa;
        }
        .report-type {
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
          font-size: 12px;
        }
        td {
          padding: 8px;
          text-align: center;
          border-bottom: 1px solid #ddd;
          font-size: 11px;
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
        .status-pending { color: #d97706; font-weight: bold; }
        .status-approved { color: #10b981; font-weight: bold; }
        .status-rejected { color: #ef4444; font-weight: bold; }
        .summary-card {
          text-align: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 10px;
        }
        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #1a5276;
        }
        .summary-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .summary-grid {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin: 20px 0;
        }
      </style>
    `;

    // Get the table HTML from the current page
    const tableHtml = printContent.querySelector('table')?.outerHTML || '';
    const summaryHtml = printContent.querySelector('.grid')?.outerHTML || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle} Report</title>
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

          <div class="document-title">${reportTitle} REPORT</div>
          
          <div class="report-info">
            <div class="report-type">${reportTitle.replace(/_/g, ' ')}</div>
            <div class="meta-info">Generated: ${currentDate}</div>
          </div>

          ${reportType === 'summary' ? `
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-value">${data?.totalStudents || 0}</div>
                <div class="summary-label">Total Students</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">${data?.totalScholarships || 0}</div>
                <div class="summary-label">Total Scholarships</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">${data?.totalApplications || 0}</div>
                <div class="summary-label">Total Applications</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">${data?.rejectionRate || 0}%</div>
                <div class="summary-label">Rejection Rate</div>
              </div>
            </div>
          ` : `
            ${tableHtml}
          `}

          <div class="footer-stats">
            <span><b>Total Records:</b> ${reportType === 'summary' ? '4' : data?.applications?.length || data?.scholarships?.length || data?.students?.length || data?.meritLists?.length || 0}</span>
            <span><b>Generated On:</b> ${currentDate}</span>
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

  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-rose-100 text-rose-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View and export detailed reports from your scholarship data</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Report</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full md:w-64 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="applications">All Applications Report</option>
                <option value="scholarship_wise">Scholarship-wise Report</option>
                <option value="student_wise">Student-wise Report</option>
                <option value="merit_list">Merit Lists Report</option>
                <option value="date_wise">Date-wise Report</option>
                <option value="summary">Summary Report</option>
              </select>
            </div>
            <button
              onClick={exportToCSV}
              disabled={!data || loading}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all shadow-sm"
            >
              Export to CSV
            </button>
            <button
              onClick={handlePrint}
              disabled={!data || loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all shadow-sm"
            >
              Print
            </button>
            <button
              onClick={fetchReportData}
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
            Error: {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-gray-500">Loading report data...</p>
          </div>
        )}

        {/* Print Area - Everything inside this div will be printed */}
        <div className="print-area">
          {/* Summary Report */}
          {!loading && !error && reportType === 'summary' && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.totalStudents || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
                <p className="text-sm text-gray-500">Total Scholarships</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.totalScholarships || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.totalApplications || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                <p className="text-sm text-gray-500">Rejection Rate</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.rejectionRate || 0}%</p>
              </div>
            </div>
          )}

          {/* Applications Report */}
          {!loading && !error && reportType === 'applications' && data?.applications && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
              <div className="grid grid-cols-4 gap-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{data.statusCounts?.total || 0}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{data.statusCounts?.pending || 0}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{data.statusCounts?.approved || 0}</p>
                  <p className="text-sm text-gray-500">Approved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-rose-600">{data.statusCounts?.rejected || 0}</p>
                  <p className="text-sm text-gray-500">Rejected</p>
                </div>
              </div>

              {data.applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No applications found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left text-sm font-semibold rounded-tl-lg">Student Name</th>
                        <th className="p-3 text-left text-sm font-semibold">Reg No</th>
                        <th className="p-3 text-left text-sm font-semibold">Email</th>
                        <th className="p-3 text-left text-sm font-semibold">Level</th>
                        <th className="p-3 text-left text-sm font-semibold">Scholarship</th>
                        <th className="p-3 text-left text-sm font-semibold">Status</th>
                        <th className="p-3 text-left text-sm font-semibold rounded-tr-lg">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.applications.map((app: any, idx: number) => (
                        <tr key={idx} className={`border-b hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="p-3 text-sm font-medium text-gray-800">{app.students?.full_name || 'N/A'}</td>
                          <td className="p-3 text-sm text-gray-600">{app.student_regno}</td>
                          <td className="p-3 text-sm text-gray-600">{app.students?.email || 'N/A'}</td>
                          <td className="p-3 text-sm text-gray-600">{app.students?.level || 'N/A'}</td>
                          <td className="p-3 text-sm text-gray-600">{app.scholarships?.title || 'N/A'}</td>
                          <td className="p-3 text-sm">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-500">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Scholarship Wise Report */}
          {!loading && !error && reportType === 'scholarship_wise' && data?.scholarships && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
              {data.scholarships.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No scholarships found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left text-sm font-semibold rounded-tl-lg">Scholarship</th>
                        <th className="p-3 text-left text-sm font-semibold">Deadline</th>
                        <th className="p-3 text-center text-sm font-semibold">Total Apps</th>
                        <th className="p-3 text-center text-sm font-semibold">Approved</th>
                        <th className="p-3 text-center text-sm font-semibold">Pending</th>
                        <th className="p-3 text-center text-sm font-semibold">Rejected</th>
                        <th className="p-3 text-center text-sm font-semibold rounded-tr-lg">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.scholarships.map((sch: any, idx: number) => (
                        <tr key={idx} className={`border-b hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="p-3 text-sm font-medium text-gray-800">{sch.title}</td>
                          <td className="p-3 text-sm text-gray-600">{sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-3 text-sm text-center font-semibold text-gray-700">{sch.totalApplications}</td>
                          <td className="p-3 text-sm text-center text-emerald-600 font-medium">{sch.approved}</td>
                          <td className="p-3 text-sm text-center text-amber-600 font-medium">{sch.pending}</td>
                          <td className="p-3 text-sm text-center text-rose-600 font-medium">{sch.rejected}</td>
                          <td className="p-3 text-sm text-center font-semibold">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sch.totalApplications > 0 && (sch.approved / sch.totalApplications) * 100 > 50 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {sch.totalApplications > 0 ? Math.round((sch.approved / sch.totalApplications) * 100) : 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Student Wise Report */}
          {!loading && !error && reportType === 'student_wise' && data?.students && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
              {data.students.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No students found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left text-sm font-semibold rounded-tl-lg">Reg No</th>
                        <th className="p-3 text-left text-sm font-semibold">Student Name</th>
                        <th className="p-3 text-left text-sm font-semibold">Email</th>
                        <th className="p-3 text-left text-sm font-semibold">Level</th>
                        <th className="p-3 text-center text-sm font-semibold">Total Apps</th>
                        <th className="p-3 text-center text-sm font-semibold">Approved</th>
                        <th className="p-3 text-center text-sm font-semibold">Pending</th>
                        <th className="p-3 text-center text-sm font-semibold rounded-tr-lg">Rejected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.students.map((student: any, idx: number) => (
                        <tr key={idx} className={`border-b hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="p-3 text-sm font-medium text-gray-800">{student.regno}</td>
                          <td className="p-3 text-sm font-medium text-gray-800">{student.full_name}</td>
                          <td className="p-3 text-sm text-gray-600">{student.email}</td>
                          <td className="p-3 text-sm text-gray-600">{student.level}</td>
                          <td className="p-3 text-sm text-center font-semibold text-gray-700">{student.totalApplications}</td>
                          <td className="p-3 text-sm text-center text-emerald-600 font-medium">{student.approved}</td>
                          <td className="p-3 text-sm text-center text-amber-600 font-medium">{student.pending}</td>
                          <td className="p-3 text-sm text-center text-rose-600 font-medium">{student.rejected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Merit List Report */}
          {!loading && !error && reportType === 'merit_list' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
              {!data?.meritLists || data.meritLists.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No merit lists generated yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-center text-sm font-semibold rounded-tl-lg">Rank</th>
                        <th className="p-3 text-left text-sm font-semibold">Scholarship</th>
                        <th className="p-3 text-left text-sm font-semibold">Student Name</th>
                        <th className="p-3 text-left text-sm font-semibold">Reg No</th>
                        <th className="p-3 text-center text-sm font-semibold">Total Score</th>
                        <th className="p-3 text-center text-sm font-semibold rounded-tr-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.meritLists.map((item: any, idx: number) => (
                        <tr key={idx} className={`border-b hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="p-3 text-sm text-center font-semibold text-gray-700">#{item.rank}</td>
                          <td className="p-3 text-sm text-gray-700">{item.scholarships?.title || 'N/A'}</td>
                          <td className="p-3 text-sm font-medium text-gray-800">{item.students?.full_name || 'N/A'}</td>
                          <td className="p-3 text-sm text-gray-600">{item.student_regno}</td>
                          <td className="p-3 text-sm text-center font-semibold text-gray-700">{item.total_score || 'N/A'}</td>
                          <td className="p-3 text-sm text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Date Wise Report */}
          {!loading && !error && reportType === 'date_wise' && data?.monthlyData && (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              {data.monthlyData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No data available</div>
              ) : (
                <>
                  <div className="space-y-5">
                    {data.monthlyData.map((month: any, idx: number) => (
                      <div key={idx} className="hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">{month.month}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{month.applications} applications</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${(month.applications / data.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex gap-5 mt-2 text-xs">
                          <span className="text-emerald-600 font-medium">Approved: {month.approved}</span>
                          <span className="text-amber-600 font-medium">Pending: {month.pending}</span>
                          <span className="text-rose-600 font-medium">Rejected: {month.rejected}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t text-center text-gray-500 text-sm bg-gray-50 p-3 rounded-lg">
                    Total Applications: <span className="font-bold text-gray-700">{data.totalApplications}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}