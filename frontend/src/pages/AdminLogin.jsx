import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(formData.username, formData.password);
      if (result.success) {
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 100);
      } else {
        setError(result.message || 'Invalid credentials. Please check your username and password.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">

      {/* BACKGROUND BLOBS (kept) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white relative z-10 border border-white/20"
      >

        {/* 🔒 ADMIN HEADER (NO ANIMATION) */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-4">
            <FaShieldAlt className="text-4xl" />
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
            Admin Portal
          </h2>
          <p className="text-purple-200">Secure administrative access</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            >
              ⚠ {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center border border-white/30 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:bg-white/5 transition-all"
          >
            <FaUser className="mr-3 text-white/80 text-lg" />
            <input
              type="text"
              name="username"
              placeholder="Admin Username"
              value={formData.username}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-white placeholder-white/70"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center border border-white/30 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:bg-white/5 transition-all"
          >
            <FaLock className="mr-3 text-white/80 text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-white placeholder-white/70"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Authenticating...
              </>
            ) : (
              <>
                Admin Login
                <FaShieldAlt />
              </>
            )}
          </motion.button>
        </form>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm"
        >
          <p className="text-white/70">
            Regular user?{' '}
            <Link
              to="/login"
              className="text-pink-400 hover:text-pink-300 font-semibold inline-flex items-center gap-1"
            >
              User Login <FaArrowRight className="text-xs" />
            </Link>
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AdminLogin;
