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

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                minLength={5}
                className="w-full p-3 border rounded-xl"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                required
                minLength={10}
                rows={4}
                className="w-full p-3 border rounded-xl"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <button
                disabled={submitting}
                className="w-full py-3 bg-purple-600 text-white rounded-xl"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </motion.div>
        )}

        {/* COMPLAINT LIST */}
        <div className="space-y-4">
          {complaints.map((complaint, index) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow border"
            >
              <h3 className="text-xl font-bold">{complaint.title}</h3>
              <p className="text-gray-600 mb-3">{complaint.description}</p>

              <div className="flex gap-2">
                <span className={`px-3 py-1 text-white rounded-full ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
                <span className={`px-3 py-1 text-white rounded-full ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <FaClock />
                {new Date(complaint.createdAt).toLocaleDateString()}
              </div>
            </motion.div> 
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
