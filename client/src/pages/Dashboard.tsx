import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black dark:bg-white">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black dark:bg-white">
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center py-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Movie Reservation Dashboard</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.avatar || '/default-avatar.svg'} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <span className="font-medium text-gray-700 dark:text-gray-300 text-lg">{user.fullname}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Welcome back, {user.fullname}!</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Ready to book your next movie experience?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="text-5xl mb-6">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Browse Movies</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Discover the latest movies and showtimes</p>
            <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
              View Movies
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="text-5xl mb-6">🎫</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">My Tickets</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">View your booking history and upcoming shows</p>
            <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
              View Tickets
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="text-5xl mb-6">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Theaters</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Find theaters near you</p>
            <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
              Find Theaters
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="text-5xl mb-6">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Profile</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your account settings</p>
            <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</label>
              <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone:</label>
              <p className="text-gray-900 dark:text-gray-100">{user.phone}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location:</label>
              <p className="text-gray-900 dark:text-gray-100">{user.city}, {user.state}, {user.country}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role:</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                user.role === 'admin' 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
              }`}>
                {user.role}
              </span>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since:</label>
              <p className="text-gray-900 dark:text-gray-100">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Verification Status:</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                user.isVerified 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                {user.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;