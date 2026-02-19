import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeForm from './pages/EmployeeForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center px-2 py-2 text-xl font-bold text-blue-600">
                  Employee Portal
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-blue-500"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/employees"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-blue-500"
                  >
                    Employees
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  to="/employees/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  + Add Employee
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />
            <Route path="/employees/:id/edit" element={<EmployeeForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;