import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (err) {
      console.error('Error parsing user data:', err);
      handleLogout();
    }

    // Verify token with backend (optional)
    verifyToken(token);
  }, [navigate]);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token invalid');
      }

      setLoading(false);
    } catch (error) {
      console.error('Token verification failed:', error);
      setError('Session expired. Please log in again.');
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-white text-xl font-poppins">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', active: true },
    { label: 'Patients', active: false },
    { label: 'Doctors', active: false },
    { label: 'Appointments', active: false },
    { label: 'Departments', active: false },
    { label: 'Pharmacy', active: false },
    { label: 'Laboratory', active: false },
    { label: 'Billing', active: false },
    { label: 'Reports', active: false },
    { label: 'Settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 font-poppins">
      {/* Header - Same as before */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 fixed top-0 w-full z-30">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
            </button>
            <div className="text-white text-xl font-semibold">
              Hospital Management System
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white/80 text-sm hidden md:block">
              Welcome, {user?.name}
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-white px-6 py-2 rounded-full transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} fixed left-0 h-[calc(100vh-64px)] bg-white/10 backdrop-blur-md border-r border-white/20 transition-all duration-300 overflow-hidden z-20`}>
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                    item.active 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 p-6`}>
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white backdrop-blur-md">
              {error}
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 
            </h1>
            <p className="text-white/80">
              Here's what's happening in your hospital today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div />
                <div className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-200 text-sm">+12%</div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Total Patients</h3>
              <p className="text-white text-3xl font-bold">1,284</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div />
                <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-200 text-sm">Today</div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Appointments</h3>
              <p className="text-white text-3xl font-bold">48</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div />
                <div className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-200 text-sm">Active</div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Doctors On Duty</h3>
              <p className="text-white text-3xl font-bold">32</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div />
                <div className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-200 text-sm">85%</div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Bed Occupancy</h3>
              <p className="text-white text-3xl font-bold">127/150</p>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg">
              <h2 className="text-white text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <p className="text-white font-medium">New patient registered</p>
                    <p className="text-white/60 text-sm">John Doe - 2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <p className="text-white font-medium">Lab report completed</p>
                    <p className="text-white/60 text-sm">Patient ID: #12845 - 15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <p className="text-white font-medium">Pharmacy stock alert</p>
                    <p className="text-white/60 text-sm">Aspirin running low - 1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg">
              <h2 className="text-white text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/add-patient')}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-white p-4 rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 flex flex-col items-center space-y-2"
                >
                  <span className="text-sm font-medium">Add Patient</span>
                </button>
                <button className="bg-green-500/20 hover:bg-green-500/30 text-white p-4 rounded-xl transition-all duration-300 border border-green-500/30 hover:border-green-500/50 flex flex-col items-center space-y-2">
                  <span className="text-sm font-medium">Schedule</span>
                </button>
                <button className="bg-purple-500/20 hover:bg-purple-500/30 text-white p-4 rounded-xl transition-all duration-300 border border-purple-500/30 hover:border-purple-500/50 flex flex-col items-center space-y-2">
                  <span className="text-sm font-medium">Reports</span>
                </button>
                <button className="bg-orange-500/20 hover:bg-orange-500/30 text-white p-4 rounded-xl transition-all duration-300 border border-orange-500/30 hover:border-orange-500/50 flex flex-col items-center space-y-2">
                  <span className="text-sm font-medium">Billing</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Name</p>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Email</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">User ID</p>
                <p className="text-white font-medium">{user?.id}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Account Status</p>
                <p className="text-white font-medium">Active</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Login Status</p>
                <p className="text-white font-medium">Online</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Last Login</p>
                <p className="text-white font-medium">Just now</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;