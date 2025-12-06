'use client';

import { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Filter, 
  CheckCheck, 
  Trash2,
  Clock,
  User,
  Award,
  FileText,
  DollarSign
} from 'lucide-react';

type NotificationType = 'success' | 'warning' | 'error' | 'info';
type NotificationCategory = 'system' | 'application' | 'merit' | 'allocation';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Scholarship Application',
      message: 'Abdul Basit has submitted an application for Academic Excellence Scholarship',
      type: 'info',
      category: 'application',
      timestamp: '10 minutes ago',
      read: false,
      icon: FileText
    },
    {
      id: 2,
      title: 'Merit List Generated',
      message: 'Fall 2024 merit list has been successfully generated with 150 students',
      type: 'success',
      category: 'merit',
      timestamp: '2 hours ago',
      read: false,
      icon: Award
    },
    {
      id: 3,
      title: 'Allocation Completed',
      message: 'Scholarship allocation for Spring 2024 has been completed',
      type: 'success',
      category: 'allocation',
      timestamp: '1 day ago',
      read: true,
      icon: DollarSign
    },
    {
      id: 4,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tomorrow from 2:00 AM to 4:00 AM',
      type: 'warning',
      category: 'system',
      timestamp: '1 day ago',
      read: true,
      icon: AlertCircle
    },
    {
      id: 5,
      title: 'Document Verification Required',
      message: '5 applications are pending document verification',
      type: 'warning',
      category: 'application',
      timestamp: '2 days ago',
      read: true,
      icon: FileText
    },
    {
      id: 6,
      title: 'New Student Registered',
      message: 'Sara khan has registered in the scholarship portal',
      type: 'info',
      category: 'system',
      timestamp: '3 days ago',
      read: true,
      icon: User
    },
    {
      id: 7,
      title: 'Merit Calculation Failed',
      message: 'Error occurred while calculating scores for 3 applications',
      type: 'error',
      category: 'merit',
      timestamp: '4 days ago',
      read: true,
      icon: XCircle
    },
    {
      id: 8,
      title: 'Report Generated',
      message: 'Monthly scholarship report has been generated and is ready for download',
      type: 'success',
      category: 'system',
      timestamp: '1 week ago',
      read: true,
      icon: FileText
    },
  ]);

  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all');
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [showRead, setShowRead] = useState(true);

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = filter === 'all' || notification.category === filter;
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesReadStatus = showRead || !notification.read;
    return matchesCategory && matchesType && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(notifications.filter(notification => !notification.read));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'application': return <FileText className="w-4 h-4" />;
      case 'merit': return <Award className="w-4 h-4" />;
      case 'allocation': return <DollarSign className="w-4 h-4" />;
      case 'system': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Manage and view all system notifications</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
            <div className="relative">
              <Bell className="w-8 h-8 text-yellow-500" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{unreadCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="text-gray-500" size={20} />
              <span className="font-medium">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('system')}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filter === 'system' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <Bell size={14} />
                System
              </button>
              <button
                onClick={() => setFilter('application')}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filter === 'application' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <FileText size={14} />
                Applications
              </button>
              <button
                onClick={() => setFilter('merit')}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filter === 'merit' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <Award size={14} />
                Merit
              </button>
              <button
                onClick={() => setFilter('allocation')}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filter === 'allocation' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <DollarSign size={14} />
                Allocation
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowRead(!showRead)}
              className={`px-4 py-2 rounded-lg border ${showRead ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-blue-100 text-blue-800 border-blue-300'}`}
            >
              {showRead ? 'Hide Read' : 'Show Read'}
            </button>
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <CheckCheck size={20} />
              Mark All Read
            </button>
            <button
              onClick={clearAllRead}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Trash2 size={20} />
              Clear Read
            </button>
          </div>
        </div>

        {/* Type Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-sm rounded-full ${filterType === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            All Types
          </button>
          <button
            onClick={() => setFilterType('success')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filterType === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <CheckCircle size={14} />
            Success
          </button>
          <button
            onClick={() => setFilterType('warning')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filterType === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <AlertCircle size={14} />
            Warning
          </button>
          <button
            onClick={() => setFilterType('error')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filterType === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <XCircle size={14} />
            Error
          </button>
          <button
            onClick={() => setFilterType('info')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filterType === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <Info size={14} />
            Info
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">Try changing your filters or check back later</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition ${getTypeColor(notification.type)} ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${getTypeColor(notification.type)}`}>
                            {getCategoryIcon(notification.category)}
                            <span className="capitalize">{notification.category}</span>
                          </span>
                          {!notification.read && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Mark as read"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete notification"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {filteredNotifications.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Unread</div>
                <div className="font-bold text-lg text-blue-600">{unreadCount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Today</div>
                <div className="font-bold text-lg text-green-600">2</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">This Week</div>
                <div className="font-bold text-lg text-purple-600">8</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}