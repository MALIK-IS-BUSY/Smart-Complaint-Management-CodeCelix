import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChartBar,
  FaClipboardList,
  FaChartLine,
  FaSignOutAlt,
  FaHome,
  FaUserShield
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setError('');
      const response = await adminAPI.getDashboard();
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load dashboard data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats?.total || 0,
      color: 'from-blue-500 to-blue-600',
      icon: <FaClipboardList className="text-3xl" />
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      color: 'from-yellow-500 to-yellow-600',
      icon: <FaChartBar className="text-3xl" />
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      color: 'from-indigo-500 to-indigo-600',
      icon: <FaChartLine className="text-3xl" />
    },
    {
      title: 'Resolved',
      value: stats?.resolved || 0,
      color: 'from-green-500 to-green-600',
      icon: <FaChartBar className="text-3xl" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaUserShield className="text-2xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-purple-200 text-lg">
              Welcome back,{' '}
              <span className="text-pink-300 font-semibold">
                {admin?.username}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold flex items-center gap-2"
              >
                <FaHome /> Home
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/complaints')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold"
            >
              Manage Complaints
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/analytics')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold"
            >
              Analytics
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-semibold flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
      {/* ✅ FIXED: motion.div properly closed */}

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-8">

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-xl cursor-pointer`}
            >
              <div className="flex justify-between items-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-white/80 text-sm font-semibold mb-2">
                {card.title}
              </h3>
              <p className="text-4xl font-bold">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* RECENT COMPLAINTS */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Complaints
            </h2>
            <button
              onClick={() => navigate('/admin/complaints')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              View All
            </button>
          </div>

          {stats?.recentComplaints?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {complaint.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {complaint.description.substring(0, 100)}...
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/admin/complaints')}
                      className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No complaints yet. Complaints will appear here once users submit them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
