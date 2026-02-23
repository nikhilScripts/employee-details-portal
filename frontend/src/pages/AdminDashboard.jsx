import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leaveApi, auth } from '../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState([]);
  const [report, setReport] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [filterStatus, filterYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [requestsRes, statsRes, usersRes] = await Promise.all([
        leaveApi.getAllRequests({ status: filterStatus || undefined, year: filterYear }),
        leaveApi.getStats(filterYear),
        auth.getUsers()
      ]);
      setRequests(requestsRes.data.requests || []);
      setStats(statsRes.data.stats || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async () => {
    try {
      const res = await leaveApi.getReport({ year: filterYear });
      setReport(res.data.report || []);
    } catch (err) {
      setError('Failed to load report');
    }
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      loadReport();
    }
  }, [activeTab, filterYear]);

  const handleApprove = async (id) => {
    try {
      await leaveApi.approveRequest(id);
      setSuccess('Leave request approved');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    try {
      await leaveApi.rejectRequest(id, reason);
      setSuccess('Leave request rejected');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject');
    }
  };

  const handleExport = async () => {
    try {
      const response = await leaveApi.exportReport({ year: filterYear });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leave-report-${filterYear}.csv`;
      a.click();
    } catch (err) {
      setError('Failed to export report');
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.displayName}</span>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">ADMIN</span>
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
          <Link to="/" className="bg-white px-4 py-2 rounded shadow hover:bg-gray-50">
            Dashboard
          </Link>
          <Link to="/employees" className="bg-white px-4 py-2 rounded shadow hover:bg-gray-50">
            Manage Employees
          </Link>
          <Link to="/employees/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Add Employee
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4">
            {['requests', 'reports', 'stats', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 border-b-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'requests' ? 'Leave Requests' : tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Leave Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            <div className="mb-4 flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="border rounded px-3 py-2"
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="7" className="px-4 py-4 text-center">Loading...</td></tr>
                  ) : requests.length === 0 ? (
                    <tr><td colSpan="7" className="px-4 py-4 text-center text-gray-500">No requests found</td></tr>
                  ) : (
                    requests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-3">{request.user_name}<br/><span className="text-sm text-gray-500">{request.user_email}</span></td>
                        <td className="px-4 py-3">{request.leave_type_name}</td>
                        <td className="px-4 py-3">{request.start_date}</td>
                        <td className="px-4 py-3">{request.end_date}</td>
                        <td className="px-4 py-3">{request.days_count}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {request.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApprove(request.id)} className="text-green-600 hover:text-green-800 text-sm">Approve</button>
                              <button onClick={() => handleReject(request.id)} className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="mb-4 flex gap-4 items-center">
              <select value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))} className="border rounded px-3 py-2">
                {[2024, 2025, 2026, 2027].map((year) => (<option key={year} value={year}>{year}</option>))}
              </select>
              <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Export CSV
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Taken</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">{row.display_name}</td>
                      <td className="px-4 py-3">{row.leave_type}</td>
                      <td className="px-4 py-3">{row.approved_count || 0}</td>
                      <td className="px-4 py-3">{row.rejected_count || 0}</td>
                      <td className="px-4 py-3">{row.pending_count || 0}</td>
                      <td className="px-4 py-3">{row.total_days_taken || 0}</td>
                      <td className="px-4 py-3">{row.remaining_days || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium text-gray-700 mb-2">{stat.leave_type}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Employees:</span> {stat.employees_used}</div>
                  <div><span className="text-gray-500">Days Taken:</span> {stat.total_days_taken || 0}</div>
                  <div><span className="text-yellow-600">Pending:</span> {stat.pending_requests}</div>
                  <div><span className="text-green-600">Approved:</span> {stat.approved_requests}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3">{u.display_name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.last_login || 'Never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}