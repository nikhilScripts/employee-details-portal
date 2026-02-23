import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, isAdmin, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/user');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Portal</h1>
          <p className="text-gray-600">Sign in with your Microsoft account</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 21 21" fill="currentColor">
            <path d="M0 0h10v10H0z" fill="#f25022"/>
            <path d="M11 0h10v10H11z" fill="#7fba00"/>
            <path d="M0 11h10v10H0z" fill="#00a4ef"/>
            <path d="M11 11h10v10H11z" fill="#ffb900"/>
          </svg>
          Sign in with Microsoft
        </button>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Employee Management
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Leave Tracker & Approvals
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Leave Reports & Analytics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Role-based Access Control
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}