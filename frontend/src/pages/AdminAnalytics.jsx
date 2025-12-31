import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartBar, FaChartLine, FaExclamationTriangle, FaHome, FaChartPie } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../utils/api';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [frequentIssues, setFrequentIssues] = useState([]);
  const [priorityStats, setPriorityStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear]);

  const fetchAnalytics = async () => {
    try {
      const [categoryRes, monthlyRes, frequentRes, priorityRes] = await Promise.all([
        analyticsAPI.getCategoryStats(),
        analyticsAPI.getMonthlyTrends(selectedYear),
        analyticsAPI.getFrequentIssues(10),
        analyticsAPI.getPriorityStats()
      ]);

      setCategoryStats(categoryRes.data.data);
      setMonthlyTrends(monthlyRes.data.data);
      setFrequentIssues(frequentRes.data.data);
      setPriorityStats(priorityRes.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
  };

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
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="p-2 bg-white rounded-lg shadow hover:bg-gray-100"
            >
              <FaArrowLeft />
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">Analytics Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              <FaHome /> Home
            </Link>
            <button
              onClick={() => navigate('/admin/complaints')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
            >
              Manage Complaints
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                <FaChartBar className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Category Statistics</h2>
            </div>
            <div className="space-y-4">
              {categoryStats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No category data available</p>
              ) : (
                categoryStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">{stat._id}</h3>
                    <span className="text-2xl font-bold text-purple-600">{stat.count}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-yellow-600 font-semibold">{stat.pending}</p>
                      <p className="text-gray-500">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-blue-600 font-semibold">{stat.inProgress}</p>
                      <p className="text-gray-500">In Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600 font-semibold">{stat.resolved}</p>
                      <p className="text-gray-500">Resolved</p>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                <FaChartLine className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Monthly Trends</h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-4"
            >
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {[2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </motion.div>
            <div className="space-y-4">
              {monthlyTrends.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No monthly data available</p>
              ) : (
                monthlyTrends.map((trend, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">
                      {getMonthName(trend._id.month)} {trend._id.year}
                    </h3>
                    <span className="text-2xl font-bold text-purple-600">{trend.count}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-yellow-600 font-semibold">{trend.pending}</p>
                      <p className="text-gray-500">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-blue-600 font-semibold">{trend.inProgress}</p>
                      <p className="text-gray-500">In Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600 font-semibold">{trend.resolved}</p>
                      <p className="text-gray-500">Resolved</p>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
                <FaExclamationTriangle className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Frequent Issues</h2>
            </div>
            <div className="space-y-4">
              {frequentIssues.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No frequent issues found</p>
              ) : (
                frequentIssues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{issue.title}</h3>
                        <p className="text-sm text-purple-600">{issue.category}</p>
                      </div>
                      <span className="text-xl font-bold text-purple-600">{issue.count}</span>
                    </div>
                    {issue.avgResolutionTime && (
                      <p className="text-sm text-gray-500 mt-2">
                        Avg Resolution: {issue.avgResolutionTime.toFixed(1)} days
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <FaChartPie className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Priority Statistics</h2>
            </div>
            <div className="space-y-4">
              {priorityStats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No priority data available</p>
              ) : (
                priorityStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: -10 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">{stat._id} Priority</h3>
                    <span className="text-2xl font-bold text-purple-600">{stat.count}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-yellow-600 font-semibold">{stat.pending}</p>
                      <p className="text-gray-500">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-blue-600 font-semibold">{stat.inProgress}</p>
                      <p className="text-gray-500">In Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600 font-semibold">{stat.resolved}</p>
                      <p className="text-gray-500">Resolved</p>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

