'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  // Unwrap params Promise
  useEffect(() => {
    params.then((unwrappedParams) => {
      setCode(unwrappedParams.code);
    });
  }, [params]);

  useEffect(() => {
    if (!code) return;

    const verifyCode = async () => {
      try {
        const response = await fetch(`/api/verify/${code}`);
        const result = await response.json();

        console.log('API Response:', result);

        if (!response.ok || !result.valid) {
          throw new Error(result.error || 'Invalid verification code');
        }

        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyCode();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Verification</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">Verification ID: {code}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-22">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-center">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white">Verified Scholarship</h1>
            <p className="text-green-100 mt-2">Official scholarship from COMSATS University</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">VALID SCHOLARSHIP</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Student Registration Number</p>
                <p className="text-lg font-mono font-semibold text-gray-900">{data.student_regno}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Scholarship Awarded</p>
                <p className="text-lg font-semibold text-green-700">{data.scholarship_title}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Rank</p>
                <p className="text-lg font-bold text-blue-600">#{data.rank}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold text-green-600">SELECTED</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                This scholarship has been verified by COMSATS University Islamabad.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Verification Code: <span className="font-mono">{code}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center border-t">
            <p className="text-xs text-gray-500">
              COMSATS UNIVERSITY ISLAMABAD - ABBOTTABAD CAMPUS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}