import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeApi, analyticsApi } from '../services/api';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Product', 'Design'];
const STATUSES = ['Active', 'Inactive', 'On Leave', 'Terminated'];
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'];

function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employmentStatus: 'Active',
    employmentType: 'Full-time',
    hireDate: new Date().toISOString().split('T')[0],
    managerId: ''
  });
  
  const [addresses, setAddresses] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    employeeApi.getManagers(id).then(res => setManagers(res.data.data));
    
    if (isEdit) {
      employeeApi.getById(id).then(res => {
        const emp = res.data.data;
        setForm({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone || '',
          department: emp.department,
          position: emp.position || '',
          employmentStatus: emp.employmentStatus,
          employmentType: emp.employmentType,
          hireDate: emp.hireDate,
          managerId: emp.managerId || ''
        });
        setAddresses(emp.addresses || []);
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.department) errs.department = 'Department is required';
    if (!form.hireDate) errs.hireDate = 'Hire date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      const data = { ...form };
      if (!data.managerId) delete data.managerId;
      if (!data.phone) delete data.phone;
      if (!data.position) delete data.position;
      
      if (!isEdit && addresses.length > 0) {
        data.addresses = addresses;
      }
      
      if (isEdit) {
        await employeeApi.update(id, data);
        navigate(`/employees/${id}`);
      } else {
        const res = await employeeApi.create(data);
        navigate(`/employees/${res.data.data.id}`);
      }
    } catch (err) {
      const error = err.response?.data?.error;
      if (error?.code === 'DUPLICATE_EMAIL') {
        setErrors({ email: 'This email is already in use' });
      } else if (error?.code === 'VALIDATION_ERROR') {
        setErrors({ submit: error.details?.join(', ') || error.message });
      } else {
        setErrors({ submit: 'Failed to save employee' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: null }));
  };

  const addAddress = () => {
    setAddresses([...addresses, {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      addressType: 'Current'
    }]);
  };

  const updateAddress = (index, field, value) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? 'Update employee information' : 'Enter the details for the new employee'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{errors.submit}</p>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department *</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.department ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="employmentStatus"
                value={form.employmentStatus}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hire Date *</label>
              <input
                type="date"
                name="hireDate"
                value={form.hireDate}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.hireDate ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.hireDate && <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager</label>
              <select
                name="managerId"
                value={form.managerId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No Manager</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.fullName} ({m.department})</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Addresses (only for new employees) */}
        {!isEdit && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Addresses</h2>
              <button
                type="button"
                onClick={addAddress}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Address
              </button>
            </div>
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">No addresses added yet</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <select
                        value={addr.addressType}
                        onChange={(e) => updateAddress(idx, 'addressType', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Current">Current</option>
                        <option value="Permanent">Permanent</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeAddress(idx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={addr.streetAddress}
                          onChange={(e) => updateAddress(idx, 'streetAddress', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="City"
                        value={addr.city}
                        onChange={(e) => updateAddress(idx, 'city', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addr.state}
                        onChange={(e) => updateAddress(idx, 'state', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={addr.postalCode}
                        onChange={(e) => updateAddress(idx, 'postalCode', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={addr.country}
                        onChange={(e) => updateAddress(idx, 'country', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to={isEdit ? `/employees/${id}` : '/employees'}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : (isEdit ? 'Update Employee' : 'Create Employee')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;