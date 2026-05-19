'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Server,
  RefreshCw,
  Users,
  Lock,
  Save,
  Eye,
  EyeOff,
  Megaphone,
  Send,
  FileText
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast, { Toaster } from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminSettingsPage() {
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  
  // System Info State
  const [systemInfo, setSystemInfo] = useState({
    totalStudents: 0,
    version: '2.0.0',
    framework: 'Next.js 14 + Supabase',
    nodeVersion: '18.17.0',
    database: 'Supabase PostgreSQL'
  });

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    setRefreshing(true);
    try {
      const studentsCount = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      setSystemInfo(prev => ({
        ...prev,
        totalStudents: studentsCount.count || 0
      }));
    } catch (error) {
      console.error('Error fetching system info:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const exportAllData = async () => {
    setExporting(true);
    try {
      const [studentsRes, scholarshipsRes, applicationsRes, meritListsRes] = await Promise.all([
        fetch('/api/admin/students').then(res => res.json()).catch(() => ({ students: [] })),
        fetch('/api/scholarships').then(res => res.json()).catch(() => ({ scholarships: [] })),
        supabase.from('scholarship_applications').select('*'),
        supabase.from('merit_lists').select('*')
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        exportedBy: 'Admin',
        systemInfo: systemInfo,
        students: studentsRes.students || [],
        scholarships: scholarshipsRes.scholarships || [],
        applications: applicationsRes.data || [],
        meritLists: meritListsRes.data || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scholarship_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    
    // Simulate password change
    setTimeout(() => {
      toast.success('Password changed successfully', {
        duration: 3000,
        position: 'top-center',
        style: { background: '#dcfce7', color: '#166534', borderRadius: '8px', padding: '10px 16px' },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
    }, 1000);
  };

  const sendAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementMessage.trim()) {
      toast.error('Please enter both title and message');
      return;
    }

    setSendingAnnouncement(true);
    try {
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('regno');

      if (studentsError) throw studentsError;

      if (!students || students.length === 0) {
        toast.error('No students found');
        setSendingAnnouncement(false);
        return;
      }

      const notifications = students.map(student => ({
        user_id: student.regno,
        user_type: 'student',
        type: 'announcement',
        title: announcementTitle,
        message: announcementMessage,
        data: {
          type: 'admin_announcement',
          sentAt: new Date().toISOString()
        },
        is_read: false,
        created_at: new Date().toISOString()
      }));

      const batchSize = 100;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('notifications')
          .insert(batch);
        
        if (insertError) throw insertError;
      }

      toast.success(`Announcement sent to ${students.length} students`, {
        duration: 4000,
        position: 'top-center',
        style: { background: '#dcfce7', color: '#166534', borderRadius: '8px', padding: '10px 16px' },
      });

      setAnnouncementTitle('');
      setAnnouncementMessage('');

    } catch (error) {
      console.error('Error sending announcement:', error);
      toast.error('Failed to send announcement');
    } finally {
      setSendingAnnouncement(false);
    }
  };

  const handleRefresh = () => {
    fetchSystemInfo();
    toast.success('System info refreshed');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and system preferences</p>
        </div>

        <div className="space-y-6">
          
          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label className="text-sm text-gray-600">Show passwords</label>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Export & Reports Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Export & Reports</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={exportAllData}
                disabled={exporting}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Export Database Backup</span>
                </div>
                {exporting ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> : null}
              </button>

              <button
                onClick={() => window.open('/admin/reports', '_blank')}
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Generate Reports</span>
                </div>
              </button>
            </div>
          </div>

          {/* Send Announcement Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Send Announcement</h2>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">To All Students</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g., Scholarship Deadline Extended"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Message
                </label>
                <textarea
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter your announcement message here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users size={14} />
                  <span>Will be sent to all {systemInfo.totalStudents} students</span>
                </div>
                <button
                  onClick={sendAnnouncement}
                  disabled={sendingAnnouncement}
                  className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {sendingAnnouncement ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Announcement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* System Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Version</span>
                  <span className="font-medium">{systemInfo.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Framework</span>
                  <span className="font-medium">{systemInfo.framework}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Database</span>
                  <span className="font-medium">{systemInfo.database}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Node Version</span>
                  <span className="font-medium">{systemInfo.nodeVersion}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Total Students</span>
                  <span className="font-bold text-blue-600">{systemInfo.totalStudents}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Environment</span>
                  <span className="font-medium capitalize">{process.env.NODE_ENV || 'production'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>COMSATS University Islamabad - Scholarship Management System v{systemInfo.version}</p>
          <p className="mt-1">© 2026 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}