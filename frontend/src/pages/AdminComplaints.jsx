import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTimes, FaHome, FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';

const AdminComplaints = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [formData, setFormData] = useState({
    status: '',
    department: '',
    userId: '',
    adminResponse: ''
  });

  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsersList(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;

      const response = await adminAPI.getAllComplaints(params);
      setComplaints(response.data.data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      alert(error.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await adminAPI.updateComplaint(selectedComplaint._id, { status: formData.status });
      setShowModal(false);
      setSuccessMessage('Complaint status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchComplaints();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssign = async () => {
    if (!formData.department) {
      alert('Please select a department');
      return;
    }
    try {
      await adminAPI.assignComplaint(selectedComplaint._id, {
        department: formData.department,
        userId: formData.userId || null
      });
      setShowModal(false);
      setFormData({ status: '', department: '', userId: '', adminResponse: '' });
      setSuccessMessage('Complaint assigned successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchComplaints();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign complaint');
    }
  };

  const handleRespond = async () => {
    try {
      await adminAPI.respondToComplaint(selectedComplaint._id, {
        adminResponse: formData.adminResponse
      });
      setShowModal(false);
      setSuccessMessage('Response sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchComplaints();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to respond');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await adminAPI.deleteComplaint(id);
        fetchComplaints();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete complaint');
      }
    }
  };

  const openModal = (complaint, type) => {
    setSelectedComplaint(complaint);
    setModalType(type);
    
    if (type === 'status') {
      setFormData({ ...formData, status: complaint.status || '' });
    } else if (type === 'assign') {
      const assignedDepartment = complaint.assignedTo?.department || '';
      const assignedStaffName = complaint.assignedTo?.staffName || '';
      const assignedUser = usersList.find(u => u.name === assignedStaffName);
      setFormData({ 
        ...formData, 
        department: assignedDepartment, 
        userId: assignedUser?._id || '' 
      });
    } else if (type === 'respond') {
      setFormData({ ...formData, adminResponse: complaint.adminResponse || '' });
    } else {
      setFormData({ status: '', department: '', userId: '', adminResponse: '' });
    }
    
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-500',
      'In-Progress': 'bg-blue-500',
      'Resolved': 'bg-green-500',
      'Closed': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-500',
      'Medium': 'bg-yellow-500',
      'High': 'bg-red-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="p-2 bg-white rounded-lg shadow hover:bg-gray-100"
            >
              <FaArrowLeft />
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">Manage Complaints</h1>
          </div>
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              <FaHome /> Home
            </Link>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
            >
              View Analytics
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-purple-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              <option value="Service">Service</option>
              <option value="Technical">Technical</option>
              <option value="Staff">Staff</option>
              <option value="Delivery">Delivery</option>
              <option value="Billing">Billing</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </motion.div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <FaCheck className="text-green-600" />
            {successMessage}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="space-y-4">
            {complaints.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <FaSearch className="text-4xl text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No complaints found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {complaints.map((complaint, index) => (
                  <motion.div
                    key={complaint._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all bg-gradient-to-r from-white to-purple-50/30"
                  >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{complaint.title}</h3>
                      <p className="text-gray-600 mb-4">{complaint.description}</p>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {complaint.category}
                        </span>
                        <span className={`px-3 py-1 ${getPriorityColor(complaint.priority)} text-white rounded-full text-sm font-semibold`}>
                          {complaint.priority}
                        </span>
                        <span className={`px-3 py-1 ${getStatusColor(complaint.status)} text-white rounded-full text-sm font-semibold`}>
                          {complaint.status}
                        </span>
                      </div>
                      {complaint.assignedTo?.department && (
                        <p className="text-sm text-gray-600 mb-2">
                          Assigned to: {complaint.assignedTo.department}
                          {complaint.assignedTo.staffName && ` - ${complaint.assignedTo.staffName}`}
                        </p>
                      )}
                      {complaint.adminResponse && (
                        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                          <p className="text-sm font-semibold text-blue-800 mb-1">Admin Response:</p>
                          <p className="text-blue-700">{complaint.adminResponse}</p>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-4">
                        User: {complaint.user?.name} ({complaint.user?.email}) | 
                        Created: {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => openModal(complaint, 'status')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                      >
                        <FaEdit /> Status
                      </button>
                      <button
                        onClick={() => openModal(complaint, 'assign')}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all flex items-center gap-2"
                      >
                        <FaCheck /> Assign
                      </button>
                      <button
                        onClick={() => openModal(complaint, 'respond')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                      >
                        <FaEdit /> Respond
                      </button>
                      <button
                        onClick={() => handleDelete(complaint._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100"
            >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {modalType === 'status' && 'Update Status'}
              {modalType === 'assign' && 'Assign Complaint'}
              {modalType === 'respond' && 'Respond to Complaint'}
            </h2>

            {modalType === 'status' && (
              <div className="space-y-4">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdateStatus}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Update
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ status: '', department: '', userId: '', adminResponse: '' });
                    }}
                    className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}

            {modalType === 'assign' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value, staffId: '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Service">Service</option>
                    <option value="Technical">Technical</option>
                    <option value="Staff">Staff</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Billing">Billing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Assign to Team Member (Optional)</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="">Select Team Member</option>
                    {usersList.length === 0 ? (
                      <option value="" disabled>No registered users available</option>
                    ) : (
                      usersList.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} {user.email ? `(${user.email})` : ''}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Select a registered team member to assign this complaint</p>
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAssign}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Assign
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ status: '', department: '', userId: '', adminResponse: '' });
                    }}
                    className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}

            {modalType === 'respond' && (
              <div className="space-y-4">
                <textarea
                  placeholder="Admin Response"
                  value={formData.adminResponse}
                  onChange={(e) => setFormData({ ...formData, adminResponse: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRespond}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Send Response
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ status: '', department: '', userId: '', adminResponse: '' });
                    }}
                    className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminComplaints;

