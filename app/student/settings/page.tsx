'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();  // ✅ Get user from auth context
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      general: ''
    };
    let isValid = true;

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (formData.currentPassword === formData.newPassword && formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // ✅ Get regNo from auth context
    const regNo = user?.regno;
    
    if (!regNo) {
      setErrors(prev => ({ ...prev, general: 'Session expired. Please login again.' }));
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const response = await fetch('/api/student/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          regNo: regNo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setSuccess(false), 3000);

    } catch (error: any) {
      setErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, color: 'bg-gray-200', text: '' };
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;

    if (score >= 75) return { strength: score, color: 'bg-green-500', text: 'Strong' };
    if (score >= 50) return { strength: score, color: 'bg-yellow-500', text: 'Medium' };
    if (score >= 25) return { strength: score, color: 'bg-orange-500', text: 'Weak' };
    return { strength: score, color: 'bg-red-500', text: 'Very Weak' };
  };

  const strength = passwordStrength(formData.newPassword);

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
            <p className="text-gray-600">Update your account password</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <p className="font-medium text-green-800">Password changed successfully!</p>
            <p className="text-sm text-green-700">Your password has been updated.</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="text-red-600" size={20} />
          <p className="text-red-800">{errors.general}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 pr-12`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle size={14} />
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 pr-12`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Password strength</span>
                  <span className={`font-medium ${
                    strength.text === 'Strong' ? 'text-green-600' :
                    strength.text === 'Medium' ? 'text-yellow-600' :
                    strength.text === 'Weak' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {strength.text}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color}`} style={{ width: `${strength.strength}%` }} />
                </div>
              </div>
            )}
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle size={14} />
                {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 pr-12`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle size={14} />
                {errors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && formData.newPassword && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={14} />
                Passwords match
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
              disabled={isLoading}
            >
              <X size={20} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Security Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use a strong, unique password</li>
            <li>• Don't reuse passwords from other sites</li>
            <li>• Consider using a password manager</li>
            <li>• Change your password every 3-6 months</li>
          </ul>
        </div>
      </div>
    </div>
  );
}