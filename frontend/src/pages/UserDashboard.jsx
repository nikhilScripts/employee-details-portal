import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leaveApi } from '../services/api';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, requestsRes, typesRes] = await Promise.all([
        leaveApi.getMyBalance(),
        leaveApi.getMyRequests(),
        leaveApi.getTypes()
      ]);
      setBalances(balanceRes.data.balances || []);
      setRequests(requestsRes.data.requests || []);
      setLeaveTypes(typesRes.data.leaveTypes || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await leaveApi.createRequest(formData);
      setSuccess('Leave request submitted successfully!');
      setShowApplyModal(false);
      setFormData({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    }
  };

  const handleCancelRequest = async (id) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    try {
      await leaveApi.cancelRequest(id);
      setSuccess('Leave request cancelled');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Employee Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.displayName}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">USER</span>
            <button onClick={logout} className="text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
            <button onClick={() => setSuccess('')} className="float-right">&times;</button>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-6 flex gap-4">
          <Link to="/employees" className="bg-white px-4 py-2 rounded shadow hover:bg-gray-50">
            View Employees
          </Link>
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Apply for Leave
          </button>
        </div>

        {/* Leave Balances */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Leave Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {balances.map((balance) => (
              <div key={balance.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium text-gray-700">{balance.leave_type_name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {balance.total_days - balance.used_days}
                  </span>
                  <span className="text-gray-500 text-sm"> / {balance.total_days} days</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Used: {balance.used_days} days
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4">{request.leave_type_name}</td>
                      <td className="px-6 py-4">{request.start_date}</td>
                      <td className="px-6 py-4">{request.end_date}</td>
                      <td className="px-6 py-4">{request.days_count}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(request.status === 'PENDING' || request.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
            <form onSubmit={handleApplyLeave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  required
                  value={formData.leaveTypeId}
                  onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}