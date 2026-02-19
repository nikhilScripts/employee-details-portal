import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeApi, analyticsApi } from '../services/api';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '' });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    analyticsApi.getDepartments().then(res => setDepartments(res.data.data));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [meta.page, filters]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page: meta.page,
        limit: 10,
        ...(search && { search }),
        ...(filters.department && { department: filters.department }),
        ...(filters.status && { status: filters.status })
      };
      const res = await employeeApi.getAll(params);
      setEmployees(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setMeta(m => ({ ...m, page: 1 }));
    fetchEmployees();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await employeeApi.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <Link
          to="/employees/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          + Add Employee
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.department}
            onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No employees found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hire Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/employees/${emp.id}`} className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{emp.fullName}</div>
                        <div className="text-sm text-gray-500">{emp.email}</div>
                        <div className="text-xs text-gray-400">{emp.employeeId}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{emp.department}</div>
                    <div className="text-sm text-gray-500">{emp.position || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      emp.employmentStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      emp.employmentStatus === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {emp.employmentStatus}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{emp.employmentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(emp.hireDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/employees/${emp.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </Link>
                    <Link to={`/employees/${emp.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(emp.id, emp.fullName)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setMeta(m => ({ ...m, page: Math.max(1, m.page - 1) }))}
                disabled={meta.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setMeta(m => ({ ...m, page: Math.min(m.totalPages, m.page + 1) }))}
                disabled={meta.page === meta.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{meta.page}</span> of{' '}
                  <span className="font-medium">{meta.totalPages}</span> ({meta.total} total)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setMeta(m => ({ ...m, page: Math.max(1, m.page - 1) }))}
                    disabled={meta.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setMeta(m => ({ ...m, page: Math.min(m.totalPages, m.page + 1) }))}
                    disabled={meta.page === meta.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeList;