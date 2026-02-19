import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeApi } from '../services/api';

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await employeeApi.getById(id);
        setEmployee(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load employee');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      try {
        await employeeApi.delete(id);
        navigate('/employees');
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <Link to="/employees" className="text-blue-600 hover:underline mt-2 inline-block">← Back to Employees</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.fullName}</h1>
            <p className="text-gray-500">{employee.employeeId}</p>
            <p className="text-gray-600">{employee.position || employee.department}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/employees/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`mailto:${employee.email}`} className="text-blue-600 hover:underline">{employee.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.employeeId}</dd>
              </div>
            </dl>
          </div>

          {/* Employment Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.department}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.position || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.employmentStatus === 'Active' ? 'bg-green-100 text-green-800' :
                    employee.employmentStatus === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {employee.employmentStatus}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.employmentType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(employee.hireDate).toLocaleDateString()}</dd>
              </div>
              {employee.terminationDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Termination Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(employee.terminationDate).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Addresses */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Addresses</h2>
            {employee.addresses && employee.addresses.length > 0 ? (
              <div className="space-y-4">
                {employee.addresses.map((addr) => (
                  <div key={addr.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm font-medium text-gray-500">{addr.addressType} Address</p>
                    <p className="text-sm text-gray-900">{addr.streetAddress}</p>
                    <p className="text-sm text-gray-900">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-sm text-gray-900">{addr.country}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No addresses on file</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Manager */}
          {employee.manager && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Reports To</h2>
              <Link to={`/employees/${employee.manager.id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded">
                <div className="h-10 w-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium">
                  {employee.manager.firstName[0]}{employee.manager.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{employee.manager.fullName}</p>
                  <p className="text-xs text-gray-500">{employee.manager.position || employee.manager.department}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Direct Reports */}
          {employee.directReports && employee.directReports.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Direct Reports ({employee.directReports.length})</h2>
              <div className="space-y-2">
                {employee.directReports.map((report) => (
                  <Link key={report.id} to={`/employees/${report.id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded">
                    <div className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {report.firstName[0]}{report.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{report.fullName}</p>
                      <p className="text-xs text-gray-500">{report.position || report.department}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to={`/employees/${id}/edit`}
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit Employee
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;