'use client';

import { useState } from 'react';
import { SettingsIcon, Save, Bell, Lock, Users, Mail, Globe } from 'lucide-react';

export default function SimpleSettingsPage() {
  const [settings, setSettings] = useState({
    email: 'admin@comsats.edu.pk',
    notifications: true,
    darkMode: false,
    language: 'en',
    timezone: 'Asia/Karachi',
  });

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Basic configuration options</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-500" />
              <div>
                <span className="font-medium">Notifications</span>
                <p className="text-sm text-gray-600">Receive email notifications</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
              className="w-5 h-5 text-blue-600"
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <span className="font-medium">Dark Mode</span>
              <p className="text-sm text-gray-600">Use dark theme</p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
              className="w-5 h-5 text-blue-600"
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Globe size={16} />
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Asia/Karachi">Karachi (UTC+5)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}