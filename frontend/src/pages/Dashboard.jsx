import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaList,
  FaSpinner,
  FaHome,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // ✅ FIX

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Service',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintAPI.getAll();
      setComplaints(response.data.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await complaintAPI.submit(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'Service',
        priority: 'Medium'
      });
      setSuccessMessage('Complaint submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => ({
    Pending: 'bg-yellow-500',
    'In-Progress': 'bg-blue-500',
    Resolved: 'bg-green-500',
    Closed: 'bg-gray-500'
  }[status] || 'bg-gray-500');

  const getPriorityColor = (priority) => ({
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500'
  }[priority] || 'bg-gray-500');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-gray-600">Manage your complaints</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/"
              className="px-6 py-3 bg-gray-500 text-white rounded-xl flex items-center gap-2"
            >
              <FaHome /> Home
            </Link>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl flex items-center gap-2"
            >
              <FaPlus /> {showForm ? 'Cancel' : 'Submit Complaint'}
            </button>

            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 text-white rounded-xl"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* FORM */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
                <FaExclamationCircle /> {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
                <FaCheckCircle /> {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Complaint Title</label>
                <input
                  type="text"
                  placeholder="Enter complaint title"
                  required
                  minLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  placeholder="Describe your complaint in detail"
                  required
                  minLength={10}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Service">Service</option>
                    <option value="Technical">Technical</option>
                    <option value="Staff">Staff</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Billing">Billing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Submit Complaint
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* COMPLAINT LIST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <FaList className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Complaints</h2>
            <span className="ml-auto px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {complaints.length} {complaints.length === 1 ? 'Complaint' : 'Complaints'}
            </span>
          </div>

          {complaints.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <FaList className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-4">No complaints yet. Submit your first complaint!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <FaPlus className="inline mr-2" />
                Submit Complaint
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint, index) => (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all bg-gradient-to-r from-white to-purple-50/30"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-800 flex-1">{complaint.title}</h3>
                        <span className={`px-3 py-1 ${getStatusColor(complaint.status)} text-white rounded-full text-xs font-semibold whitespace-nowrap`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{complaint.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                          {complaint.category}
                        </span>
                        <span className={`px-3 py-1 ${getPriorityColor(complaint.priority)} text-white rounded-full text-sm font-semibold shadow-sm`}>
                          {complaint.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {complaint.adminResponse && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaCheckCircle className="text-blue-600" />
                        <p className="text-sm font-semibold text-blue-800">Admin Response:</p>
                      </div>
                      <p className="text-blue-700">{complaint.adminResponse}</p>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock />
                      <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    {complaint.status === 'Resolved' && (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                        <FaCheckCircle />
                        Resolved
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
